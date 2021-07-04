import { Service } from 'typedi';
import uniqid from 'uniqid';

import { CreateUserAccountInput } from '../src/auth/model';
import { LoadFollowsResult, RelateResult } from '../src/follows/model';
import { IUserTimeline, UserTimelineInput } from '../src/timeline/model';
import { TimelineRepository } from '../src/timeline/repository';



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

    public isValidTimeline(
        input: UserTimelineInput, 
        timeline: IUserTimeline
    ): boolean {
        if(input.authorId !== timeline.authorId) return false;
        if(input.text !== timeline.text) return false;

        return true;
    };

    public createUserId(): string {
        return uniqid();
    };

    public newTimelineInput(): UserTimelineInput {
        return {
            authorId: uniqid(),
            text: 'test text'
        };
    };

    public newTimelineInputArray(userId: string, len: number): UserTimelineInput[] {
        const inputArray: UserTimelineInput[] = [];

        for(let i=0;i<len;i++) inputArray.push({ authorId: userId, text: 'sample text' });

        return inputArray;
    };

    public containsTimeline(timelines: IUserTimeline[], tmData: IUserTimeline): boolean {
        const findResult = timelines.find((value: IUserTimeline) => {
            if(value.tmId !== tmData.tmId) return false;
            if(value.authorId !== tmData.authorId) return false;
            if(value.text !== tmData.text) return false;
            return true;
        });

        if(!findResult) return false;

        return true;
    };

    public async writeTimelines(repo: TimelineRepository, inputArray: UserTimelineInput[]): 
        Promise<void> {
        for(let i=0;i<inputArray.length;i++) {
            const input = inputArray[i];
            await repo.writeUserTimeline(input.authorId, input);
        }
    };

    public isValidRelateResult(relateResult: RelateResult, 
        followId: string, followerId: string): boolean {
        if(relateResult.err !== 'ok') return false;
        if(relateResult.followId !== followId) return false;
        if(relateResult.followerId !== followerId) return false;

        return true;
    };

    public isValidLoadResult(followsResult: LoadFollowsResult): boolean {
        if(followsResult.err !== 'ok') return false;
        if(!followsResult.follows) return false;

        return true;
    };

    public hasFollow(followsResult: LoadFollowsResult, followId: string): 
        boolean {
        return followsResult.follows!.has(followId);
    };
};