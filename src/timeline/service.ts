import 'reflect-metadata';
import { Service } from 'typedi';

import { LoggerBase } from '../common/logger';
import { IUserTimeline, LoadTimelineOptions, UserTimelineInput } from './model';
import { TimelineRepository } from './repository';


@Service()
export class TimelineService {
    constructor(
        protected tmRepo: TimelineRepository,
        protected logger: LoggerBase
    ) {}

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
    };

    public async writeUserTimeline(
        userId: string,
        input: UserTimelineInput
    ): Promise<IUserTimeline | undefined> {
        try {
            return await this.tmRepo.writeUserTimeline(userId, input);
        } catch (err: any) {
            this.logger.error(`TimelineRepository.writeUserTimeline] ${err}`);
            return undefined;
        }
    };
};