import { v4 } from 'uuid';
import logger from '../../common/logger';
import { TimelineAdapter } from './adapter';
import { IUserTimeline, IUserTimelineInput } from './model';


export class MockTimelineAdapter extends TimelineAdapter {
    protected userTimeline: IUserTimeline[] = [];
    protected isConnected: boolean = false;

    constructor() {
        super('');
    }

    async connectToCollection(): Promise<void> {
        this.isConnected = true;
    }

    connected(): boolean { return this.isConnected; }

    async writeUserTimeline(userId: string, input: IUserTimelineInput): Promise<IUserTimeline> {
        //TODO: send user timeline to their followers

        const response: IUserTimeline = {
            userId: userId,
            authorId: input.authorId,
            text: input.text,
            date: new Date(),
            textId: v4()
        };

        this.userTimeline.push(response);
        logger.info('textId: ' + response.textId);

        return response;
    }

    async getUserTimeline(userId: string): Promise<IUserTimeline[]> {
        return this.userTimeline;
    }
};