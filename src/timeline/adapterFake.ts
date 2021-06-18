import 'reflect-metadata';
import { Service } from 'typedi';
import { v4 } from 'uuid';
import { LoggerBase } from '../common/logger';
import { IUserTimeline, UserTimelineInput, LoadTimelineOptions } from './model';
import { TimelineAdapterBase } from './adapterBase';


@Service()
export class FakeTimelineAdapter implements TimelineAdapterBase {
    protected isConnected: boolean = false;

    constructor(protected logger: LoggerBase) {}

    public async connectToCollection(): Promise<void> {

    }

    public connected(): boolean { return this.isConnected; }

    public async writeUserTimeline(userId: string, input: UserTimelineInput): 
        Promise<IUserTimeline> {

        
        const response: IUserTimeline = {
            userId: userId,
            authorId: input.authorId,
            text: input.text,
            date: new Date(),
            textId: v4()
        };

        return response;
    }

    public async getUserTimeline(userId: string, options: LoadTimelineOptions): 
        Promise<IUserTimeline[]> {
        
        return [];
    }

    public async clear(userId: string): Promise<void> {
        
    }
}

/*
import { v4 } from 'uuid';
import logger from '../../common/logger';
import { TimelineAdapter } from './adapter';


export class MockTimelineAdapter extends TimelineAdapter {
    protected isConnected: boolean = false;

    protected userTimelineMap: {[id: string]: IUserTimeline[]} = {};

    constructor() {
        super('');
    }

    async connectToCollection(): Promise<void> {
        logger.info('MockTimelineAdapter: connectToCollection');
        this.isConnected = true;
    }

    connected(): boolean { return this.isConnected; }

    async writeUserTimeline(userId: string, input: UserTimelineInput): Promise<IUserTimeline> {
        //TODO: send user timeline to their followers

        const response: IUserTimeline = {
            userId: userId,
            authorId: input.authorId,
            text: input.text,
            date: new Date(),
            textId: v4()
        };

        if(this.userTimelineMap[userId] === undefined) {
            this.userTimelineMap[userId] = [];
        }

        this.userTimelineMap[userId].push(response);
        logger.info('textId: ' + response.textId);

        return response;
    }

    async getUserTimeline(userId: string): Promise<IUserTimeline[]> {
        return this.userTimelineMap[userId];
    }

    async clear(userId: string): Promise<void> { 
        this.userTimelineMap[userId] = [];
    }
};*/