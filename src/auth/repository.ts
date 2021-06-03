import 'reflect-metadata';
import { Container, Service } from 'typedi';
import bcrypt from 'bcrypt';
import { AccountAdapterBase } from './adapterBase';
import { AccountAdapter } from './adapter';
import { MockAccountAdapter } from './mockAdapter';
import { IUserAccount, UserAccountInput, UserProfilePayload } from './model';


@Service()
export class AccountRepositoryFactory {
    createRepository(): AccountRepository {
        return new AccountRepository(Container.get(AccountAdapter));
    }

    createMockRepository(): AccountRepository {
        return new AccountRepository(Container.get(MockAccountAdapter));
    }
}

@Service({ factory: [ AccountRepositoryFactory, 'createMockRepository']})
export class AccountRepository {
    protected projection: string = 'email password';

    constructor(protected accountAdapter: AccountAdapterBase) {}

    async loadUserAccount(input: UserAccountInput): Promise<IUserAccount | null> {
        try {
            return await this.accountAdapter.loadUserAccount(input, this.projection);
        } catch (err: any) {
            //logger.error(input.email + '] loadUserAccount: ' +  err);
            return null;
        }
    }

    async createUserAccount(input: UserAccountInput): Promise<IUserAccount | null> {
        try {
            return await this.accountAdapter.createUserAccount({
                email: input.email,
                password: await bcrypt.hash(input.password, 10)
            });
        } catch (err: any) {
            //logger.error(input.email + '] createUserAccount: ' +  err);
            return null;
        }
    }

    //async loadUserProfile(userId: string): Promise<UserProfilePayload | null> {
    //    try {
    //        //TODO: caching

    //        return await this.accountAdapter.loadUserProfile(userId);
    //    } catch (err: any) {
    //        logger.error(`${userId}] loadUserProfile: + ${err}`);
    //        return null;
    //    }
    //}
}