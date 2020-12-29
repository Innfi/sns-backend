import assert from 'assert';
//import { AccountAdapter } from '../src/persistence/adapter';
import { MockAccountAdapter } from '../src/persistence/mockAdapter';
import { AccountRepository } from '../src/account/repository';

describe('AccountRepository', () => {
    it('current: plain constructor', () => {
        const instance: AccountRepository = new AccountRepository();
    });

    it('current: calls adapter methods', () => {

    });
});