import assert from 'assert';
import { MockFollowsAdapter } from '../src/persistence/follows/mockAdapter';

describe('FollowsAdapter', () => {
    it('calls adapter', () => {
        const adapter = new MockFollowsAdapter();
    });
});