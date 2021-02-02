import logger from '../../common/logger';
import { FollowsAdapter } from './adapter';
import { IFollows, LoadFollowOptions } from './model';
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
            logger.error(`loadFollowsData + ${err}`);
            return null;
        }
    }
};

export const followsRepo = new FollowsRepository();
