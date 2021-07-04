import { Schema, Document } from 'mongoose';


export interface IFollows {
    userId: string;
    follows?: string[];
    followers?: string[];
}

export interface IFollowsDoc extends IFollows, Document {}

export const FollowsSchema = new Schema<IFollowsDoc>({
    userId: { type: String, required: true },
    follows: [{ type: String }],
    followers: [{ type: String }]
});

export interface FollowsInput {
    userId: string;
    follows: string;
    followers: string;
};

export interface LoadFollowOptions {
    page: number;
    limit: number;
};

export interface RelateResult {
    err: string;
    followId?: string;
    followerId?: string; 
};

export interface LoadFollowsResult {
    err: string;
    follows?: Set<string>;
};

export interface FollowsParams {
    userIdToFollow: string;
};