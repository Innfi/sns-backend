import assert from 'assert';
import { MockFollowsAdapter } from '../src/persistence/follows/mockAdapter';

describe('FollowsAdapter', () => {
    const adapter = new MockFollowsAdapter();

    it('current: returns empty relations by default', async () => {
        const userId: string = 'innfi';
        const follows: string[] = await adapter.loadFollows(userId);
        assert.deepStrictEqual(follows, []);

        const followers: string[] = await adapter.loadFollowers(userId);
        assert.deepStrictEqual(followers, []);
    });

    it('follower relations', async () => {
        const followId: string = 'test1';
        const followerId: string = 'test2';

        await adapter.relate(followId, followerId);

        const followers: string[] = await adapter.loadFollowers(followId);
        //assert.strictEqual(followers.)
    });
});