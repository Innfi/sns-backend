import mongoose, { PaginateModel, PaginateOptions, FilterQuery } from 'mongoose';
import { v4 } from 'uuid';

import logger from '../../common/logger';
import { IUserTimeline, IUserTimelineDoc, UserTimelineInput, 
    UserTimelineSchema, UserTimelinePaginateSchema, LoadTimelineOptions } from './model';


export class TimelineAdapter {
    protected conn: mongoose.Connection;
    protected connectOptions: mongoose.ConnectionOptions = {
        useNewUrlParser: true,
        useUnifiedTopology: true
    };
    protected address: string = '';

    protected collectionName: string = 'timeline';
    protected timelineModel: mongoose.Model<IUserTimelineDoc>;
    protected projection: string = '_id userId authorId text textId created';

    protected tmPaginate: PaginateModel<IUserTimelineDoc>;
    protected paginateOptions: PaginateOptions = {
        page: 1, 
        limit: 20
    };

    constructor(address: string) { 
        this.address = address;
        logger.info('TimelineAdapter: ', this.address);
    }

    async connectToCollection(): Promise<void> {
        this.conn = await mongoose.createConnection(
            this.address, this.connectOptions);

        this.timelineModel = 
            this.conn.model<IUserTimelineDoc, mongoose.Model<IUserTimelineDoc>>(
            this.collectionName, UserTimelineSchema);

        this.tmPaginate = 
            this.conn.model<IUserTimelineDoc, PaginateModel<IUserTimelineDoc>>(
                this.collectionName, UserTimelinePaginateSchema);
    }

    connected(): boolean {
        return this.conn?.readyState === mongoose.STATES.connected;
    }

    async writeUserTimeline(userId: string, input: UserTimelineInput): Promise<IUserTimeline> {
        const newTimeline: IUserTimeline = {
            userId: userId,
            authorId: input.authorId,
            text: input.text,
            date: new Date(),
            textId: v4()
        };

        const result:IUserTimeline = await this.tmPaginate.create(newTimeline);
        logger.info('result: ' + result);

        return newTimeline;
    }

    async getUserTimeline(userId: string, options: LoadTimelineOptions): Promise<IUserTimeline[]> {
        const paginateQuery: FilterQuery<IUserTimeline> = {
            userId: userId
        };

        this.paginateOptions.page = options.page;
        this.paginateOptions.limit = options.limit;

        const findResult: mongoose.PaginateResult<IUserTimelineDoc> = 
            await this.tmPaginate.paginate(paginateQuery, this.paginateOptions);
        const docs: IUserTimeline[] = findResult.docs;

        return docs;
    }

    async clear(userId: string): Promise<void> {
        await this.tmPaginate.deleteMany({ userId: userId });
    }
};