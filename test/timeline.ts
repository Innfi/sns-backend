import assert from 'assert';
import { dbUrl } from '../src/common/config';
import { IUserTimeline, UserTimelineInput } from '../src/persistence/timeline/model';
import { MockTimelineAdapter } from '../src/persistence/timeline/mockAdapter';
import { TimelineAdapter } from '../src/persistence/timeline/adapter';
import { TimelineRepository } from '../src/persistence/timeline/repository';


describe('TimelineAdapter', () => {
    const userId: string = 'innfi#1234';
    const textData: UserTimelineInput = {
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
    const repo = new TimelineRepository();
    //repo.timelineAdapter = new TimelineAdapter('mongodb://192.168.1.93/users');
    repo.timelineAdapter = new MockTimelineAdapter();

    it('current: write some timeline and check', async () => {
        const dummyTexts = new Set([
            'test1',
            'hello',
            'world', 
            'for new timeline',
            'best regards'
        ]);

        const userId: string = 'innfi';

        dummyTexts.forEach(async (value: string) => {
            await repo.writeUserTimeline(userId, {
                authorId: userId,
                text: value
            });
        });

        const timelineResult: IUserTimeline[] | null = await repo.loadUserTimeline(userId);
        if(timelineResult === null) assert.fail();

        assert.strictEqual(dummyTexts.size, timelineResult.length);
        (timelineResult as IUserTimeline[]).forEach((value: IUserTimeline) => {                
            assert.strictEqual(dummyTexts.has(value.text), true);
        });
    });
});