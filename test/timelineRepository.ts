import assert from 'assert';
import { IUserTimeline } from '../src/persistence/timeline/model';
import { TimelineRepository } from '../src/persistence/timeline/repository';


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