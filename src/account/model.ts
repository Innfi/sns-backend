import mongoose, { Schema, Document } from 'mongoose';


interface UserAccount extends Document {
    _id: string;
    userId: string;
    nickname: string;
    email: string;
    created: Date;
    loggedIn: Date;
};


export const UserAccountSchema = new Schema({
    _id: { type: String },
    userId: { type: String },
    nickname: { type: String },
    email: { type: String },
    created: { type: Date },
    loggedIn: { type: Date }
});