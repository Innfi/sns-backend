import mongoose, { Schema, Document } from 'mongoose';


export interface IUserAccount {
    userId: string;
    nickname: string;
    email: string;
    password: string;
    created: Date;
    loggedIn?: Date;
};

export interface IUserAccountDoc extends IUserAccount, Document {}

export const UserAccountSchema = new Schema({
    userId: { type: String, required: true },
    nickname: { type: String },
    email: { type: String, required: true },
    password: { type: String, required: true },
    created: { type: Date },
});

export interface UserAccountInput {
    userId?: string;
    nickname?: string;
    email: string;
    password: string;
};