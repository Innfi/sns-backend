//import logger from '../../common/logger';
import { FollowsAdapter } from './adapter';
import { MockFollowsAdapter } from './mockAdapter';
import { IFollows, LoadFollowOptions, RelateResult } from './model';
import { UserProfilePayload } from '../account/model';
import { accRepo } from '../account/repository';


export class FollowsRepository {
    public followsAdapter: FollowsAdapter;

    public async loadFollowersData(userId: string, options: LoadFollowOptions): 
        Promise<UserProfilePayload[] | null> {
        try {
            //FIXME 
            const followers = await this.followsAdapter.loadFollowers(userId, options);
            if(followers === undefined) return null;

            let response: UserProfilePayload[] = [];
            (followers as Set<string>).forEach(async (value: string) => {
                const profileResult: UserProfilePayload | null = 
                    await accRepo.loadUserProfile(value);

                if(profileResult === null) return;

                response.push(profileResult as UserProfilePayload);
            });

            return response;
        } catch(err: any) {
            //logger.error(`loadFollowersData] ${err}`);
            return null;
        }
    }

    public async loadFollowsData(userId: string, options: LoadFollowOptions):
        Promise<UserProfilePayload[] | null> {
        try {
            const follows = await this.followsAdapter.loadFollows(userId, options);
            if(follows === undefined) return null;

            let response: UserProfilePayload[] = [];
            (follows as Set<string>).forEach(async (value: string) => {
                const profileResult: UserProfilePayload | null = 
                    await accRepo.loadUserProfile(value);
                
                if(profileResult === null) return;

                response.push(profileResult as UserProfilePayload);
            });

            return response;
        } catch (err: any) {
            //logger.error(`loadFollowsData] ${err}`);
            return null;
        }
    }

    public async relate(followId: string, followerId: string): Promise<RelateResult | null> {
        try {
            return await this.followsAdapter.relate(followId, followerId);
        } catch (err: any) {
            //logger.error(`relate] ${err}`);
            return null;
        }
    }
};

export const followsRepo = new FollowsRepository();
followsRepo.followsAdapter = new MockFollowsAdapter();