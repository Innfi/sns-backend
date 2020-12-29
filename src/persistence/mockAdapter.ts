import { AccountAdapter } from './adapter';
import { IUserAccount, UserAccountInput } from './model';


interface AccountDict {
    [id: string]: IUserAccount;
};

export class MockAccountAdapter extends AccountAdapter {
    protected accountDict: AccountDict = {};
    protected mockConnected:boolean = false;

    constructor() {
        super('');
    }

    async connectToCollection(): Promise<void> {
        this.mockConnected = true;
    }

    connected(): boolean { return this.mockConnected; }

    async loadUserAccount(input: UserAccountInput): Promise<IUserAccount | null> {
        const result = this.accountDict[input.email];
        if(result === undefined) return null;

        return result;
    }

    async createUserAccount(input: UserAccountInput): Promise<IUserAccount> {
        const acc = await this.loadUserAccount(input);
        if(acc !== null) return acc;

        this.accountDict[input.email] = {
            userId: input.userId as string,
            nickname: input.nickname as string,
            email: input.email,
            password: input.password,
            created: new Date()
        };

        return await this.loadUserAccount(input) as IUserAccount;
    }

    async deleteUserAccount(input: UserAccountInput): Promise<number> {
        const acc = await this.loadUserAccount(input);
        if(acc === null) return 0;

        delete(this.accountDict[input.email]);
        return 1;
    }
};