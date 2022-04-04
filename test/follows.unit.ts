import assert from 'assert';
import { Container } from 'typedi';

import { RelateResult, LoadRelationMembersResult, FollowsRepository, FollowsRepositoryFactory 
} from '../src/follows';
import { TestHelper } from '../test.helper/helper';


describe('follows: unit', () => {
  const followsFactory = Container.get(FollowsRepositoryFactory);
  const repo: FollowsRepository = followsFactory.createFakeRepository();
  const helper = Container.get(TestHelper);

  it('relate', async () => {
    const userId1 = 'innfi';
    const userId2 = 'ennfi';
    const relateResult: RelateResult = await repo.relate(userId1, userId2);
        
    assert.strictEqual(
      helper.isValidRelateResult(relateResult, userId1, userId2), true);
  });

  it('relate returns error for duplicate relation', async () => {
    const followId = helper.createUserId();
    const followerId = helper.createUserId();
    await repo.relate(followId, followerId);

    const relateResult: RelateResult = await repo.relate(followId, followerId);

    assert.strictEqual(relateResult.err, 'duplicate follower');
  });

  it('loadFollows', async () => {
    const followId = helper.createUserId();
    const followerId = helper.createUserId();
    await repo.relate(followId, followerId);

    const followsResult: LoadRelationMembersResult | undefined = 
            await repo.loadFollows(followerId, { page:1, limit: 5 });
        
    assert.strictEqual(helper.isValidLoadRelationMembersResult(followsResult!), true);
    assert.strictEqual(helper.hasMember(followsResult!, followId), true);
  });

  it('loadFollowers', async () => {
    const followId = helper.createUserId();
    const followerId = helper.createUserId();
    await repo.relate(followId, followerId);

    const followersResult: LoadRelationMembersResult | undefined = 
            await repo.loadFollowers(followId, { page:1, limit: 5});

    assert.strictEqual(helper.isValidLoadRelationMembersResult(followersResult!), true);
    assert.strictEqual(helper.hasMember(followersResult!, followerId), true);
  });
});
