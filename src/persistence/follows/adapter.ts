import mongoose, { FilterQuery, PaginateModel, PaginateOptions } from 'mongoose';

import logger from '../../common/logger';
import { IFollows, IFollowsDoc, FollowsSchema, RelateResult, FollowsInput, FollowsPaginateSchema } 
    from './model';


export class FollowsAdapter {
    protected conn: mongoose.Connection;
    protected connectOptions: mongoose.ConnectionOptions = {
        useNewUrlParser: true,
        useUnifiedTopology: true
    };
    protected address: string = '';

    protected collectionName: string = 'follows';
    //protected followsModel: mongoose.Model<IFollowsDoc>;
    protected followsModel: PaginateModel<IFollowsDoc>;
    protected projection: string = '_id userId follows followers';


    constructor(address: string) {
        this.address = address;
        logger.info('FollowsAdapter: ' + this.address);
    }

    async connecToCollection(): Promise<void> {
        this.conn = await mongoose.createConnection(
            this.address, this.connectOptions);

        //this.followsModel = this.conn.model<IFollowsDoc, mongoose.Model<IFollowsDoc>>(
        //    this.collectionName, FollowsSchema);
        this.followsModel = this.conn.model<IFollowsDoc, PaginateModel<IFollowsDoc>>(
            this.collectionName, FollowsPaginateSchema);
    }

    connected(): boolean {
        return this.conn?.readyState === mongoose.STATES.connected;
    }

    async loadFollows(userId: string): Promise<Set<string>|undefined> {
        const paginateQuery: FilterQuery<IFollowsDoc> = {
            userId: userId
        };

        const paginateOptions: PaginateOptions = {
            page: 1,
            limit: 1000,
            select: 'follows'
        };

        const findResult: mongoose.PaginateResult<IFollowsDoc> = 
            await this.followsModel.paginate(paginateQuery, paginateOptions);

        //FIXME
        //findResult.docs
        return undefined;
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