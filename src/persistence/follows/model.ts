import { Schema, Document } from 'mongoose';


export interface IFollows {
    userId: string;
    follows?: string[];
    followers?: string[];
}

export interface IFollowsDoc extends IFollows, Document {}

export const FollowsSchema = new Schema({
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
    reason?: string;
};