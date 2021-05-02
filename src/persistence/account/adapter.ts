import mongoose from 'mongoose';

import logger from '../../common/logger';
import { IUserAccount, IUserAccountDoc, UserAccountSchema, UserAccountInput, UserProfilePayload } from './model';


export class AccountAdapter {
    protected conn: mongoose.Connection;
    protected connectOptions: mongoose.ConnectionOptions = {
        useNewUrlParser: true,
        useUnifiedTopology: true
    };
    protected address: string = '';

    protected collectionName: string = 'account';
    protected accountModel: mongoose.Model<IUserAccountDoc>;
    //protected projection: string = '_id userId nickname password email created loggedIn';
    protected projection: string = 'email password';


    constructor(address: string) {
        this.address = address;
        logger.info('AccountAdapter: ' + this.address);
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

    async loadUserAccount(input: UserAccountInput, projection: string = this.projection):
        Promise<IUserAccount | null> {
        return await this.accountModel.findOne({
            email: input.email
        }, projection).lean();
    }

    async createUserAccount(input: UserAccountInput): Promise<IUserAccount> {
        return await this.accountModel.create({
            userId: input.userId as string,
            nickname: input.nickname as string,
            email: input.email,
            password: input.password as string,
            created: new Date()
        });
    }

    async deleteUserAccount(input: UserAccountInput): Promise<number> {
        const response = await this.accountModel.deleteOne({email: input.email});
        return response.deletedCount ? response.deletedCount : 0;
    }
    
    async loadUserProfile(userId: string): Promise<UserProfilePayload> {
        const accountData: IUserAccount = await this.accountModel.findOne(
            {userId: userId}, 'userId nickname headerUrl').lean() as IUserAccount;

        return {
            userId: accountData.userId,
            nickname: accountData.nickname,
            headerUrl: accountData.headerUrl? accountData.headerUrl : ''
        };
    }
};