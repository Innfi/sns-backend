import { Service } from 'typedi';
import { v4 } from 'uuid';

import LoggerBase from '../common/logger';
import { IUserTimeline, LoadTimelineOptions, UserTimelineInput } from './model';
import { TimelineAdapterBase } from './adapterBase';
import DictSingle from './dictSingle';

@Service()
class FakeTimelineAdapter implements TimelineAdapterBase {
  protected isConnected: boolean = false;

  constructor(protected logger: LoggerBase) {}

  async connectToCollection() {
    this.isConnected = true;
  }

  connected(): boolean {
    return this.isConnected;
  }

  async loadUserTimeline(
    userId: string,
    options: LoadTimelineOptions,
  ): Promise<IUserTimeline[]> {
    if (!DictSingle.getInstance().timelineDict[userId]) {
      DictSingle.getInstance().timelineDict[userId] = [];
    }

    const timelines: IUserTimeline[] =
      DictSingle.getInstance().timelineDict[userId];

    return this.paginateTimelines(timelines, options);
  }

  protected paginateTimelines(
    timelines: IUserTimeline[],
    options: LoadTimelineOptions,
  ): IUserTimeline[] {
    return timelines.slice(
      (options.page - 1) * options.limit,
      options.page * options.limit,
    );
  }

  async writeUserTimeline(
    userId: string,
    input: UserTimelineInput,
  ): Promise<IUserTimeline> {
    // TODO: send user timeline to their followers

    const response: IUserTimeline = {
      userId,
      authorId: input.authorId,
      text: input.text,
      date: new Date(),
      tmId: v4(),
    };

    if (!DictSingle.getInstance().timelineDict[userId]) {
      DictSingle.getInstance().timelineDict[userId] = [];
    }

    DictSingle.getInstance().timelineDict[userId].push(response);

    return response;
  }

  async cleanupData() {
    DictSingle.getInstance().timelineDict = {};
  }
}

export default FakeTimelineAdapter;
