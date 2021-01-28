import mongoose  from 'mongoose';

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

    async loadFollows(userId: string): Promise<Set<string>|undefined> {
        const findResult: IFollowsDoc = await this.followsModel.findOne({userId: userId})
        .slice('follows', [1, 5]) as IFollowsDoc;

        return new Set(findResult.follows);
    }

    async loadFollowers(userId: string): Promise<Set<string>|undefined> {
        const findResult: IFollowsDoc = await this.followsModel.findOne({userId: userId})
        .slice('followers', [1, 5]) as IFollowsDoc;

        return new Set(findResult.followers);
    }

    async relate(followId: string, followerId: string): Promise<RelateResult> {
        try {
            await this.followsModel.update({ userId: followId}, {
                $push: { followers: followerId }
            });

            await this.followsModel.update({ userId: followerId }, {
                $push: { follows: followId }
            });

            return {
                err: 'ok'
            };
        } catch (err: any) {
            return {
                err: 'server error'
            };
        }
    }
};