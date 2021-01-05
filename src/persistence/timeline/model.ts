import { Schema, Document } from 'mongoose';


export interface IUserTimeline {
    authorId: string;
    authorNickname: string;
    text: string;
    date?: Date;
    textId?: string;
}
