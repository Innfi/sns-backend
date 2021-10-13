import 'reflect-metadata';
import { Service } from 'typedi';
import { v4 } from 'uuid';
import { LoggerBase } from '../common/logger';
import { IUserTimeline, UserTimelineInput, LoadTimelineOptions } from './model';
import { TimelineAdapterBase } from './adapterBase';


interface TimelineDict {
    [id: string]: IUserTimeline[]
}

class DictSingle { //FIXME: move helper class to src/common
    private static instance: DictSingle;
    private constructor() {}

    public timelineDict: TimelineDict = {};

    public static getInstance(): DictSingle {
        if(!DictSingle.instance) DictSingle.instance = new DictSingle();

        return DictSingle.instance;
    }
}

@Service()
export class FakeTimelineAdapter implements TimelineAdapterBase {
    protected isConnected: boolean = false;

    constructor(protected logger: LoggerBase) {}

    public async connectToCollection(): Promise<void> {
        this.isConnected = true;
    }

    public connected(): boolean { return this.isConnected; }

    public async loadUserTimeline(userId: string, options: LoadTimelineOptions): 
        Promise<IUserTimeline[]> {
        
        if(!DictSingle.getInstance().timelineDict[userId]) {
            DictSingle.getInstance().timelineDict[userId] = [];
        }

        const timelines: IUserTimeline[] = DictSingle.getInstance().timelineDict[userId];

        return this.paginateTimelines(timelines, options);
    }

    protected paginateTimelines(timelines: IUserTimeline[], options: LoadTimelineOptions): 
        IUserTimeline[] {
        return timelines.slice((options.page - 1) * options.limit, 
            options.page * options.limit);
    };

    public async writeUserTimeline(userId: string, input: UserTimelineInput): 
        Promise<IUserTimeline> {
        //TODO: send user timeline to their followers
        
        const response: IUserTimeline = {
            userId: userId,
            authorId: input.authorId,
            text: input.text,
            date: new Date(),
            tmId: v4()
        };

        if(DictSingle.getInstance().timelineDict[userId] === undefined) {
            DictSingle.getInstance().timelineDict[userId] = [];
        }

        DictSingle.getInstance().timelineDict[userId].push(response);

        return response;
    }

    public async cleanupData(): Promise<void> {
        DictSingle.getInstance().timelineDict = {};
    }
}
