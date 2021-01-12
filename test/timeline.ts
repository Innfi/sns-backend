import assert from 'assert';
import { dbUrl } from '../src/common/config';
import { IUserTimeline, IUserTimelineInput } from '../src/persistence/timeline/model';
import { MockTimelineAdapter } from '../src/persistence/timeline/mockAdapter';
import { TimelineAdapter } from '../src/persistence/timeline/adapter';
import { TimelineRepository } from '../src/persistence/timeline/repository';


describe('TimelineAdapter', () => {
    const userId: string = 'innfi#1234';
    const textData: IUserTimelineInput = {
        authorId: userId,
        text: 'newtext'
    };

    const databaseName: string = dbUrl + '/users';
    //const adapter = new TimelineAdapter(databaseName);
    const adapter = new MockTimelineAdapter();

    before(async () => {
        await adapter.connectToCollection();
    });

    after(async () => {
        await adapter.clear(userId);
    });

    it('current: adapter write / get timeline', async () => {
        await assertFindUserTimeline(adapter);
    });

    const assertFindUserTimeline = async (adapter: TimelineAdapter) => {
        assert.strictEqual(adapter.connected(), true);

        const response = await adapter.writeUserTimeline(userId, textData);
        assert.strictEqual(response.authorId, textData.authorId);
        assert.strictEqual(response.textId != null, true);

        const timelines: IUserTimeline[] = await adapter.getUserTimeline(userId);
        const findResult:IUserTimeline | undefined = timelines.find(x => x.authorId === userId);

        if(findResult === undefined) assert.fail();
    }
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

    it('current: write some timeline and check', async () => {

    });
});