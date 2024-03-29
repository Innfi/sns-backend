import { Service } from 'typedi';
import { v4 } from 'uuid';
import mongoose from 'mongoose';

import LoggerBase from '../common/logger';
import { dbUrl } from '../common/config';
import {
  IUserTimeline,
  IUserTimelineDoc,
  LoadTimelineOptions,
  UserTimelineInput,
  UserTimelineSchema,
} from './model';
import { TimelineAdapterBase } from './adapterBase';

@Service()
class TimelineAdapter implements TimelineAdapterBase {
  protected conn: mongoose.Connection;

  protected connectOptions: mongoose.ConnectionOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };

  protected collectionName: string = 'timeline';

  protected timelineModel: mongoose.Model<IUserTimelineDoc>;

  protected projection: string = '_id userId, authorId, text, textId, created';

  constructor(protected logger: LoggerBase) {}

  async connectToCollection() {
    if (this.connected()) return;

    this.conn = await mongoose.createConnection(dbUrl, this.connectOptions);
    this.timelineModel = this.conn.model(
      this.collectionName,
      UserTimelineSchema,
    );
  }

  connected(): boolean {
    return this.conn?.readyState === mongoose.STATES.connected;
  }

  async loadUserTimeline(
    userId: string,
    _options: LoadTimelineOptions,
  ): Promise<IUserTimeline[]> {
    if (!this.connected()) await this.connectToCollection();
    // FIXME: pagination
    return this.timelineModel.find({ userId }).lean();
  }

  async writeUserTimeline(
    userId: string,
    input: UserTimelineInput,
  ): Promise<IUserTimeline> {
    if (!this.connected()) await this.connectToCollection();
    const newTimeline: IUserTimeline = {
      userId,
      authorId: input.authorId,
      text: input.text,
      date: new Date(),
      tmId: v4(),
    };

    const result: IUserTimeline = await this.timelineModel.create(newTimeline);
    this.logger.info(`result: ${result}`);

    return newTimeline;
  }

  async cleanupData() {
    if (!this.connected()) await this.connectToCollection();

    await this.timelineModel.deleteMany({});
  }
}

export default TimelineAdapter;
