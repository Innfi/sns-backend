import 'reflect-metadata';
import { Container, Service } from 'typedi';

import { LoggerBase } from '../common/logger';
import { TimelineAdapterBase } from "./adapterBase";
import { FakeTimelineAdapter } from './adapterFake';
import { TimelineAdapter } from './adapter';
import { IUserTimeline, UserTimelineInput, LoadTimelineOptions } from './model';


@Service()
export class TimelineRepositoryFactory {
    createRepository(): TimelineRepository {
        return new TimelineRepository(
            Container.get(TimelineAdapter),
            Container.get(LoggerBase)
        );
    }

    createFakeRepository(): TimelineRepository {
        return new TimelineRepository(
            Container.get(FakeTimelineAdapter),
            Container.get(LoggerBase)
        );
    }
}

@Service({ factory: [TimelineRepositoryFactory, 'createFakeRepository' ]})
export class TimelineRepository {
    constructor(protected timelineAdapter: TimelineAdapterBase, 
        protected logger: LoggerBase) {

    }

    public async loadUserTimeline(userId: string, options: LoadTimelineOptions): 
        Promise<IUserTimeline[]> {
        try {
            if(!this.timelineAdapter.connected()) {
                await this.timelineAdapter.connectToCollection();
            }

            return await this.timelineAdapter.loadUserTimeline(userId, options);
        } catch (err: any) {
            this.logger.error(`TimelineRepository.loadUserTimeline] ${err}`)
            return [];
        }
    }

    public async writeUserTimeline(userId: string, input: UserTimelineInput): 
        Promise<IUserTimeline | null> {
        try {
            if(!this.timelineAdapter.connected()) {
                await this.timelineAdapter.connectToCollection();
            }

            return await this.timelineAdapter.writeUserTimeline(userId, input);
        } catch (err: any) {
            this.logger.error(`TimelineRepository.writeUserTimeline] ${err}`);
            return null;
        }
    }
}