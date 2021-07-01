import assert from 'assert';
import { Container } from 'typedi';

import { AccountService } from '../src/auth/service';
import { IUserAccount, CreateUserAccountInput } from '../src/auth/model';


describe('unit: account', () => {
    it('initial status: empty result for loadUserAccount', async () => {
        const accountService = Container.get(AccountService);

        const result = await accountService.loadUserAccount({ email: 'innfi@test.com'});

        assert.strictEqual(result, undefined);
    });

    it('create - load', async () => {
        const accountService = Container.get(AccountService);

        const input: CreateUserAccountInput = {
            userId: 'innfi#1234', 
            nickname: 'innfi',
            email: 'innfi@test.com', 
            password: 'testPassword'
        };

        await accountService.createUserAccount(input);

        const output: IUserAccount | undefined = 
            await accountService.loadUserAccount(input);

        assert.strictEqual(input.nickname, output!.nickname);
    });

    it('error: create duplicate', async () => {
        const accountService = Container.get(AccountService);

        const input: CreateUserAccountInput = {
            userId: 'ennfi#22', 
            nickname: 'ennfi',
            email: 'ennfi@test.com',
            password: 'pass'
        };

        await accountService.createUserAccount(input);

        const createResult = await accountService.createUserAccount(input);

        assert.strictEqual(createResult.err, 'duplicate account');
    });

    it('error: create without email', async () => {
        const accountService = Container.get(AccountService);

        const input: CreateUserAccountInput = {
            userId: 'ennfi#22', 
            nickname: 'ennfi',
            email: '',
            password: 'pass'
        };

        const result = await accountService.createUserAccount(input);

        assert.strictEqual(result.err, 'required field empty');
    });

    it('error: create without password', async () => {
        const accountService = Container.get(AccountService);

        const input: CreateUserAccountInput = {
            userId: 'ennfi#22', 
            nickname: 'ennfi',
            email: 'ennfi@test2.com',
            password: ''
        };

        const result = await accountService.createUserAccount(input);

        assert.strictEqual(result.err, 'required field empty');
    });

    it('create without userId', async () => {

    });
});

