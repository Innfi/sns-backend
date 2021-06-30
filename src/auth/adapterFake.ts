import 'reflect-metadata';
import { Service } from 'typedi';
import { AccountAdapterBase } from './adapterBase';
import { IUserAccount, UserAccountInput, UserProfilePayload } from './model';


interface AccountDict {
    [id: string]: IUserAccount;
};

// class DictSingle { 
//     private static instance: DictSingle;
//     private constructor() {}

//     public accountDict: AccountDict = {};

//     public static getInstance(): DictSingle { 
//         if(!DictSingle.instance) DictSingle.instance = new DictSingle();

//         return this.instance; 
//     }
// }

@Service()
export class AccountAdapterFake implements AccountAdapterBase {
    protected accountDict: AccountDict = {};
    protected mockConnected:boolean = false;

    constructor() { }

    async connectToCollection(): Promise<void> {
        this.mockConnected = true;
    }

    connected(): boolean { return this.mockConnected; }

    public async loadUserAccount(input: UserAccountInput): Promise<IUserAccount | null> {
        const result = this.accountDict[input.email];
        if(result === undefined) return null; 

        return result;
    }

    public async createUserAccount(input: UserAccountInput): Promise<IUserAccount> {
        const acc = await this.loadUserAccount(input);
        if(acc !== null) return acc;

        this.accountDict[input.email] = {
            userId: input.userId as string,
            nickname: input.nickname as string,
            email: input.email,
            password: input.password as string,
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

    async loadUserProfile(userId: string): Promise<UserProfilePayload|null> {
        const account: IUserAccount | undefined = this.accountDict[userId];
        if(account === undefined) return null;

        return {
            userId: account.userId,
            nickname: account.nickname,
            headerUrl: account.headerUrl? account.headerUrl : ''
        };


    //    const accounts: IUserAccount[] = Object.values(this.accountDict);

        

    //    accounts.forEach((value: IUserAccount) => {
    //        if(value.userId === userId) {
    //            return {
    //                userId: userId,
    //                nickname: value.nickname,
    //                headerUrl: value.headerUrl? value.headerUrl : ''
    //            };
    //        }
    //    });

    //    return null;
    }
}