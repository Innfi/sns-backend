import assert from 'assert';
import { IUserAccount, UserAccountInput } from '../src/persistence/account/model';
import { AccountAdapter } from '../src/persistence/account/adapter';
import { MockAccountAdapter } from '../src/persistence/account/mockAdapter';


describe('MockAccountAdapter', () => {
    const adapter: AccountAdapter = new MockAccountAdapter();
    const input: UserAccountInput = {
        userId: 'test',
        nickname: 'innfi',
        email: 'innfi@test.com',
        password: 'plaintextpw',
    };


    it('current: connectToCollection', () => {
        assert.strictEqual(adapter.connected(), false);
        adapter.connectToCollection();
        assert.strictEqual(adapter.connected(), true);
    });

    it('current: simple create / load', async () => {
        const createResult: IUserAccount = await adapter.createUserAccount(input);
        assert.strictEqual(createResult.email, input.email);

        const loadResult: IUserAccount = 
            await adapter.loadUserAccount(input) as IUserAccount;

        assert.strictEqual(loadResult?.email, input.email);
    });

    it('current: delete element if exist', async () => {
        const loadResult: IUserAccount = 
            await adapter.loadUserAccount(input) as IUserAccount;
        assert.strictEqual(loadResult !== null, true);

        const deleteResult: number = await adapter.deleteUserAccount(input);
        assert.strictEqual(deleteResult, 1);

        const emptyResult: IUserAccount = 
            await adapter.loadUserAccount(input) as IUserAccount;
        assert.strictEqual(emptyResult === null, true);
    });
});

describe('AccountAdapter', () => {
    const adapter: AccountAdapter = new AccountAdapter('mongodb://192.168.1.85/users');

    before(async () => {
        await adapter.connectToCollection();
    });

    after(() => {

    });

    const cleanup = (input: IUserAccount) => {

    };

    it('connectToCollection', async () => {
        assert.strictEqual(adapter.connected(), true);
    });

    it('load not created user', async () => {
        const emptyResult: IUserAccount | null = await adapter.loadUserAccount({
            email: 'invalid@test.com',
            password: ''
        });

        assert.strictEqual(emptyResult === null, true);
    });

    it('create / delete user', async () => {
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

        const deleteResult: number = await adapter.deleteUserAccount(input);
        assert.strictEqual(deleteResult, 1);

        const emptyResult: IUserAccount | null = await adapter.loadUserAccount(input);
        assert.strictEqual(emptyResult === null, true);
    });
});