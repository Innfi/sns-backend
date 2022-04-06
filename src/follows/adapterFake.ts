import { Service } from 'typedi';

import LoggerBase from '../common/logger';
import { LoadFollowOptions, RelateResult } from './model';
import { FollowsAdapterBase } from './adapterBase';

type FollowsDict = {
  [id: string]: Set<string>;
};

@Service()
class FakeFollowsAdapter implements FollowsAdapterBase {
  protected isConnected: boolean = false;

  protected followsDict: FollowsDict = {};

  protected followersDict: FollowsDict = {};

  constructor(protected logger: LoggerBase) {}

  async connectToCollection() {
    this.isConnected = true;
  }

  connected(): boolean {
    return this.isConnected;
  }

  async loadFollows(
    userId: string,
    options: LoadFollowOptions,
  ): Promise<Set<string> | null> {
    return this.followersDict[userId];
  }

  async loadFollowers(
    userId: string,
    options: LoadFollowOptions,
  ): Promise<Set<string> | null> {
    return this.followsDict[userId];
  }

  async relate(followId: string, followerId: string): Promise<RelateResult> {
    if (!this.followsDict[followId])
      this.followsDict[followId] = new Set<string>();
    if (this.followsDict[followId].has(followerId))
      return { err: 'duplicate follower' };

    if (!this.followersDict[followerId])
      this.followersDict[followerId] = new Set<string>();
    if (this.followersDict[followerId].has(followId))
      return { err: 'duplicate follower' };

    this.followsDict[followId].add(followerId);
    this.followersDict[followerId].add(followId);

    return {
      err: 'ok',
      followId,
      followerId,
    };
  }

  async cleanupData() {
    this.followsDict = {};
    this.followersDict = {};
  }
}

export default FakeFollowsAdapter;
