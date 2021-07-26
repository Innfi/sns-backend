import assert from 'assert';
import { Container } from 'typedi';
import request from 'supertest';

import { SnsApp } from '../src/app';
import { TestHelper } from '../test.helper/helper';
import { CreateUserAccountInput, CreateUserAccountResult, UserProfilePayload } from '../src/auth/model';
import { UserTimelineInput } from '../src/timeline/model';


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
    it('signup - signin - relate', async () => {
        const input1: CreateUserAccountInput = helper.newCreateUserAccountInput();
        const input2: CreateUserAccountInput = helper.newCreateUserAccountInput();

        const token1: string = await loadAuthToken(input1);
        const token2: string = await loadAuthToken(input2);

        await assertRelate(input1, token1, input2);
        await assertRelate(input2, token2, input1);
    });

    const assertRelate = async (input1: CreateUserAccountInput, token: string, 
        input2: CreateUserAccountInput) => {
        await relate(input1.userId!, token, input2.userId!);
        const result1: boolean = 
            await userIdExistInFollowers(input1.userId!, token, input2.userId!);

        assert.strictEqual(result1, true);
    };

    const loadAuthToken = async (input: CreateUserAccountInput): Promise<string> => {
        await request(snsApp.app).post('/signup').send(input).expect(200);

        const loadInput = helper.toLoadUserAccountInput(input);
        const signinRes = await request(snsApp.app).post('/signin')
            .send(loadInput).expect(200);

        return signinRes.body.jwtToken;
    };

    const relate = async (
        fromUserId: string, 
        fromUserToken: string, 
        toUserId: string
    ): Promise<void> => {
        await request(snsApp.app)
        .post(`/followuser/${fromUserId}`)
        .set("Authorization", `bearer ${fromUserToken}`)
        .send({
            userIdToFollow: toUserId
        })
        .expect(200);
    };

    const userIdExistInFollowers = async (
        userId: string, 
        userToken: string, 
        followerId: string
    ): Promise<boolean> => {
        const response = await request(snsApp.app)
        .get(`/followers/${userId}`)
        .send({ page: 0, limit: 10 })
        .expect(200);
        
        const followers: UserProfilePayload[] = response.body;
        return followers.findIndex(
            (value: UserProfilePayload) => value.userId == followerId) >= 0;
    };

    //timeline
    it('signup - signin - writeTimeline', async () => {
        const input: CreateUserAccountInput = helper.newCreateUserAccountInput();
        const token: string = await loadAuthToken(input);

        const timelineData: UserTimelineInput = {
            authorId: 'innfi',
            text: 'Lorem ipsum dolor sit amet'
        };

        const result: object = await writeTimeline(input, token, timelineData);

        assert.strictEqual(result['err'], 'ok'); //FIXME: check response
    });

    const writeTimeline = async (
        input: CreateUserAccountInput, 
        token: string,
        data: UserTimelineInput
    ): Promise<object> => {
        return await request(snsApp.app)
        .post(`/timeline/${input.userId}`)
        .set('Authorization', `bearer ${token}`)
        .send(data)
        .expect(200);
    };
});
