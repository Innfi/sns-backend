import { Container, Service } from 'typedi';

import { LoggerBase } from '../common/logger';
import { FollowsAdapterBase } from './adapterBase';
import { FollowsAdapter } from './adapter';
import { FakeFollowsAdapter } from './adapterFake';
import { LoadFollowOptions, LoadFollowsResult, RelateResult } from './model';
import { UserProfilePayload } from '../auth/model';
import { AccountAdapterBase } from '../auth/adapterBase';
import { AccountAdapter } from '../auth/adapter';
import { FakeAccountAdapter } from '../auth/adapterFake';


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
        return {
            err: 'ok',
            followId: followId,
            followerId: followerId,
        };
    };

    public async loadFollows(userId: string): Promise<LoadFollowsResult | undefined> {
        return undefined;  
    }
};


// @Service({ factory: [FollowsRepositoryFactory, 'createFakeRepository' ] })
// export class FollowsRepository {
//     constructor(
//         protected followsAdapter: FollowsAdapterBase,
//         protected accontAdapter: AccountAdapterBase,
//         protected logger: LoggerBase) {}

//     public async loadFollowsData(userId: string, options: LoadFollowOptions): 
//         Promise<UserProfilePayload[] | null> {
//         try {
//             const follows: Set<string> | null = 
//                 await this.followsAdapter.loadFollows(userId, options);
//             if(follows === null) return null;

//             let response: UserProfilePayload[] = [];
//             const keys: string[] = Object.keys((follows as Set<string>).keys);

//             for(let i=0;i<keys.length;i++) {
//                 const profileResult = await this.accontAdapter.loadUserProfile(keys[i]);
//                 if(profileResult === null) continue;

//                 response.push(profileResult);
//             }

//             return response;
//         } catch(err: any) {
//             this.logger.error(`loadFollowsData] ${err}`);
//             return null;
//         }     
//     }

//     public async loadFollowersData(userId: string, options: LoadFollowOptions): 
//         Promise<UserProfilePayload[] | null> {
//         try {
//             const followers: Set<string> | null = 
//                 await this.followsAdapter.loadFollowers(userId, options);
//             if(followers === null) return null;

//             let response: UserProfilePayload[] = [];
//             const keys = Array.from(followers);
//             for(let i=0;i<keys.length;i++) {
//                 const profileResult = await this.accontAdapter.loadUserProfile(keys[i]);
//                 if(profileResult === null) {
//                     console.log('profileResult null');
//                     continue;
//                 }

//                 response.push(profileResult);
//             }

//             return response;
//             // console.log(`loadFollowersData] ${followers!.size}`);;
//             // console.log(`loadFollowersData1] ${followers!.keys.length}`);;
//             // let response: UserProfilePayload[] = [];

            
//             // const keys: string[] = Object.keys((followers as Set<string>).keys);
//             // console.log(`key len: ${keys.length}`);

//             // for(let i=0;i<keys.length;i++) {
//             //     console.log(`loadFollowersData] userId: ${keys[i]}`);
//             //     const profileResult = await this.accontAdapter.loadUserProfile(keys[i]);
//             //     if(profileResult === null) continue;

//             //     response.push(profileResult);
//             // }

//             // return response;
//             //return [];
//         } catch(err: any) {
//             this.logger.error(`loadFollowersData] ${err}`);
//             return null;
//         }
//     }

//     public async relate(followId: string, followerId: string): Promise<RelateResult | null> {
//         try {
//             return this.followsAdapter.relate(followId, followerId);
//         } catch(err: any) {
//             this.logger.error(`relate] ${err}`);
//             return null;
//         }
//     }
// }