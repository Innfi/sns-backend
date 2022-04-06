import { Service } from 'typedi';
import { v4 } from 'uuid';

import {
  CreateUserAccountInput,
  CreateUserAccountResult,
  IUserAccount,
  LoadUserAccountInput,
  UserProfilePayload,
} from './model';
import { AccountAdapterBase } from './adapterBase';

interface AccountDict {
  [id: string]: IUserAccount;
}

@Service()
class FakeAccountAdapter implements AccountAdapterBase {
  protected accountDict: AccountDict = {};

  protected mockConnected: boolean = false;

  async connectToCollection() {
    this.mockConnected = true;
  }

  connected(): boolean {
    return this.mockConnected;
  }

  async loadUserAccount(input: LoadUserAccountInput): Promise<IUserAccount> {
    return this.accountDict[input.email];
  }

  async createUserAccount(
    input: CreateUserAccountInput,
  ): Promise<CreateUserAccountResult> {
    const acc = await this.loadUserAccount(input);
    if (acc !== undefined) return { err: 'duplicate account' };

    const newUserId: string = v4();
    this.accountDict[input.email] = {
      userId: newUserId,
      nickname: input.nickname as string,
      email: input.email,
      password: input.password as string,
      created: new Date(),
    };

    return {
      err: 'ok',
      userId: newUserId,
      email: input.email,
    };
  }

  async deleteUserAccount(input: LoadUserAccountInput): Promise<number> {
    const acc = await this.loadUserAccount(input);
    if (!acc) return 0;

    delete this.accountDict[input.email];
    return 1;
  }

  async loadUserProfile(
    userId: string,
  ): Promise<UserProfilePayload | undefined> {
    const account = Object.values(this.accountDict).find(
      (value: IUserAccount) => value.userId === userId,
    );

    if (!account) return undefined;

    return {
      userId: account.userId,
      nickname: account.nickname,
      headerUrl: account.headerUrl ? account.headerUrl : '',
    };
  }

  async cleanupData() {
    this.accountDict = {};
  }
}

export default FakeAccountAdapter;
