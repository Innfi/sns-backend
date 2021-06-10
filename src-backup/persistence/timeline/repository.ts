//import logger from '../../common/logger';
import { TimelineAdapter } from './adapter';
import { MockTimelineAdapter } from './mockAdapter';
import { IUserTimeline, UserTimelineInput, LoadTimelineOptions } from "./model";


export class TimelineRepository {
    public timelineAdapter: TimelineAdapter;

    async loadUserTimeline(userId: string, options: LoadTimelineOptions): Promise<IUserTimeline[] | null> {
        //logger.info('loadUserTimeline: ' + userId);
        try {
            if(!this.timelineAdapter.connected()) {
                await this.timelineAdapter.connectToCollection();
            }

            return await this.timelineAdapter.getUserTimeline(userId, options);
        } catch (err: any) {
            //logger.error('loadUserTimeline error: ' + err);
            return null;
        }
    };

    async writeUserTimeline(userId: string, input: UserTimelineInput): 
        Promise<IUserTimeline | null> {
        //logger.info('writeUserTimeline: ' + userId);
        try {
            if(!this.timelineAdapter.connected()) {
                await this.timelineAdapter.connectToCollection();
            }

            return await this.timelineAdapter.writeUserTimeline(userId, input);
        } catch (err: any) {
            //logger.error('writeUserTimeline error: ' + err);
            return null;
        }
    }
};

export const tmRepo = new TimelineRepository();
tmRepo.timelineAdapter = new MockTimelineAdapter();
//tmRepo.timelineAdapter = new TimelineAdapter(`${dbUrl}/users`);

