import { Container, Service } from 'typedi';

import { LoggerBase } from '../common/logger';
import { FollowsAdapterBase } from './adapterBase';
import { FollowsAdapter } from './adapter';
import { FollowsAdapterFake } from './adapterFake';
import { LoadFollowOptions, RelateResult } from './model';
import { UserProfilePayload } from '../auth/model';


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
            Container.get(FollowsAdapterFake),
            Container.get(LoggerBase)
        );
    }
}

@Service({ factory: [FollowsRepositoryFactory, 'createFakeRepository' ] })
export class FollowsRepository {
    constructor(protected followsAdapter: FollowsAdapterBase,
        protected logger: LoggerBase) {}

    public async loadFollowersData(userId: string, options: LoadFollowOptions): 
        Promise<UserProfilePayload[] | null> {
        try {
            //FIXME
            return null;
        } catch(err: any) {
            this.logger.error(`loadFollowersData] ${err}`);
            return null;
        }
    }

    public async loadFollowsData(userId: string, options: LoadFollowOptions): 
        Promise<UserProfilePayload | null> {
        try {
            //FIXME 
            return null;
        } catch(err: any) {
            this.logger.error(`loadFollowsData] ${err}`);
            return null;
        }     
    }

    public async relate(followId: string, followerId: string): Promise<RelateResult | null> {
        try {
            return this.followsAdapter.relate(followId, followerId);
        } catch(err: any) {
            this.logger.error(`relate] ${err}`);
            return null;
        }
    }
}