import assert from 'assert';
import { Container } from 'typedi';
import { IUserAccount, UserAccountInput } from '../src/auth/model';
import { AccountRepository, AccountRepositoryFactory } from '../src/auth/repository';


describe('AccountRepository', () => {
    const factory = Container.get(AccountRepositoryFactory);

    it('instantiate via Container', () => {
        const repo: AccountRepository = factory.createFakeRepository();

        assert.strictEqual(repo !== null, true);
    });

    it('calls adapter methods', async () => {
        const repo: AccountRepository = factory.createFakeRepository();

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