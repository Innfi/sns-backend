import mongoose, { Schema, Document } from 'mongoose';


export interface IUserAccount extends Document {
    userId: string;
    nickname: string;
    email: string;
    password: string;
    created: Date;
    loggedIn?: Date;
};


export const UserAccountSchema = new Schema({
    userId: { type: String },
    nickname: { type: String },
    email: { type: String },
    password: { type: String },
    created: { type: Date },
});