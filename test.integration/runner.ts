import assert from 'assert';
import { Container } from 'typedi';
import request, { Response } from 'supertest';

import { SnsApp } from '../src/app';
import { TestHelper } from '../test.helper/helper';
import { CreateUserAccountInput, CreateUserAccountResult } from '../src/auth/model';


describe('integration test', () => {
    const snsApp = Container.get(SnsApp);
    const helper = Container.get(TestHelper);

    it('init supertest', () => {
        request(snsApp.app)
        .get('/')
        .expect('Content-Type', /json/)
        .expect(200);
    });

    it('expect unauthorized error against private page', () => {
        request(snsApp.app)
        .get('/hideout')
        .expect(401);
    });

    it('signup - signin', () => {
        const input: CreateUserAccountInput = helper.newCreateUserAccountInput();

        request(snsApp.app)
        .post('/signup')
        .send(input)
        .expect(200)
        .end((err: any, res: Response) => {
            const signupResp: CreateUserAccountResult = res.body;

            assert.strictEqual(signupResp.err, 'ok');
        });

        const loadInput = helper.toLoadUserAccountInput(input);

        request(snsApp.app)
        .post('/signin')
        .send(loadInput)
        .expect(200)
        .end((err: any, res: Response) => {
            const signinResp = res.body;

            assert.strictEqual(signinResp.err, 'ok');
            assert.strictEqual(signinResp.jwtToken !== undefined, true);
        });
    });

    //relate peers

    //timeline
});
