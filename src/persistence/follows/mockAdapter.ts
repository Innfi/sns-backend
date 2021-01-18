import logger from '../../common/logger';
import { IFollows, RelateResult } from './model';


export class MockFollowsAdapter {
    async loadFollows(userId: string): Promise<string[]> {
        return [];
    }

    async loadFollowers(userId: string): Promise<string[]> {
        return [];
    }

    async relate(followId: string, followerId: string): Promise<RelateResult> {
        return {
            err: 'success'
        };
    }
}

