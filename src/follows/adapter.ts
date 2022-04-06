import 'reflect-metadata';
import { Service } from 'typedi';
import mongoose from 'mongoose';

import LoggerBase from '../common/logger';
import { dbUrl } from '../common/config';
import {
  FollowsSchema,
  IFollowsDoc,
  LoadFollowOptions,
  RelateResult,
} from './model';
import { FollowsAdapterBase } from './adapterBase';

@Service()
class FollowsAdapter implements FollowsAdapterBase {
  protected conn: mongoose.Connection;

  protected connectOptions: mongoose.ConnectionOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };

  protected collectionName: string = 'follows';

  protected followsModel: mongoose.Model<IFollowsDoc>;

  protected projection: string = '_id userId follows followers';

  constructor(protected logger: LoggerBase) {}

  async connectToCollection() {
    if (this.connected()) return;

    this.conn = await mongoose.createConnection(dbUrl, this.connectOptions);
    this.followsModel = this.conn.model<
      IFollowsDoc,
      mongoose.Model<IFollowsDoc>
    >(this.collectionName, FollowsSchema);
  }

  connected(): boolean {
    return this.conn?.readyState === mongoose.STATES.connected;
  }

  async loadFollows(
    userId: string,
    options: LoadFollowOptions,
  ): Promise<Set<string> | null> {
    if (!this.connected()) await this.connectToCollection();

    const findResult: IFollowsDoc | null = await this.followsModel
      .findOne({ userId })
      .slice('follows', [options.page, options.limit]);
    if (!findResult) return null;

    return new Set((findResult as IFollowsDoc).follows);
  }

  async loadFollowers(
    userId: string,
    options: LoadFollowOptions,
  ): Promise<Set<string> | null> {
    if (!this.connected()) await this.connectToCollection();

    const findResult: IFollowsDoc | null = await this.followsModel
      .findOne({ userId })
      .slice('followers', [options.page, options.limit]);

    if (!findResult) return null;

    return new Set((findResult as IFollowsDoc).followers);
  }

  async relate(followId: string, followerId: string): Promise<RelateResult> {
    if (!this.connected()) await this.connectToCollection();

    await this.followsModel.updateOne(
      { userId: followId },
      { $push: { followers: followerId } },
      { upsert: true },
    );

    await this.followsModel.updateOne(
      { userId: followerId },
      { $push: { follows: followId } },
      { upsert: true },
    );

    return {
      err: 'ok',
      followId,
      followerId,
    };
  }

  async cleanupData() {
    if (!this.connected()) await this.connectToCollection();

    await this.followsModel.deleteMany({});
  }
}

export default FollowsAdapter;
