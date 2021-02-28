import logger from '../../common/logger';
import { dbUrl } from '../../common/config';
import { TimelineAdapter } from './adapter';
import { MockTimelineAdapter } from './mockAdapter';
import { IUserTimeline, UserTimelineInput } from "./model";


export class TimelineRepository {
    public timelineAdapter: TimelineAdapter;

    async loadUserTimeline(userId: string): Promise<IUserTimeline[] | null> {
        logger.info('loadUserTimeline: ' + userId);
        try {
            if(!this.timelineAdapter.connected()) {
                await this.timelineAdapter.connectToCollection();
            }

            return await this.timelineAdapter.getUserTimeline(userId);
        } catch (err: any) {
            logger.error('loadUserTimeline error: ' + err);
            return null;
        }
    };

    async writeUserTimeline(userId: string, input: UserTimelineInput): 
        Promise<IUserTimeline | null> {
        logger.info('writeUserTimeline: ' + userId);
        try {
            if(!this.timelineAdapter.connected()) {
                await this.timelineAdapter.connectToCollection();
            }

            return await this.timelineAdapter.writeUserTimeline(userId, input);
        } catch (err: any) {
            logger.error('writeUserTimeline error: ' + err);
            return null;
        }
    }
};

export const tmRepo = new TimelineRepository();
//tmRepo.timelineAdapter = new MockTimelineAdapter();
tmRepo.timelineAdapter = new TimelineAdapter(`${dbUrl}/users`);

