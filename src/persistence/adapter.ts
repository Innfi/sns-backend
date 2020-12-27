import mongoose from 'mongoose';

import logger from '../common/logger';
import { IUserAccount, IUserAccountDoc,
     UserAccountSchema, UserAccountInput } from './model';


export class AccountAdapter {
    protected conn: mongoose.Connection;
    protected connectOptions: mongoose.ConnectionOptions = {
        useNewUrlParser: true,
        useUnifiedTopology: true
    };
    protected address: string = '';

    protected collectionName: string = 'account';
    protected accountModel: mongoose.Model<IUserAccountDoc>;
    protected projection: string = '_id useId nickname password email created loggedIn';


    constructor(address: string) {
        this.address = address;
        logger.info('AccountAdapter: ' + this.address);
    }

    async connectToCollection() {
        this.conn = await mongoose.createConnection(
            this.address, this.connectOptions);

        this.accountModel = this.conn.model<IUserAccountDoc, mongoose.Model<IUserAccountDoc>>(
            this.collectionName, UserAccountSchema);
    }

    connected(): boolean {
        return this.conn.readyState === mongoose.STATES.connected;
    }

    async loadUserAccount(input: UserAccountInput, projection: string = this.projection):
        Promise<IUserAccount | null> {
        return await this.accountModel.findOne({
            email: input.email, password: input.password
        }, projection).lean();
    }

    async createUserAccount(input: UserAccountInput): Promise<IUserAccount> {
        return await this.accountModel.create({
            userId: input.userId as string,
            nickname: input.nickname as string,
            email: input.email,
            password: input.password,
            created: new Date()
        });
    }
};