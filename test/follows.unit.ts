// import assert from 'assert';
// import { Container } from 'typedi';
// import { UserProfilePayload } from '../src/auth/model';

// import { FollowsRepositoryFactory } from '../src/follows/repository';


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
