import assert from 'assert';
//import { AccountAdapter } from '../src/persistence/adapter';
import { MockAccountAdapter } from '../src/persistence/mockAdapter';
import { AccountRepository } from '../src/account/repository';
import { IUserAccount, UserAccountInput } from '../src/persistence/model';

describe('AccountRepository', () => {
    it('current: plain constructor', () => {
        const instance: AccountRepository = new AccountRepository();
    });

    it('current: calls adapter methods', async () => {
        const instance: AccountRepository = new AccountRepository();
        instance.accountAdapter = new MockAccountAdapter();

        const input: UserAccountInput = {
            userId: 'innfi#1234', 
            nickname: 'innfi',
            email: 'innfi@test.com', 
            password: 'testPassword'
        };

        const empty: IUserAccount | null = await instance.loadUserAccount(input);
        assert.strictEqual(empty === null, true);

        const createResult: IUserAccount | null = await instance.createUserAccount(input);
        assert.strictEqual(createResult !== null, true);
        assert.strictEqual((createResult as IUserAccount).email, input.email);
    });
});