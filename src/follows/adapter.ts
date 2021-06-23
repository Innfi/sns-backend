import 'reflect-metadata';
import { Service } from 'typedi';
import { LoggerBase } from '../common/logger';

import { FollowsAdapterBase } from "./adapterBase";
import { LoadFollowOptions, RelateResult } from './model';


@Service()
export class FollowsAdapter implements FollowsAdapterBase {

    constructor(protected logger: LoggerBase) {}

    connectToCollection(): Promise<void> {
        throw new Error('Method not implemented.');
    }
    connected(): boolean {
        throw new Error('Method not implemented.');
    }
    loadFollows(userId: string, options: LoadFollowOptions): Promise<Set<string> | undefined> {
        throw new Error('Method not implemented.');
    }
    loadFollowers(userId: string, options: LoadFollowOptions): Promise<Set<string> | undefined> {
        throw new Error('Method not implemented.');
    }
    relate(followId: string, followerId: string): Promise<RelateResult> {
        throw new Error('Method not implemented.');
    }
    clear(): Promise<void> {
        throw new Error('Method not implemented.');
    }
}