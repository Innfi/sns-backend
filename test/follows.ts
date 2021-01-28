import assert from 'assert';
import { MockFollowsAdapter } from '../src/persistence/follows/mockAdapter';
import { FollowsAdapter } from '../src/persistence/follows/adapter';


describe('FollowsAdapter', () => {
    //const adapter = new MockFollowsAdapter();
    const adapter: FollowsAdapter = new FollowsAdapter('mongodb://192.168.1.121/users');

    it('current: returns empty relations by default', async () => {
        const userId: string = 'innfi';
        const follows = await adapter.loadFollows(userId);
        assert.deepStrictEqual(follows === undefined, true);

        const followers = await adapter.loadFollowers(userId);
        assert.deepStrictEqual(followers === undefined, true);
    });

    it('current: follower relations', async () => {
        try {
            const followId: string = 'test1';
            const followerId: string = 'test2';

            await adapter.relate(followId, followerId);

            const followers = await adapter.loadFollowers(followerId) as Set<string>;
            assert.strictEqual(followers.has(followId), true);

            const follows = await adapter.loadFollows(followId) as Set<string>;
            assert.strictEqual(follows.has(followerId), true);
        } catch (err: any) {
            assert.fail();
        }
    });

});