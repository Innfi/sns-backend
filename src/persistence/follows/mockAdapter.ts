import logger from '../../common/logger';
import { IFollows, RelateResult } from './model';
import { FollowsAdapter } from './adapter';


type FollowsDict =  { [id: string]: Set<string> };

export class MockFollowsAdapter extends FollowsAdapter {
    dict: FollowsDict = {};
    followerDict: FollowsDict = {};

    constructor() {
        super('');
    }

    async loadFollows(userId: string): Promise<Set<string>|undefined> {
        return this.dict[userId];
    }

    async loadFollowers(userId: string): Promise<Set<string>|undefined> {
        return this.followerDict[userId];
    }

    async relate(followId: string, followerId: string): Promise<RelateResult> {
        if(this.dict[followId] === undefined) this.dict[followId] = new Set<string>();
        if(this.dict[followId].has(followerId)) return { err: 'duplicate follower' };

        if(this.followerDict[followerId] === undefined) this.followerDict[followerId] = new Set<string>();
        if(this.followerDict[followerId].has(followId)) return { err: 'duplicate follower' };

        this.dict[followId].add(followerId);
        this.followerDict[followerId].add(followId);

        console.log('dict: ', this.dict);
        console.log('followerDict: ', this.followerDict);

        return {
            err: 'success'
        };
    }
}

