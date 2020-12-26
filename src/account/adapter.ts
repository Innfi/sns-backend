import mongoose from 'mongoose';

import logger from '../common/logger';
import { IUserAccount, UserAccountSchema } from './model';


export class AccountAdapter {
    protected conn: mongoose.Connection;
    protected connectOptions: mongoose.ConnectionOptions = {
        useNewUrlParser: true,
        useUnifiedTopology: true
    };
    protected address: string = '';

    protected collectionName: string = 'account';
    protected accountModel: mongoose.Model<IUserAccount>;
    protected projection: string = '_id useId nickname password email created loggedIn';


    constructor(address: string) {
        this.address = address;
        logger.info('AccountAdapter: ' + this.address);
    }

    async connectToCollection() {
        this.conn = await mongoose.createConnection(
            this.address, this.connectOptions);

        this.accountModel = this.conn.model<IUserAccount, mongoose.Model<IUserAccount>>(
            this.collectionName, UserAccountSchema);
    }

    connected(): boolean {
        return this.conn.readyState === mongoose.STATES.connected;
    }

    async createUserAccount(input: any): Promise<IUserAccount> { //FIXME: input
        return await this.accountModel.create({
            userId: input.userId,
            nickname: input.nickname,
            email: input.email,
            password: input.password,
            created: new Date()
        });
    }

    async loadUserAccount(input: any, projection: string = this.projection) {
        return this.accountModel.findOne({
            email: input.email, password: input.password
        }, projection, (err: any, res: IUserAccount) => {
            if(err) {
                logger.error('loadUserAccount: ' + err);
                return undefined;
            }

            return res;
        });
    }
};