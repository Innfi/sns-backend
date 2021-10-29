import Container, { Service } from 'typedi';
import uniqid from 'uniqid';

import { CreateUserAccountInput, LoadUserAccountInput } from '../src/auth/model';
import { AccountRepository } from '../src/auth/repository';
import { RelateResult, LoadRelationMembersResult } from '../src/follows/model';
import { FollowsRepository } from '../src/follows/repository';
import { IUserTimeline, UserTimelineInput } from '../src/timeline/model';
import { TimelineRepository } from '../src/timeline/repository';



@Service()
export class TestHelper {
    newCreateUserAccountInput(): CreateUserAccountInput {
        const dummyId: string = uniqid();

        return {
            nickname: dummyId,
            email: `${dummyId}@test.com`,
            password: uniqid()
        };
    };

    toLoadUserAccountInput(createInput: CreateUserAccountInput): LoadUserAccountInput {
        return {
            email: createInput.email,
            password: createInput.password
        };
    };

    isValidTimeline(
        input: UserTimelineInput, 
        timeline: IUserTimeline
    ): boolean {
        if(input.authorId !== timeline.authorId) return false;
        if(input.text !== timeline.text) return false;

        return true;
    };

    createUserId(): string {
        return uniqid();
    };

    newTimelineInput(): UserTimelineInput {
        return {
            authorId: uniqid(),
            text: 'test text'
        };
    };

    newTimelineInputArray(userId: string, len: number): UserTimelineInput[] {
        const inputArray: UserTimelineInput[] = [];

        for(let i=0;i<len;i++) inputArray.push({ authorId: userId, text: 'sample text' });

        return inputArray;
    };

    containsTimeline(timelines: IUserTimeline[], tmData: IUserTimeline): boolean {
        const findResult = timelines.find((value: IUserTimeline) => {
            if(value.tmId !== tmData.tmId) return false;
            if(value.authorId !== tmData.authorId) return false;
            if(value.text !== tmData.text) return false;
            return true;
        });

        if(!findResult) return false;

        return true;
    };

    async writeTimelines(repo: TimelineRepository, inputArray: UserTimelineInput[]): 
        Promise<void> {
        for(let i=0;i<inputArray.length;i++) {
            const input = inputArray[i];
            await repo.writeUserTimeline(input.authorId, input);
        }
    };

    isValidRelateResult(relateResult: RelateResult, 
        followId: string, followerId: string): boolean {
        if(relateResult.err !== 'ok') return false;
        if(relateResult.followId !== followId) return false;
        if(relateResult.followerId !== followerId) return false;

        return true;
    };

    isValidLoadRelationMembersResult(result: LoadRelationMembersResult): boolean {
        if(result.err !== 'ok') return false;
        if(!result.type) return false;
        if(!result.members) return false;

        return true;
    };

    hasMember(result: LoadRelationMembersResult, followerId: string):
        boolean {
        return result.members!.findIndex((value: string) => value == followerId) >= 0;
    };

    async cleanupDatabase(): Promise<void> {
        const accRepo = Container.get(AccountRepository);
        await accRepo.cleaupData();

        const followsRepo = Container.get(FollowsRepository);
        await followsRepo.cleanupData();

        const timelineRepo = Container.get(TimelineRepository);
        await timelineRepo.cleanupData();
    }
};