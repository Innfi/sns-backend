import assert from 'assert';
import { Container } from 'typedi';
import request from 'supertest';

import { SnsApp } from '../src/app';
import { TestHelper } from '../test.helper/helper';
import { CreateUserAccountInput, CreateUserAccountResult, UserProfilePayload 
    } from '../src/auth';
import { IUserTimeline, UserTimelineInput } from '../src/timeline';


interface UserAccountInfo {
    email: string;
    userId: string;
    token: string;
};

describe('integration test', () => {
    const snsApp = Container.get(SnsApp);
    const helper = Container.get(TestHelper);

    after(async () => {
        console.log('---------------------teardown-----------------------');
        await helper.cleanupDatabase();
    });

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
            await userIdExistInFollows(input1.userId!, token, input2.userId!);

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

    const userIdExistInFollows = async (
        userId: string, 
        userToken: string, 
        followerId: string
    ): Promise<boolean> => {
        const response = await request(snsApp.app)
        .get(`/follows/${userId}`)
        .send({ page: 0, limit: 10 })
        .expect(200);
        
        const follows: UserProfilePayload[] = response.body;
        console.log(`=== userId: ${userId}`);
        console.log(`=== follows: ${follows.length}`);

        return follows.findIndex(
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

        const result: any = await writeTimeline(input, token, timelineData);

        assert.strictEqual(result.body['err'], 'ok'); //FIXME: check response
    });

    const writeTimeline = async (
        input: CreateUserAccountInput, 
        token: string,
        data: UserTimelineInput
    ): Promise<any> => {
        return await request(snsApp.app)
        .post(`/timeline/${input.userId}`)
        .set('Authorization', `bearer ${token}`)
        .send(data)
        .expect(200);
    };

    it('loadTimeline: users timeline visible to their followers', async () => {
        const inputs: CreateUserAccountInput[] = createUserPool();
        const accountInfos: UserAccountInfo[] = await proceedToSigninStatus(inputs);
        const celeb: CreateUserAccountInput = {
            userId: 'celeb',
            email: 'celeb@celeb.com',
            nickname: 'who',
            password: 'celebdefault'
        };

        const celebToken = await loadAuthToken(celeb);
        await followCeleb(accountInfos, celeb.userId!);
        const celebTimeline: UserTimelineInput = {
            authorId: celeb.userId!,
            text: 'Lorem ipsum'
        };

        await writeTimeline(celeb, celebToken, celebTimeline);

        await assertFollowersTimeline(accountInfos, celebTimeline);
    });

    const createUserPool = (): CreateUserAccountInput[] => {
        return [
            {
                userId: 'innfi',
                email: 'innfi@test.com',
                nickname: 'innfi',
                password: 'default'
            },
            {
                userId: 'ennfi',
                email: 'ennfi@test.com',
                nickname: 'ennfi',
                password: 'default'
            },
            {
                userId: 'milli',
                email: 'milli@test.com',
                nickname: 'milli',
                password: 'default'
            },
            {
                userId: 'elise',
                email: 'elise@test.com',
                nickname: 'elise',
                password: 'default'
            },
        ];
    };

    const proceedToSigninStatus = async (inputs: CreateUserAccountInput[]): 
        Promise<UserAccountInfo[]> => {

        const output: UserAccountInfo[] = [];

        for(const input of inputs) {
            const token = await loadAuthToken(input);
            output.push({
                email: input.email,
                userId: input.userId as string,
                token: token
            });
        }

        return output;
    }

    const followCeleb = async (accountInfos: UserAccountInfo[], celebId: String) => {
        for(const accountInfo of accountInfos) {
            await request(snsApp.app).post(`/followuser/${accountInfo.userId}`)
                .set("Authorization", `bearer ${accountInfo.token}`)
                .send({ userIdToFollow: celebId })
                .expect(200);
        }
    };

    const assertFollowersTimeline = async (accountInfos: UserAccountInfo[], 
        celebTimeline: UserTimelineInput) => {
        for(const accountInfo of accountInfos) {
            const result = await request(snsApp.app).get(`/timeline/${accountInfo.userId}`)
                .send({ page: 0, limit: 10 })
                .expect(200);

            //check result body
            assert.strictEqual(result.body['err'], 'ok');
            const timelines: IUserTimeline[] = result.body['timelines'];
            const index = timelines.findIndex((value: IUserTimeline) => {
                if(value.authorId != celebTimeline.authorId) return false;
                if(value.text != celebTimeline.text) return false;

                return true;
                }
            );

            assert.strictEqual(index >= 0, true);
        }
    }
});
