import { v4 } from 'uuid';
import logger from '../../common/logger';
import { TimelineAdapter } from './adapter';
import { IUserTimeline } from './model';


export class MockTimelineAdapter extends TimelineAdapter {
    protected userTimeline: IUserTimeline[] = [];

    async writeUserTimeline(input: IUserTimeline): Promise<IUserTimeline> {
        //TODO: send user timeline to their followers

        const response: IUserTimeline = {
            authorId: input.authorId,
            authorNickname: input.authorNickname,
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