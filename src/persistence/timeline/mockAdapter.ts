import { TimelineAdapter } from './adapter';
import { IUserTimeline } from './model';


export class MockTimelineAdapter extends TimelineAdapter {
    async writeUserTimeline(input: IUserTimeline): Promise<void> {
        //TODO: send user timeline to their followers
    }

    async getUserTimeline(userId: string): Promise<IUserTimeline[]> {
        //FIXME
        return [];
    }
};