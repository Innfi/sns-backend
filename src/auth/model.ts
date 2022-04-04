import { Schema, Document } from 'mongoose';

export interface IUserAccount {
  userId: string;
  nickname: string;
  email: string;
  password?: string;
  created: Date;
  loggedIn?: Date;
  headerUrl?: string;
}

export interface IUserAccountDoc extends IUserAccount, Document {}

export const UserAccountSchema = new Schema<IUserAccountDoc>({
  userId: { type: String, required: true },
  nickname: { type: String },
  email: { type: String, required: true },
  password: { type: String, required: true },
  created: { type: Date },
  headerUrl: { type: String },
});

export interface CreateUserAccountInput {
  nickname?: string;
  email: string;
  password: string;
}

export interface CreateUserAccountResult {
  err: string;
  userId?: string;
  email?: string;
}

export interface LoadUserAccountInput {
  email: string;
  password?: string;
}

export interface UserProfilePayload {
  userId: string;
  nickname: string;
  headerUrl: string;
}

export interface AuthenticateResponse {
  err: string;
  email: string;
  userId?: string;
  nickname?: string;
  jwtToken?: string;
}
