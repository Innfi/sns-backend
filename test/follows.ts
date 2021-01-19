import assert from 'assert';
import { MockFollowsAdapter } from '../src/persistence/follows/mockAdapter';

describe('FollowsAdapter', () => {
    const adapter = new MockFollowsAdapter();

    it('current: returns empty relations by default', async () => {
        const userId: string = 'innfi';
        const follows = await adapter.loadFollows(userId);
        assert.deepStrictEqual(follows === undefined, true);

        const followers = await adapter.loadFollowers(userId);
        assert.deepStrictEqual(followers === undefined, true);
    });

    it('current: follower relations', async () => {
        const followId: string = 'test1';
        const followerId: string = 'test2';

        await adapter.relate(followId, followerId);

        const followers = await adapter.loadFollowers(followId) as Set<string>;
        assert.strictEqual(followers.has(followerId), true);
    });
});