import 'reflect-metadata';
import { Container, Service } from 'typedi';
import dotenv from 'dotenv';

import { LoggerBase } from '../common/logger';
import { TimelineAdapterBase } from "./adapterBase";
import { FakeTimelineAdapter } from './adapterFake';
import { TimelineAdapter } from './adapter';
import { IUserTimeline, UserTimelineInput, LoadTimelineOptions } from './model';


dotenv.config();

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

const initializer = process.env.PERSISTENCE === 'memory' ? 
    'createFakeRepository' : 'createRepository';

@Service({ factory: [TimelineRepositoryFactory, initializer ]})
export class TimelineRepository {
    constructor(
        protected timelineAdapter: TimelineAdapterBase, 
        protected logger: LoggerBase
    ) { }

    //loadUserTimeline
    public async loadUserTimeline(
        userId: string, 
        options: LoadTimelineOptions
    ): Promise<IUserTimeline[]> {
        if(!this.timelineAdapter.connected()) {
            await this.timelineAdapter.connectToCollection();
        }

        return await this.timelineAdapter.loadUserTimeline(userId, options);
    }

    //writeUserTimeline
    public async writeUserTimeline(
        userId: string, 
        input: UserTimelineInput
    ): Promise<IUserTimeline> {
        if(!this.timelineAdapter.connected()) {
            await this.timelineAdapter.connectToCollection();
        }

        return await this.timelineAdapter.writeUserTimeline(userId, input);
    };

    public async cleanupData(): Promise<void> {
        await this.timelineAdapter.cleanupData();
    }
}