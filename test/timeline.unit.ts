import assert from 'assert';
import { Container } from 'typedi';

import { IUserTimeline, UserTimelineInput, TimelineRepository, TimelineRepositoryFactory 
} from '../src/timeline';
import { TestHelper } from '../test.helper/helper';


describe('unit: timeline', () => {
  const helper = Container.get(TestHelper);
  const factory = Container.get(TimelineRepositoryFactory);
  const repo: TimelineRepository = factory.createFakeRepository();

  it('write a timeline', async () => {
    const input: UserTimelineInput = helper.newTimelineInput();

    const writeResult = await repo.writeUserTimeline(input.authorId, input);

    assert.strictEqual(helper.isValidTimeline(input, writeResult!), true);
  });

  it('write result has timeline id', async () => {
    const input: UserTimelineInput = helper.newTimelineInput();

    const writeResult: IUserTimeline | undefined = 
            await repo.writeUserTimeline(input.authorId, input);

    assert.strictEqual(writeResult!.tmId.length > 0, true);
  });

  it('write returns undefined for empty author id', async () => {
    const input: UserTimelineInput = helper.newTimelineInput();
    const userId = input.authorId;
    input.authorId = '';

    const writeResult: IUserTimeline | undefined = 
            await repo.writeUserTimeline(userId, input);

    assert.strictEqual(writeResult, undefined);
  });

  it('write returns undefined for empty text', async () => {
    const input: UserTimelineInput = helper.newTimelineInput();
    input.text = '';

    const writeResult: IUserTimeline | undefined = 
            await repo.writeUserTimeline(input.authorId, input);

    assert.strictEqual(writeResult, undefined);
  });

  it('loadTimeline', async () => {
    const input: UserTimelineInput = helper.newTimelineInput();
    const writeResult: IUserTimeline | undefined = 
            await repo.writeUserTimeline(input.authorId, input);

    const loadResult: IUserTimeline[] = 
            await repo.loadUserTimeline(input.authorId, { page:1, limit: 10 });

    assert.strictEqual(helper.containsTimeline(loadResult, writeResult!), true);
  });

  it('loadTimeline returns empty array for invalid userId', async () => {
    const loadResult: IUserTimeline[] = 
            await repo.loadUserTimeline('', { page:1, limit: 10 });

    assert.deepStrictEqual(loadResult, []);
  });

  it('loadTimeline paging', async () => {
    const userId: string = helper.createUserId();
    const inputLength = 3;
    const inputArray: UserTimelineInput[] = helper.newTimelineInputArray(userId, inputLength);

    await helper.writeTimelines(repo, inputArray);

    const targetText = 'here';
    await repo.writeUserTimeline(userId, { authorId: userId, text: targetText});

    await helper.writeTimelines(repo, inputArray);

    const loadResult: IUserTimeline[] = 
            await repo.loadUserTimeline(userId, {page: inputLength+1, limit: 1});

    assert.strictEqual(loadResult[0].text, targetText);
  });
});
