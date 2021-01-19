import logger from '../../common/logger';
import { IFollows, RelateResult } from './model';


type FollowsDict =  { [id: string]: Set<string> };

export class MockFollowsAdapter {
    dict: FollowsDict = {};

    async loadFollows(userId: string): Promise<Set<string>|undefined> {
        return undefined;
    }

    async loadFollowers(userId: string): Promise<Set<string>|undefined> {
        return this.dict[userId];
    }

    async relate(followId: string, followerId: string): Promise<RelateResult> {
        if(this.dict[followId] === undefined) this.dict[followId] = new Set<string>();
        
        if(this.dict[followId].has(followerId)) return { err: 'duplicate' };

        this.dict[followId].add(followerId);

        return {
            err: 'success'
        };
    }
}

