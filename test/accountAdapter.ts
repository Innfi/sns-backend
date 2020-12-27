import assert from 'assert';
import { IUserAccount, UserAccountInput } from '../src/persistence/model';
import { AccountAdapter } from '../src/persistence/adapter';
import { MockAccountAdapter } from '../src/persistence/mockAdapter';


describe('MockAccountAdapter', () => {
    const adapter: AccountAdapter = new MockAccountAdapter();
    it('current: connectToCollection', () => {
        assert.strictEqual(adapter.connected(), false);
        adapter.connectToCollection();
        assert.strictEqual(adapter.connected(), true);
    });

    it('current: simple create / load', async () => {
        const input: UserAccountInput = {
            userId: 'test',
            nickname: 'innfi',
            email: 'innfi@test.com',
            password: 'plaintextpw',
        };

        const createResult: IUserAccount = await adapter.createUserAccount(input);
        assert.strictEqual(createResult.email, input.email);

        const loadResult: IUserAccount = 
            await adapter.loadUserAccount(input) as IUserAccount;

        assert.strictEqual(loadResult?.email, input.email);
    });
});

describe('AccountAdapter', () => {
    const adapter: AccountAdapter = new AccountAdapter('mongodb://192.168.1.85/users');

    it('connectToCollection', async () => {
        assert.strictEqual(adapter.connected(), false);
        await adapter.connectToCollection();
        assert.strictEqual(adapter.connected(), true);
    });

    it('load not created user', async () => {
        const emptyResult: IUserAccount | null = await adapter.loadUserAccount({
            email: 'invalid@test.com',
            password: ''
        });

        assert.strictEqual(emptyResult === null, true);
    });

    it('create user', async () => {
        const input: IUserAccount = {
            userId: 'innfi#1234',
            nickname: 'innfi',
            email: 'innfi@test.com', 
            password: 'plaintextpw',
            created: new Date(),
        };

        const createResult: IUserAccount | null = await adapter.createUserAccount(input);

        assert.strictEqual(createResult !== null, true);

        assert.strictEqual(createResult?.userId, input.userId);
        assert.strictEqual(createResult?.nickname, input.nickname);
    });
});