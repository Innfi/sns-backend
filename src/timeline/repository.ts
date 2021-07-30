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
        if(!this.timelineAdapter.connected()) {
            await this.timelineAdapter.connectToCollection();
        }

        return await this.timelineAdapter.loadUserTimeline(userId, options);
    }

    public async writeUserTimeline(userId: string, input: UserTimelineInput): 
        Promise<IUserTimeline | undefined> {
        if(!this.validInput(input)) return undefined;

        if(!this.timelineAdapter.connected()) {
            await this.timelineAdapter.connectToCollection();
        }

        return await this.timelineAdapter.writeUserTimeline(userId, input);
    };

    protected validInput(input: UserTimelineInput): boolean {
        if(!input.authorId) return false;
        if(!input.text) return false;

        return true;
    };
}