import assert from 'assert';
import { Container } from 'typedi';

import { UserProfilePayload } from '../src/auth/model';
import { LoadFollowsResult, RelateResult } from '../src/follows/model';
import { FollowsRepository, FollowsRepositoryFactory } from '../src/follows/repository';
import { TestHelper } from '../test.helper/helper';


/**
 * relate 
 * loadFollows
 * loadFollowers
 */

describe('follows: unit', () => {
    const followsFactory = Container.get(FollowsRepositoryFactory);
    const helper = Container.get(TestHelper);

    it('relate', async () => {
        const repo: FollowsRepository = followsFactory.createFakeRepository();
        
        const userId1 = 'innfi';
        const userId2 = 'ennfi';

        const relateResult: RelateResult = await repo.relate(userId1, userId2);
        
        assert.strictEqual(
            helper.isValidRelateResult(relateResult, userId1, userId2), true);
    });

    it('loadFollows', async () => {
        const repo: FollowsRepository = followsFactory.createFakeRepository();

        const followId = helper.createUserId();
        const followerId = helper.createUserId();
        await repo.relate(followId, followerId);

        const followsResult: LoadFollowsResult | undefined  = 
            await repo.loadFollows(followerId);
        
        assert.strictEqual(helper.isValidLoadResult(followsResult!), true);
        assert.strictEqual(helper.hasFollow(followsResult!, followId), true);
    });
});

// describe('follows repository', () => {
//     const followsFactory = Container.get(FollowsRepositoryFactory);

//     it('initialize', () => {
//         const followsRepo = followsFactory.createFakeRepository();
//         assert.strictEqual(followsRepo !== null, true);
//     });

//     it('follow user and check', async () => {
//         const followsRepo = followsFactory.createFakeRepository();

//         const targetUserId = 'innfi';
//         const followerId1 = 'ennfi';

//         const result1 = await followsRepo.relate(targetUserId, followerId1);
//         assert.strictEqual(result1!.err, 'ok');

//         const followers: UserProfilePayload[] | null = 
//             await followsRepo.loadFollowersData(targetUserId, { page: 1, limit: 10 });
//         assert.strictEqual(followers !== null, true);
             
//         followers?.forEach((value: UserProfilePayload) => {
//             console.log(`test] userId:${value.userId}`);
//         });

//         const result = followers?.find((value: UserProfilePayload) => value.userId === followerId1);
//         console.log(`--- result: ${result?.userId}`);

//         // assert.strictEqual(followers?.filter(
//         //     (value: UserProfilePayload) => value.userId === followerId1) !== undefined, true);
//     });

//     it('follow error: duplicate', async () => {
//         const followsRepo = followsFactory.createFakeRepository();

//         const targetUserId = 'innfi';
//         const followerId1 = 'ennfi';

//         await followsRepo.relate(targetUserId, followerId1);
//         const dupResult = await followsRepo.relate(targetUserId, followerId1);

//         assert.strictEqual(dupResult?.err, 'duplicate follower');
//     });
// });
