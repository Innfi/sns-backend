import 'reflect-metadata';
import { Service } from 'typedi';
import { LoggerBase } from '../common/logger';
import { FollowsAdapterBase } from './adapterBase';
import { LoadFollowOptions, RelateResult } from './model';


type FollowsDict = { 
    [id: string]: Set<string>;
};

@Service()
export class FakeFollowsAdapter implements FollowsAdapterBase {
    protected isConnected: boolean = false;
    protected followsDict: FollowsDict = {};
    protected followersDict: FollowsDict = {};


    constructor(protected logger: LoggerBase) {}

    public async connectToCollection(): Promise<void> { this.isConnected = true; }

    public connected(): boolean { return this.isConnected; } 

    public async loadFollows(userId: string, options: LoadFollowOptions): 
        Promise<Set<string> | null> {
        return this.followersDict[userId];
    }

    public async loadFollowers(userId: string, options: LoadFollowOptions): 
        Promise<Set<string> | null> {
            return this.followsDict[userId];
    }

    public async relate(followId: string, followerId: string): Promise<RelateResult> {
        if(this.followsDict[followId] === undefined) this.followsDict[followId] = new Set<string>();
        if(this.followsDict[followId].has(followerId)) return { err: 'duplicate follower' };

        if(this.followersDict[followerId] === undefined) this.followersDict[followerId] = new Set<string>();
        if(this.followersDict[followerId].has(followId)) return { err: 'duplicate follower' };

        this.followsDict[followId].add(followerId);
        this.followersDict[followerId].add(followId);

        return {
            err: 'ok',
            followId: followId,
            followerId: followerId,
        };
    }

    public async clear(): Promise<void> {
        this.followsDict = {};
        this.followersDict = {};
    }
}