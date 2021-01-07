import mongoose from 'mongoose';

import logger from '../../common/logger';
import { IUserTimeline, IUserTimelineDoc, IUserTimelineInput, UserTimelineSchema } from './model';


export class TimelineAdapter {
    protected conn: mongoose.Connection;
    protected connectOptions: mongoose.ConnectionOptions = {
        useNewUrlParser: true,
        useUnifiedTopology: true
    };
    protected address: string = '';

    protected collectionName: string = 'timeline';
    protected timelineModel: mongoose.Model<IUserTimelineDoc>;
    protected prjection: string = '_id userId authorId text textId created';

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
    }

    connected(): boolean {
        return this.conn?.readyState === mongoose.STATES.connected;
    }

    async writeUserTimeline(userId: string, input: IUserTimelineInput): Promise<IUserTimeline> {
        return {
            userId: userId,
            authorId: input.authorId,
            text: input.text,
            date: new Date(),
            textId: 'dummyTextId'
        };
    }

    async getUserTimeline(userId: string): Promise<IUserTimeline[]> {
        //FIXME 
        return [];
    }
};