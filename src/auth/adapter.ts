import 'reflect-metadata';
import { Service } from 'typedi';
import mongoose from 'mongoose';

import { CommonConfig } from '../common/config';
import { LoggerBase } from '../common/logger';
import { AccountAdapterBase } from './adapterBase';
import { IUserAccount, IUserAccountDoc, UserAccountSchema, LoadUserAccountInput, 
    CreateUserAccountInput, CreateUserAccountResult, UserProfilePayload } from './model';


@Service()
export class AccountAdapter implements AccountAdapterBase {
    protected conn: mongoose.Connection;
    protected connectOptions: mongoose.ConnectionOptions = {
        useNewUrlParser: true,
        useUnifiedTopology: true
    };
    protected address: string = '';

    protected collectionName: string = 'account';
    protected accountModel: mongoose.Model<IUserAccountDoc>;
    protected projection: string = '_id userId nickname password email created loggedIn';
    //protected projection: string = 'email password';


    constructor(protected config: CommonConfig, protected logger: LoggerBase) {
        this.address = config.dbUrl;
        this.logger.info('AccountAdapter: ' + this.address);
    }

    async connectToCollection(): Promise<void> {
        this.conn = await mongoose.createConnection(
            this.address, this.connectOptions);

        this.accountModel = this.conn.model<IUserAccountDoc, mongoose.Model<IUserAccountDoc>>(
            this.collectionName, UserAccountSchema);
    }

    connected(): boolean {
        return this.conn?.readyState === mongoose.STATES.connected;
    }

    async loadUserAccount(input: LoadUserAccountInput, projection?: string):
        Promise<IUserAccount | undefined> {
        if(!this.connected()) this.connectToCollection();

        return await this.accountModel.findOne({
            email: input.email
        }, projection? projection : this.projection).lean();
    }

    async createUserAccount(input: CreateUserAccountInput): Promise<CreateUserAccountResult> {
        if(!this.connected()) this.connectToCollection();

        const result = await this.accountModel.create({
            userId: input.userId as string,
            nickname: input.nickname as string,
            email: input.email,
            password: input.password as string,
            created: new Date()
        });

        return {
            err: 'ok'
        };
    }

    async deleteUserAccount(input: LoadUserAccountInput): Promise<number> {
        const response = await this.accountModel.deleteOne({email: input.email});
        return response.deletedCount ? response.deletedCount : 0;
    }
    
    async loadUserProfile(userId: string): Promise<UserProfilePayload|null> {
        if(!this.connected()) this.connectToCollection();
        
        const accountData: IUserAccount = await this.accountModel.findOne(
            {userId: userId}, 'userId nickname headerUrl').lean() as IUserAccount;

        return {
            userId: accountData.userId,
            nickname: accountData.nickname,
            headerUrl: accountData.headerUrl? accountData.headerUrl : ''
        };
    }
}


