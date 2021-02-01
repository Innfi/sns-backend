import logger from '../../common/logger';
import { IFollows, RelateResult, LoadFollowOptions } from './model';
import { FollowsAdapter } from './adapter';


type FollowsDict =  { [id: string]: Set<string> };

export class MockFollowsAdapter extends FollowsAdapter {
    dict: FollowsDict = {};
    followerDict: FollowsDict = {};

    mockConnected: boolean = false;

    constructor() {
        super('');
    }

    async connectToCollection(): Promise<void> {
        this.mockConnected = true;
    }

    connected(): boolean { return this.mockConnected; }

    async loadFollows(userId: string, options: LoadFollowOptions): 
        Promise<Set<string>|undefined> {
        return this.followerDict[userId];
    }

    async loadFollowers(userId: string, options: LoadFollowOptions): 
        Promise<Set<string>|undefined> {
        return this.dict[userId];
    }

    async relate(followId: string, followerId: string): Promise<RelateResult> {
        if(this.dict[followId] === undefined) this.dict[followId] = new Set<string>();
        if(this.dict[followId].has(followerId)) return { err: 'duplicate follower' };

        if(this.followerDict[followerId] === undefined) this.followerDict[followerId] = new Set<string>();
        if(this.followerDict[followerId].has(followId)) return { err: 'duplicate follower' };

        this.dict[followId].add(followerId);
        this.followerDict[followerId].add(followId);

        return {
            err: 'success'
        };
    }

    async cleanup(): Promise<void> {
        return;
    }
}

