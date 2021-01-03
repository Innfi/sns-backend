import logger from '../../common/logger';
import { AccountAdapter } from './adapter';
import { MockAccountAdapter } from './mockAdapter';
import { IUserAccount, UserAccountInput } from './model';


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
            return await this.accountAdapter.createUserAccount(input);
        } catch (err: any) {
            logger.error(input.email + '] createUserAccount: ' +  err);
            return null;
        }
    }
}

export const accRepo = new AccountRepository();
accRepo.accountAdapter = new MockAccountAdapter();