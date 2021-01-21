import mongoose from 'mongoose';

import logger from '../../common/logger';
import { IFollows, IFollowsDoc, FollowsSchema, RelateResult, FollowsInput } 
    from './model';


export class FollowsAdapter {
    protected conn: mongoose.Connection;
    protected connectOptions: mongoose.ConnectionOptions = {
        useNewUrlParser: true,
        useUnifiedTopology: true
    };
    protected address: string = '';

    protected collectionName: string = 'follows';
    protected followsModel: mongoose.Model<IFollowsDoc>;
    protected projection: string = '_id userId follows followers';


    constructor(address: string) {
        this.address = address;
        logger.info('FollowsAdapter: ' + this.address);
    }

    async connecToCollection(): Promise<void> {
        this.conn = await mongoose.createConnection(
            this.address, this.connectOptions);

        this.followsModel = this.conn.model<IFollowsDoc, mongoose.Model<IFollowsDoc>>(
            this.collectionName, FollowsSchema);
    }

    connected(): boolean {
        return this.conn?.readyState === mongoose.STATES.connected;
    }

    async loadFolloes(userId: string): Promise<Set<string>|undefined> {
        return undefined; //FIXME
    }

    async loadFollowers(userId: string): Promise<Set<string>|undefined> {
        return undefined; //FIXME
    }

    async relate(followId: string, followerId: string): Promise<RelateResult> {
        return {
            err: 'server error'
        };
    }
};