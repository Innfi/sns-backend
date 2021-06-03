import bcrypt from 'bcrypt';
import logger from '../../common/logger';
import { AccountAdapter } from './adapter';
import { MockAccountAdapter } from './mockAdapter';
import { IUserAccount, UserAccountInput, UserProfilePayload } from './model';


export class AccountRepository {
    public accountAdapter: AccountAdapter;

    constructor() {}

    async loadUserAccount(input: UserAccountInput): Promise<IUserAccount | null> {
        try {
            return await this.accountAdapter.loadUserAccount(input);
        } catch (err: any) {
            logger.error(input.email + '] loadUserAccount: ' +  err);
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
            logger.error(input.email + '] createUserAccount: ' +  err);
            return null;
        }
    }

    async loadUserProfile(userId: string): Promise<UserProfilePayload | null> {
        try {
            //TODO: caching

            return await this.accountAdapter.loadUserProfile(userId);
        } catch (err: any) {
            logger.error(`${userId}] loadUserProfile: + ${err}`);
            return null;
        }
    }
}

export const accRepo = new AccountRepository();
accRepo.accountAdapter = new MockAccountAdapter();