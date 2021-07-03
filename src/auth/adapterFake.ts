import 'reflect-metadata';
import { Service } from 'typedi';
import { AccountAdapterBase } from './adapterBase';
import { IUserAccount, LoadUserAccountInput, CreateUserAccountInput, 
    CreateUserAccountResult, UserProfilePayload } from './model';


interface AccountDict {
    [id: string]: IUserAccount;
};

@Service()
export class FakeAccountAdapter implements AccountAdapterBase {
    protected accountDict: AccountDict = {};
    protected mockConnected:boolean = false;

    constructor() { }

    async connectToCollection(): Promise<void> {
        this.mockConnected = true;
    }

    connected(): boolean { return this.mockConnected; }

    public async loadUserAccount(input: LoadUserAccountInput): 
        Promise<IUserAccount | undefined> {
        return this.accountDict[input.email];
    }

    public async createUserAccount(input: CreateUserAccountInput): 
        Promise<CreateUserAccountResult> {
        const acc = await this.loadUserAccount(input);
        if(acc !== undefined) return { err: 'duplicate account' };

        this.accountDict[input.email] = {
            userId: input.userId as string,
            nickname: input.nickname as string,
            email: input.email,
            password: input.password as string,
            created: new Date()
        };

        return {
            err: 'ok'
        };
    }

    async deleteUserAccount(input: LoadUserAccountInput): Promise<number> {
        const acc = await this.loadUserAccount(input);
        if(acc === undefined) return 0;

        delete(this.accountDict[input.email]);
        return 1;
    }

    async loadUserProfile(userId: string): Promise<UserProfilePayload|null> {
        const account: IUserAccount | undefined = this.accountDict[userId];
        if(account === undefined) return null;

        return {
            userId: account.userId,
            nickname: account.nickname,
            headerUrl: account.headerUrl? account.headerUrl : ''
        };
    }
}