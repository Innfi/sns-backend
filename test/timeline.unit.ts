import assert from 'assert';
import { Container } from 'typedi';

import { IUserTimeline, UserTimelineInput } from '../src/timeline/model';
import { TimelineRepository, TimelineRepositoryFactory } from '../src/timeline/repository';


describe('Timeline repository', () => {
    it('write some timeline and check', async () => {
        const factory = Container.get(TimelineRepositoryFactory);
        const repo: TimelineRepository = factory.createFakeRepository();

        const userId: string = 'innfi';
        const dummyTexts = new Set([
            'test1',
            'hello',
            'world', 
            'for new timeline',
            'best regards'
        ]);

        //FIXME: without logic in unit test / single assert by a test
        dummyTexts.forEach(async (value: string) => {
            await repo.writeUserTimeline(userId, {
                authorId: userId,
                text: value
            });
        });

        const timelineResult: IUserTimeline[] | null = 
            await repo.loadUserTimeline(userId, { page:1, limit: 10 });
        if(timelineResult === null) assert.fail();

        assert.strictEqual(dummyTexts.size, timelineResult.length);
        (timelineResult as IUserTimeline[]).forEach((value: IUserTimeline) => {                
            assert.strictEqual(dummyTexts.has(value.text), true);
        });
    });
});
