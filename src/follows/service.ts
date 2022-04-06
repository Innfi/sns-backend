import { Service } from 'typedi';

import LoggerBase from '../common/logger';
import { UserProfilePayload } from '../auth/model';
import AccountRepository from '../auth/repository';
import {
  LoadFollowOptions,
  LoadRelationMembersResult,
  RelateResult,
} from './model';
import FollowsRepository from './repository';

@Service()
class FollowsService {
  constructor(
    protected followsRepo: FollowsRepository,
    protected accountRepo: AccountRepository,
    protected logger: LoggerBase,
  ) {}

  async relate(followId: string, followerId: string): Promise<RelateResult> {
    try {
      this.logger.info(`FollowsService.relate] ${followId} <= ${followerId}`);

      return await this.followsRepo.relate(followId, followerId);
    } catch (err: any) {
      this.logger.error(`relate] error: ${err}`);
      return {
        err: 'server error',
      };
    }
  }

  async loadFollows(
    userId: string,
    options: LoadFollowOptions,
  ): Promise<UserProfilePayload[] | undefined> {
    const follows: LoadRelationMembersResult =
      await this.followsRepo.loadFollows(userId, options);
    if (!follows) return undefined;
    if (!follows.members) return [];

    const keys: string[] = Array.from(follows.members);
    return this.toUserProfilePayloads(keys);
  }

  async loadFollowers(
    userId: string,
    options: LoadFollowOptions,
  ): Promise<UserProfilePayload[] | undefined> {
    const followers: LoadRelationMembersResult =
      await this.followsRepo.loadFollowers(userId, options);
    if (!followers) return undefined;
    if (!followers.members) return [];

    const keys: string[] = Array.from(followers.members);
    return this.toUserProfilePayloads(keys);
  }

  protected async toUserProfilePayloads(
    keys: string[],
  ): Promise<UserProfilePayload[]> {
    const response: UserProfilePayload[] = [];

    for (const key of keys) {
      const profileResult = await this.accountRepo.loadUserProfile(key);
      if (!profileResult) continue;

      response.push(profileResult);
    }

    return response;
  }
}

export default FollowsService;
