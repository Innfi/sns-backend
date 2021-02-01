import logger from '../../common/logger';
import { FollowsAdapter } from './adapter';
import { IFollows, LoadFollowOptions } from './model';
import { UserProfilePayload } from '../account/model';


export class FollowsRepository {
    public followsAdapter: FollowsAdapter;

    public async loadFollowersData(userId: string, options: LoadFollowOptions): 
        Promise<UserProfilePayload[] | null> {
        try {
            //FIXME 
            const followers = await this.followsAdapter.loadFollowers(userId, options);
            if(followers === undefined) return null;

            let response: UserProfilePayload[] = [];
            (followers as Set<string>).forEach((value: string) => {
                //TODO: load user profile from persistence
            });

            return response;
        } catch(err: any) {
            logger.error(`loadFollowsData + ${err}`);
            return null;
        }
    }
};

export const followsRepo = new FollowsRepository();
