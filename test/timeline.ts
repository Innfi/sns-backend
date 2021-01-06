import assert from 'assert';
import { IUserTimeline, IUserTimelineInput } from '../src/persistence/timeline/model';
import { MockTimelineAdapter } from '../src/persistence/timeline/mockAdapter';
import { TimelineAdapter } from '../src/persistence/timeline/adapter';
import { TimelineRepository } from '../src/persistence/timeline/repository';


describe('MockTimelineAdapter', () => {
    it('current: write / get timeline', async () => {
        const adapter = new MockTimelineAdapter();

        //TODO: simple write / get operation for single user

        const userId: string = 'innfi#1234';
        const textData: IUserTimelineInput = {
            authorId: userId,
            text: 'newtext'
        };

        const response = await adapter.writeUserTimeline(userId, textData);
        assert.strictEqual(response.authorId, textData.authorId);
        assert.strictEqual(response.textId != null, true);

        const timelines: IUserTimeline[] = await adapter.getUserTimeline(userId);
        const findResult:IUserTimeline | undefined = timelines.find(x => x.authorId === userId);

        if(findResult === undefined) assert.fail();
    });
});

describe('TimelineAdapter', () => {
    it('current: call instance', async () => {
        const adapter = new TimelineAdapter('mongodb://localhost/timeline');
    });
});

describe('TimelineRepository', () => {
    it('current: call repo instance', () => {
        const repo = new TimelineRepository();
    });

    it('current: load default timeline', async () => {
        const repo = new TimelineRepository();

        const firstTimeline: IUserTimeline[] = await repo.loadUserTimeline('emptyUser');

        assert.strictEqual(firstTimeline.length, 1);
        assert.strictEqual(firstTimeline[0].authorId, 'admin');
    });
});