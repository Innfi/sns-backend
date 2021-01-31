import mongoose  from 'mongoose';

import logger from '../../common/logger';
import { IFollows, IFollowsDoc, FollowsSchema, RelateResult, FollowsInput } 
    from './model';

export interface LoadFollowOptions {
    page: number;
    limit: number;
};

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
        if(this.connected()) return;

        this.conn = await mongoose.createConnection(
            this.address, this.connectOptions);

        this.followsModel = this.conn.model<IFollowsDoc, mongoose.Model<IFollowsDoc>>(
            this.collectionName, FollowsSchema);
    }

    connected(): boolean {
        return this.conn?.readyState === mongoose.STATES.connected;
    }

    async loadFollows(userId: string, options: LoadFollowOptions): 
        Promise<Set<string>|undefined> {
        const findResult: IFollowsDoc | null = await this.followsModel
            .findOne({userId: userId})
            .slice('follows', [options.page, options.limit]);
        if(findResult === null) return undefined;

        return new Set((findResult as IFollowsDoc).follows);
    }

    async loadFollowers(userId: string, options: LoadFollowOptions): 
        Promise<Set<string>|undefined> {
        const findResult: IFollowsDoc | null = await this.followsModel
            .findOne({userId: userId})
            .slice('followers', [options.page, options.limit]);
        if(findResult === null) return undefined;

        return new Set((findResult as IFollowsDoc).followers);
    }

    async relate(followId: string, followerId: string): Promise<RelateResult> {
        try {
            await this.followsModel.update({ userId: followId}, {
                $push: { followers: followerId }
            }, { upsert: true});

            await this.followsModel.update({ userId: followerId }, {
                $push: { follows: followId }
            }, { upsert: true});

            return {
                err: 'ok'
            };
        } catch (err: any) {
            return {
                err: 'server error'
            };
        }
    }

    async cleanup(): Promise<void> {
        await this.followsModel.deleteMany({});
    }
};