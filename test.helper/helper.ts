import { Service } from 'typedi';
import uniqid from 'uniqid';

import { CreateUserAccountInput } from '../src/auth/model';



@Service()
export class TestHelper {
    public newCreateUserAccountInput(): CreateUserAccountInput {
        const dummyId: string = uniqid();

        return {
            userId: dummyId, 
            nickname: dummyId,
            email: `${dummyId}@test.com`,
            password: uniqid()
        };
    };
};