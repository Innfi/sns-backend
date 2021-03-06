import { Container, Service } from 'typedi';

import { LoggerBase } from '../common/logger';
import { FollowsAdapterBase } from './adapterBase';
import { FollowsAdapter } from './adapter';
import { FakeFollowsAdapter } from './adapterFake';
import { LoadFollowOptions, LoadRelationMembersResult, MemberTypeEnum, RelateResult } from './model';


@Service()
export class FollowsRepositoryFactory {
    public createRepository(): FollowsRepository {
        return new FollowsRepository(
            Container.get(FollowsAdapter),
            Container.get(LoggerBase)
        );
    }

    public createFakeRepository(): FollowsRepository {
        return new FollowsRepository(
            Container.get(FakeFollowsAdapter),
            Container.get(LoggerBase)
        );
    }
}

@Service()
export class FollowsRepository {
    constructor(
        protected followsAdapter: FollowsAdapterBase,
        protected logger: LoggerBase
    ) {}

    public async relate(followId: string, followerId: string): Promise<RelateResult> {
        return this.followsAdapter.relate(followId, followerId);
    };

    public async loadFollows(userId: string, options: LoadFollowOptions): 
        Promise<LoadRelationMembersResult | undefined> {
        const follows: Set<string> | null = 
            await this.followsAdapter.loadFollows(userId, options);

        if(!follows) return { err: 'other', type: MemberTypeEnum.Invalid, members: undefined };

        return {
            err: 'ok',
            type: MemberTypeEnum.Follows,
            members: follows!
        };
    }

    public async loadFollowers(userId: string, options: LoadFollowOptions): 
        Promise<LoadRelationMembersResult | undefined> {
        const followers: Set<string> | null = 
            await this.followsAdapter.loadFollowers(userId, options);

        if(!followers) return { err: 'other', type: MemberTypeEnum.Invalid, members: undefined };

        return {
            err: 'ok',
            type: MemberTypeEnum.Followers,
            members: followers!
        };
    };
};
