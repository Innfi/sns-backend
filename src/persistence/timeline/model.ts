import { Schema, Document } from 'mongoose';


export interface IUserTimeline {
    authorId: string;
    authorNickanem: string;
    text: string;
    date: Date;
}
