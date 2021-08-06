import 'reflect-metadata';
import { Service } from 'typedi';
import { v4 } from 'uuid';
import mongoose from 'mongoose';

import { IUserTimeline, IUserTimelineDoc, UserTimelineInput, UserTimelineSchema, 
    LoadTimelineOptions } from './model';
import { TimelineAdapterBase } from './adapterBase';
import { LoggerBase } from '../common/logger';
import { CommonConfig } from '../common/config';


@Service() 
export class TimelineAdapter implements TimelineAdapterBase {
    protected conn: mongoose.Connection;
    protected connectOptions: mongoose.ConnectionOptions = {
        useNewUrlParser: true,
        useUnifiedTopology: true
    };
    protected collectionName: string = 'timeline';
    protected timelineModel: mongoose.Model<IUserTimelineDoc>;
    protected projection: string = '_id userId, authorId, text, textId, created';


    constructor(protected logger: LoggerBase, protected conf: CommonConfig) {}

    public async connectToCollection(): Promise<void> {
        if(this.connected()) return;

        this.conn = await mongoose.createConnection(
            this.conf.dbUrl, this.connectOptions);
        this.timelineModel = this.conn.model(this.collectionName, UserTimelineSchema);
    }

    public connected(): boolean {
        return this.conn?.readyState === mongoose.STATES.connected;
    }

    public async loadUserTimeline(userId: string, options: LoadTimelineOptions): 
        Promise<IUserTimeline[]> {
        if(!this.connected()) await this.connectToCollection();
        //FIXME: pagination
        return await this.timelineModel.find({ userId: userId }).lean();
    }

    public async writeUserTimeline(userId: string, input: UserTimelineInput): 
        Promise<IUserTimeline> {
        if(!this.connected()) await this.connectToCollection();
        const newTimeline: IUserTimeline = {
            userId: userId,
            authorId: input.authorId,
            text: input.text,
            date: new Date(),
            tmId: v4()
        };

        const result:IUserTimeline = await this.timelineModel.create(newTimeline);
        this.logger.info('result: ' + result);

        return newTimeline;
    }

    public async cleanupData(): Promise<void> {
        if(!this.connected()) await this.connectToCollection();

        await this.timelineModel.deleteMany({});
    }
}
