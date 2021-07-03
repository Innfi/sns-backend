import { Schema, Document } from 'mongoose';


export interface IUserTimeline {
    userId: string;
    authorId: string;
    text: string;
    date: Date;
    tmId: string;
}

export interface IUserTimelineDoc extends IUserTimeline, Document {}

export const UserTimelineSchema = new Schema<IUserTimelineDoc>({
    userId: { type: String, required: true },
    authorId: { type: String, required: true },
    text: { type: String, required: true },
    date: { type: Date },
    tmId: { type: String, required: true },
});

export interface UserTimelineInput {
    authorId: string;
    text: string;
};

export interface LoadTimelineOptions {
    page: number;
    limit: number;
}