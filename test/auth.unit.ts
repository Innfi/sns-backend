import assert from 'assert';
import { Container } from 'typedi';
import { IUserAccount, UserAccountInput } from '../src/auth/model';
import { AccountAdapterFake } from '../src/auth/adapterFake';
import { AccountAdapterBase } from '../src/auth/adapterBase';
import { AccountRepository } from '../src/auth/repository';


describe('MockAccountAdapter', () => {
    const adapter: AccountAdapterBase = Container.get(AccountAdapterFake);
    const input: UserAccountInput = {
        userId: 'test', 
        nickname: 'innfi',
        email: 'innfi@test.com',
        password: 'plaintextpw'
    };

    it('connectToCollection', async () => {
        assert.strictEqual(adapter.connected(), false);
        await adapter.connectToCollection();
        assert.strictEqual(adapter.connected(), true);
    });

    it('simple create / load', async () => {
        const createResult: IUserAccount = await adapter.createUserAccount(input);
        assert.strictEqual(createResult.email, input.email);

        const loadResult: IUserAccount = 
            await adapter.loadUserAccount(input) as IUserAccount;

        assert.strictEqual(loadResult?.email, input.email);
    });

    it('delete element if exist', async() => {
        const loadResult: IUserAccount = 
            await adapter.loadUserAccount(input) as IUserAccount;
        assert.strictEqual(loadResult !== null, true);

        const deleteResult: number = 
            await adapter.deleteUserAccount(input);
        assert.strictEqual(deleteResult, 1);

        const emptyResult: IUserAccount = 
            await adapter.loadUserAccount(input) as IUserAccount;
        assert.strictEqual(emptyResult === null, true);
    });
});

describe('AccountRepository', () => {
    it('instantiate via Container', () => {
        const repo: AccountRepository = Container.get(AccountRepository);
    });

    it('calls adapter methods', async () => {
        const repo: AccountRepository = Container.get(AccountRepository);

        const input: UserAccountInput = {
            userId: 'innfi#1234', 
            nickname: 'innfi',
            email: 'innfi@test.com', 
            password: 'testPassword'
        };

        const empty: IUserAccount | null = await repo.loadUserAccount(input);
        assert.strictEqual(empty === null, true);

        const createResult: IUserAccount | null = await repo.createUserAccount(input);
        assert.strictEqual(createResult !== null, true);
        assert.strictEqual((createResult as IUserAccount).email, input.email);
    });
});