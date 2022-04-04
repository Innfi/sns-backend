import { Container, Service } from 'typedi';
import dotenv from 'dotenv';

import { LoggerBase } from '../common/logger';
import {
  FakeTimelineAdapter,
  IUserTimeline,
  LoadTimelineOptions,
  TimelineAdapter,
  TimelineAdapterBase,
  UserTimelineInput,
} from '.';

dotenv.config();

const createRepository = () =>
  new TimelineRepository(
    Container.get(TimelineAdapter),
    Container.get(LoggerBase),
  );

const createFakeRepository = () =>
  new TimelineRepository(
    Container.get(FakeTimelineAdapter),
    Container.get(LoggerBase),
  );

const initializer: CallableFunction =
  process.env.PERSISTENCE === 'memory'
    ? createFakeRepository
    : createRepository;

@Service({ factory: initializer })
export class TimelineRepository {
  constructor(
    protected timelineAdapter: TimelineAdapterBase,
    protected logger: LoggerBase,
  ) {}

  // loadUserTimeline
  async loadUserTimeline(
    userId: string,
    options: LoadTimelineOptions,
  ): Promise<IUserTimeline[]> {
    if (!this.timelineAdapter.connected()) {
      await this.timelineAdapter.connectToCollection();
    }

    return this.timelineAdapter.loadUserTimeline(userId, options);
  }

  // writeUserTimeline
  async writeUserTimeline(
    userId: string,
    input: UserTimelineInput,
  ): Promise<IUserTimeline> {
    if (!this.timelineAdapter.connected()) {
      await this.timelineAdapter.connectToCollection();
    }

    return this.timelineAdapter.writeUserTimeline(userId, input);
  }

  async cleanupData(): Promise<void> {
    await this.timelineAdapter.cleanupData();
  }
}
