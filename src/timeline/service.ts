import 'reflect-metadata';
import { Service } from 'typedi';

import { LoggerBase } from '../common/logger';
import { FollowsRepository } from '../follows/repository';
import { IUserTimeline, LoadTimelineOptions, UserTimelineInput } from './model';
import { TimelineRepository } from './repository';


@Service()
export class TimelineService {
    constructor(
        protected tmRepo: TimelineRepository,
        protected followsRepo: FollowsRepository,
        protected logger: LoggerBase
    ) {}

    //loadUserTimeline
    public async loadUserTimeline(
        userId: string, 
        options: LoadTimelineOptions
    ): Promise<IUserTimeline[]> {
        try {
            return await this.tmRepo.loadUserTimeline(userId, options);
        } catch (err: any) {
            this.logger.error(`TimelineRepository.loadUserTimeline] ${err}`)
            return [];
        }
    }

    //writeUserTimeline
    public async writeUserTimeline(
        userId: string,
        input: UserTimelineInput
    ): Promise<IUserTimeline | undefined> {
        try {
            if(this.validInput(input)) return undefined;

            const result = await this.tmRepo.writeUserTimeline(userId, input);

            const followers = await 
                this.followsRepo.loadFollowers(userId, { page: 0, limit: 100 }); //FIXME
            if(!followers.members) return result;

            for(const follower of followers.members) {
                console.log(`writeUserTimeline] followerId: ${follower}`);
                await this.tmRepo.writeUserTimeline(follower, input);
            }

            return result;
        } catch (err: any) {
            this.logger.error(`TimelineRepository.writeUserTimeline] ${err}`);
            return undefined;
        }
    }

    protected validInput(input: UserTimelineInput): boolean {
        if(!input) return false;
        if(!input.authorId) return false;
        if(!input.text) return false;

        return true;
    }
};