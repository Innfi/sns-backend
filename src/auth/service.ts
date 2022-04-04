import { Service } from 'typedi';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { LoggerBase } from '../common/logger';
import {
  AccountRepository,
  AuthenticateResponse,
  CreateUserAccountInput,
  CreateUserAccountResult,
  IUserAccount,
  LoadUserAccountInput,
  PassportInitializer,
} from '.';

@Service()
export class AccountService {
  constructor(
    protected accRepo: AccountRepository,
    protected passportInitializer: PassportInitializer,
    protected logger: LoggerBase,
  ) {}

  // createUserAccount
  async createUserAccount(
    input: CreateUserAccountInput,
  ): Promise<CreateUserAccountResult> {
    try {
      input.password = await bcrypt.hash(input.password, 10);

      return await this.accRepo.createUserAccount(input);
    } catch (err: any) {
      this.logger.error(
        `createUserAccount] email: ${input.email}, err: ${err}`,
      );
      return {
        err: 'server error',
      };
    }
  }

  // authenticate
  async authenticate(
    input: LoadUserAccountInput,
  ): Promise<AuthenticateResponse> {
    try {
      const userAccount: IUserAccount | undefined =
        await this.accRepo.loadUserAccount(input);
      if (!userAccount) {
        return { err: 'auth error', email: input.email };
      }

      const password: string = userAccount.password as string;
      const pass: boolean = await bcrypt.compare(input.password, password);
      if (!pass) {
        return { err: 'auth error', email: input.email };
      }

      return {
        err: 'ok',
        email: input.email,
        userId: userAccount.userId,
        nickname: userAccount.nickname,
        jwtToken: this.toJwtToken(input),
      };
    } catch (err: any) {
      this.logger.error(`authenticate] email: ${input.email}, err: ${err}`);
      return {
        err: 'error',
        email: input.email,
      };
    }
  }

  protected toJwtToken(userData: LoadUserAccountInput): string {
    return jwt.sign(
      {
        email: userData.email,
        password: userData.password,
      },
      this.passportInitializer.secret(),
    );
  }

  // loadUserAccount
  async loadUserAccount(
    input: LoadUserAccountInput,
  ): Promise<IUserAccount | undefined> {
    try {
      return await this.accRepo.loadUserAccount(input);
    } catch (err: any) {
      this.logger.error(`loadUserAccount] email: ${input.email}, err: ${err}`);
      return undefined;
    }
  }

  // async loadUserProfile(userId: string): Promise<UserProfilePayload | null> {
  //     try {
  //         //TODO: caching

  //     } catch (err: any) {
  //         this.logger.error(`${userId}] loadUserProfile: + ${err}`);
  //         return null;
  //     }
  // }
}
