import 'reflect-metadata';
import { Service } from 'typedi';
import mongoose  from 'mongoose';

import { LoggerBase } from '../common/logger';
import { FollowsAdapterBase } from "./adapterBase";
import { FollowsSchema, IFollowsDoc, LoadFollowOptions, RelateResult } from './model';
import { CommonConfig } from '../common/config';


@Service()
export class FollowsAdapter implements FollowsAdapterBase {
    protected conn: mongoose.Connection;
    protected connectOptions: mongoose.ConnectionOptions = {
        useNewUrlParser: true,
        useUnifiedTopology: true
    };
    protected collectionName: string = 'follows';
    protected followsModel: mongoose.Model<IFollowsDoc>;
    protected projection: string = '_id userId follows followers';


    constructor(protected logger: LoggerBase, protected config: CommonConfig) {}

    public async connectToCollection(): Promise<void> {
        if(this.connected()) return;

        this.conn = await mongoose.createConnection(
            this.config.dbUrl, this.connectOptions);
        this.followsModel = this.conn.model<IFollowsDoc, mongoose.Model<IFollowsDoc>>(
            this.collectionName, FollowsSchema);
    }

    public connected(): boolean {
        return this.conn?.readyState === mongoose.STATES.connected;
    }

    public async loadFollows(userId: string, options: LoadFollowOptions): 
        Promise<Set<string> | null> {
        if(!this.connected()) await this.connectToCollection();

        const findResult: IFollowsDoc | null = await this.followsModel
            .findOne({ userId: userId })
            .slice('follows', [options.page, options.limit]);
        if(!findResult) return null;

        return new Set((findResult as IFollowsDoc).follows);
    }

    public async loadFollowers(userId: string, options: LoadFollowOptions): 
        Promise<Set<string> | null> {
        if(!this.connected()) await this.connectToCollection();

        const findResult: IFollowsDoc | null = await this.followsModel
            .findOne({userId: userId})
            .slice('followers', [options.page, options.limit]);

        if(!findResult) return null;

        return new Set((findResult as IFollowsDoc).followers);
    }
    public async relate(followId: string, followerId: string): Promise<RelateResult> {
        if(!this.connected()) await this.connectToCollection();

        await this.followsModel.updateOne({ userId: followId }, 
            { $push: { followers: followerId }} , { upsert: true });

        await this.followsModel.updateOne({ userId: followerId }, 
            { $push: { follows: followId } }, { upsert: true });

        return {
            err: 'ok',
            followId: followId,
            followerId: followerId
        };
    }

    public async clear(): Promise<void> {
        return;
    }
}