import { LoadFollowOptions, RelateResult } from "./model";


export interface FollowsAdapterBase {
    connectToCollection(): Promise<void>;
    connected(): boolean;
    loadFollows(userId: string, options: LoadFollowOptions): Promise<Set<string>|null>;
    loadFollowers(userId: string, options: LoadFollowOptions): Promise<Set<string>|null>;
    relate(followId: string, followerId: string): Promise<RelateResult>;
    clear(): Promise<void>
}