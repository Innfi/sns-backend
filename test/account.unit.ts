import assert from 'assert';
import { Container } from 'typedi';

import { IUserAccount, CreateUserAccountInput, AccountRepository, AccountRepositoryFactory 
    } from '../src/auth';
import { TestHelper } from '../test.helper/helper';


describe('unit: account', () => {
    const helper = Container.get(TestHelper);
    const factory = Container.get(AccountRepositoryFactory);
    const accountRepo: AccountRepository = factory.createFakeRepository();

    it('initial status: empty result for loadUserAccount', async () => {
        const result = await accountRepo.loadUserAccount({ email: 'innfi@test.com'});

        assert.strictEqual(result, undefined);
    });

    it('create - load', async () => {
        const input: CreateUserAccountInput = helper.newCreateUserAccountInput();

        await accountRepo.createUserAccount(input);

        const output: IUserAccount | undefined = 
            await accountRepo.loadUserAccount(input);

        assert.strictEqual(input.nickname, output!.nickname);
    });

    it('error: create duplicate', async () => {
        const input: CreateUserAccountInput = helper.newCreateUserAccountInput();

        await accountRepo.createUserAccount(input);

        const createResult = await accountRepo.createUserAccount(input);

        assert.strictEqual(createResult.err, 'duplicate account');
    });

    it('error: create without email', async () => {
        const input: CreateUserAccountInput = helper.newCreateUserAccountInput();
        input.email = '';

        const result = await accountRepo.createUserAccount(input);

        assert.strictEqual(result.err, 'required field empty');
    });

    it('error: create without password', async () => {
        const input: CreateUserAccountInput = helper.newCreateUserAccountInput();
        input.password = '';

        const result = await accountRepo.createUserAccount(input);

        assert.strictEqual(result.err, 'required field empty');
    });
});

