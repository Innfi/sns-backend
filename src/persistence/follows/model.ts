import { Schema, Document } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';


export interface IFollows {
    userId: string;
    follows?: string[];
    followers?: string[];
}

export interface IFollowsDoc extends IFollows, Document {}

export const FollowsSchema = new Schema({
    userId: { type: String, required: true },
    follows: { type: String },
    followers: { type: String }
});

export const FollowsPaginateSchema = FollowsSchema.plugin(mongoosePaginate);

export interface FollowsInput {
    userId: string;
    follows: string;
    followers: string;
};

export interface RelateResult {
    err: string;
    reason?: string;
};