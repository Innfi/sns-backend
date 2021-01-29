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
        if(this.connected()) return;

        this.conn = await mongoose.createConnection(
            this.address, this.connectOptions);

        this.followsModel = this.conn.model<IFollowsDoc, mongoose.Model<IFollowsDoc>>(
            this.collectionName, FollowsSchema);
    }

    connected(): boolean {
        return this.conn?.readyState === mongoose.STATES.connected;
    }

    async loadFollows(userId: string): Promise<Set<string>|undefined> {
        console.log('userId: ', userId);

        //const findResult: IFollowsDoc | null = 
        //    await this.followsModel.findOne({userId: userId}).slice('follows', [1, 5]);
        const findResult: IFollowsDoc | null = 
            await this.followsModel.findOne({userId: userId}, { userId: 1, follows: 1});
        if(findResult === null) return undefined;

        console.log('follows: ', (findResult as IFollowsDoc));

        return new Set((findResult as IFollowsDoc).follows);
    }

    async loadFollowers(userId: string): Promise<Set<string>|undefined> {
        const findResult: IFollowsDoc | null = 
            await this.followsModel.findOne({userId: userId}).slice('followers', [1, 5]);
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
};