import 'reflect-metadata';
import { Container, Service } from 'typedi';
import dotenv from 'dotenv';

import { AccountAdapterBase } from './adapterBase';
import { AccountAdapter } from './adapter';
import { FakeAccountAdapter } from './adapterFake';
import {
  IUserAccount,
  CreateUserAccountInput,
  CreateUserAccountResult,
  UserProfilePayload,
  LoadUserAccountInput,
} from './model';

dotenv.config();

@Service()
export class AccountRepositoryFactory {
  createRepository(): AccountRepository {
    return new AccountRepository(Container.get(AccountAdapter));
  }

  createFakeRepository(): AccountRepository {
    return new AccountRepository(Container.get(FakeAccountAdapter));
  }
}

const initializer =
  process.env.PERSISTENCE === 'memory'
    ? 'createFakeRepository'
    : 'createRepository';

@Service({ factory: [AccountRepositoryFactory, initializer] })
export class AccountRepository {
  protected projection: string = 'email password';

  constructor(protected accountAdapter: AccountAdapterBase) {}

  async loadUserAccount(input: LoadUserAccountInput): Promise<IUserAccount> {
    return this.accountAdapter.loadUserAccount(input, this.projection);
  }

  async createUserAccount(
    input: CreateUserAccountInput,
  ): Promise<CreateUserAccountResult> {
    if (!this.isValidCreateInput(input)) return { err: 'required field empty' };

    return this.accountAdapter.createUserAccount(input);
  }

  protected isValidCreateInput(input: CreateUserAccountInput): boolean {
    if (!input.nickname) return false;
    if (!input.email) return false;
    if (!input.password) return false;

    return true;
  }

  async loadUserProfile(
    userId: string,
  ): Promise<UserProfilePayload | undefined> {
    return this.accountAdapter.loadUserProfile(userId);
  }

  async cleaupData() {
    await this.accountAdapter.cleanupData();
  }
}
