import assert from 'assert';
import { Container } from 'typedi';

import TestHelper from '../test.helper/helper';
import AccountRepository from '../src/auth/repository';
import FakeAccountAdapter from '../src/auth/adapterFake';
import { CreateUserAccountInput, IUserAccount } from '../src/auth/model';

describe('unit: account', () => {
  const helper = Container.get(TestHelper);
  const accountRepo: AccountRepository = new AccountRepository(
    Container.get(FakeAccountAdapter),
  );

  it('initial status: empty result for loadUserAccount', async () => {
    const result = await accountRepo.loadUserAccount({
      email: 'innfi@test.com',
    });

    assert.strictEqual(result, undefined);
  });

  it('create - load', async () => {
    const input: CreateUserAccountInput = helper.newCreateUserAccountInput();

    await accountRepo.createUserAccount(input);

    const output: IUserAccount | undefined = await accountRepo.loadUserAccount(
      input,
    );

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
