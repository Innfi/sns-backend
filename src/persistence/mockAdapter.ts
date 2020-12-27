import { AccountAdapter } from './adapter';
import { IUserAccount, UserAccountInput } from './model';
import logger from '../common/logger';


interface AccountDict {
    [id: string]: IUserAccount;
};

export class MockAccountAdapter extends AccountAdapter {
    protected accountDict: AccountDict = {};

    constructor() {
        super('');
    }

    connected(): boolean { return true; }

    async loadUserAccount(input: UserAccountInput): Promise<IUserAccount | null> {
        logger.info('MockAccountAdapter.loadUserAccount');

        return this.accountDict[input.email];
    }

    async createUserAccount(input: UserAccountInput): Promise<IUserAccount> {
        logger.info('MockAccountAdapter.createUserAccount');

        const acc = await this.loadUserAccount(input);
        if(acc !== null)  return acc;

        return {
            userId: input.userId as string,
            nickname: input.nickname as string,
            email: input.email,
            password: input.password,
            created: new Date()
        };
    }

    
};