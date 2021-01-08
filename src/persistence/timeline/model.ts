import { Schema, Document } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';


export interface IUserTimeline {
    userId: string;
    authorId: string;
    text: string;
    date: Date;
    textId: string;
}

export interface IUserTimelineDoc extends IUserTimeline, Document {}

export const UserTimelineSchema = new Schema({
    userId: { type: String, required: true },
    authorId: { type: String, required: true },
    text: { type: String, required: true },
    date: { type: Date },
    textId: { type: String, required: true },
});

export const UserTimelinePaginateSchema = UserTimelineSchema.plugin(mongoosePaginate);

export interface IUserTimelineInput {
    authorId: string;
    text: string;
};
