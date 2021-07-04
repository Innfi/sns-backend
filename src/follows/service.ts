import 'reflect-metadata';
import { Service } from 'typedi';
import { UserProfilePayload } from '../auth/model';
import { AccountRepository } from '../auth/repository';

import { LoggerBase } from '../common/logger';
import { LoadFollowOptions, LoadRelationMembersResult, RelateResult } from './model';
import { FollowsRepository } from './repository';


@Service()
export class FollowsService {
    constructor(
        protected followsRepo: FollowsRepository,
        protected accountRepo: AccountRepository,
        protected logger: LoggerBase
    ) {}

    public async relate(followId: string, followerId: string): Promise<RelateResult> {
        try {
            return this.followsRepo.relate(followId, followerId);
        } catch (err: any) {
            this.logger.error(`relate] error: ${err}`);
            return {
                err: 'server error'
            };
        }
    };

    public async loadFollows(userId: string, options: LoadFollowOptions): 
        Promise<UserProfilePayload[] | undefined> {
        const follows: LoadRelationMembersResult | undefined = 
            await this.followsRepo.loadFollows(userId, options);
        if(!follows) return undefined;

        const keys: string[] = Object.keys(follows.members!.keys);
        return this.toUserProfilePayloads(keys);
    };

    public async loadFollowers(userId: string, options: LoadFollowOptions):
        Promise<UserProfilePayload[] | undefined> {
        const followers: LoadRelationMembersResult | undefined = 
            await this.followsRepo.loadFollowers(userId, options);
        if(!followers) return undefined;

        const keys: string[] = Object.keys(followers.members!.keys);
        return this.toUserProfilePayloads(keys);
    };

    protected async toUserProfilePayloads(keys: string[]): Promise<UserProfilePayload[]> {
        let response: UserProfilePayload[] = [];

        for(let i=0;i<keys.length;i++) {
            const profileResult = await this.accountRepo.loadUserProfile(keys[i]);
            if(!profileResult) continue;

            response.push(profileResult);
        }

        return response;
    };
};