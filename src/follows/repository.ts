import { Container, Service } from 'typedi';
import dotenv from 'dotenv';

import LoggerBase from '../common/logger';
import {
  LoadFollowOptions,
  LoadRelationMembersResult,
  MemberTypeEnum,
  RelateResult,
} from './model';
import { FollowsAdapterBase } from './adapterBase';
import FollowsAdapter from './adapter';
import FakeFollowsAdapter from './adapterFake';

dotenv.config();

const createRepository = (): FollowsRepository =>
  new FollowsRepository(
    Container.get(FollowsAdapter),
    Container.get(LoggerBase),
  );

const createFakeRepository = (): FollowsRepository =>
  new FollowsRepository(
    Container.get(FakeFollowsAdapter),
    Container.get(LoggerBase),
  );

const initializer: CallableFunction =
  process.env.PERSISTENCE === 'memory'
    ? createFakeRepository
    : createRepository;

@Service({ factory: initializer })
class FollowsRepository {
  constructor(
    protected followsAdapter: FollowsAdapterBase,
    protected logger: LoggerBase,
  ) {}

  async relate(followId: string, followerId: string): Promise<RelateResult> {
    return this.followsAdapter.relate(followId, followerId);
  }

  async loadFollows(
    userId: string,
    options: LoadFollowOptions,
  ): Promise<LoadRelationMembersResult> {
    const follows: Set<string> | null = await this.followsAdapter.loadFollows(
      userId,
      options,
    );

    if (!follows)
      return { err: 'other', type: MemberTypeEnum.Invalid, members: undefined };

    return {
      err: 'ok',
      type: MemberTypeEnum.Follows,
      members: Array.from(follows!),
    };
  }

  async loadFollowers(
    userId: string,
    options: LoadFollowOptions,
  ): Promise<LoadRelationMembersResult> {
    const followers: Set<string> | null =
      await this.followsAdapter.loadFollowers(userId, options);

    if (!followers)
      return { err: 'other', type: MemberTypeEnum.Invalid, members: undefined };

    const result: LoadRelationMembersResult = {
      err: 'ok',
      type: MemberTypeEnum.Followers,
      members: Array.from(followers),
    };

    return result;
  }

  async cleanupData() {
    await this.followsAdapter.cleanupData();
  }
}

export default FollowsRepository;
