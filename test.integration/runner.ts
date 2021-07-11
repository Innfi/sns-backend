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

    it('signup - signin', async () => {
        const input: CreateUserAccountInput = helper.newCreateUserAccountInput();

        const signupRes = await request(snsApp.app)
        .post('/signup')
        .send(input)
        .expect(200);
        const signupResp: CreateUserAccountResult = signupRes.body;
        assert.strictEqual(signupResp.err, 'ok');
        
        const loadInput = helper.toLoadUserAccountInput(input);
        const signinRes = await request(snsApp.app)
        .post('/signin')
        .send(loadInput)
        .expect(200);
        
        const signinBody = signinRes.body;
        assert.strictEqual(signinBody.err, 'ok');
        assert.strictEqual(signinBody.jwtToken !== undefined, true);

        const privatePageResp = await request(snsApp.app)
        .get('/hideout')
        .set("Authorization", `bearer ${signinBody.jwtToken}`)
        .expect(200);
        
        const msg: string = privatePageResp.body.msg;
        assert.strictEqual(msg, 'test output for private page');
    });

    //relate peers

    //timeline
});
