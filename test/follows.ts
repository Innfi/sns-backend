import assert from 'assert';
import { MockFollowsAdapter } from '../src/persistence/follows/mockAdapter';
import { UserProfilePayload } from '../src/persistence/account/model';
import { LoadFollowOptions } from '../src/persistence/follows/model';
import { FollowsRepository } from '../src/persistence/follows/repository';


describe('FollowsRepository', () => {
    const repo = new FollowsRepository();
    repo.followsAdapter = new MockFollowsAdapter();

    it('load follows list as user profile data', async () => {
        const userId: string = 'innfi';
        const options: LoadFollowOptions = {
            page: 1,
            limit: 3
        };

        const followsPayload: UserProfilePayload[] | null = 
            await repo.loadFollowersData(userId, options);
    });
});

describe('FollowsAdapter', () => {
    const adapter = new MockFollowsAdapter();
    //const adapter: FollowsAdapter = new FollowsAdapter('mongodb://192.168.1.121/users');

    before(async () => {
        await adapter.connectToCollection();
    });

    after(async () => {
        await adapter.cleanup();
    });

    it('returns empty relations by default', async () => {
        await adapter.connectToCollection();

        const userId: string = 'innfi';
        const follows = await adapter.loadFollows(userId, { page:1, limit:1 });
        assert.deepStrictEqual(follows === undefined, true);

        const followers = await adapter.loadFollowers(userId, { page:1, limit:1 });
        assert.deepStrictEqual(followers === undefined, true);
    });

    it('current: follower relations', async () => {
        try {
            const user1: string = 'test1';
            const user2: string = 'test2';

            await adapter.relate(user1, user2);

            const followers = 
                await adapter.loadFollowers(user1, { page:1, limit:10 }) as Set<string>;
            assert.strictEqual(followers.has(user2), true);

            const follows = 
                await adapter.loadFollows(user2, { page:1, limit:10 }) as Set<string>;
            assert.strictEqual(follows.has(user1), true);
        } catch (err: any) {
            assert.fail();
        }
    });

    it('relate many users', async () => {
        try {
            const userId: string = 'innfi';
            const followerLength: number = 5;
            const followerUserIds: string[] = generateDummyIds(30);

            followerUserIds.forEach((value: string) => adapter.relate(userId, value));

            const followers = await adapter.loadFollowers(userId, 
                { page:1, limit: followerLength}) as Set<string>;

            assert.strictEqual(followers.size, followerLength);

        } catch (err: any) {
            assert.fail();
        }
    });

    const generateDummyIds = (count: number) => {
        let ids: string[] = [];

        for(let i=0;i<count;i++) ids.push(`user${i}`);

        return ids;
    };
});
