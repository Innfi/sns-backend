import { IUserTimeline, IUserTimelineInput } from './model';


export class TimelineAdapter {
    constructor(address: string) { 

    }

    async writeUserTimeline(userId: string, input: IUserTimelineInput): Promise<IUserTimeline> {
        return {
            userId: userId,
            authorId: input.authorId,
            text: input.text,
            date: new Date(),
            textId: 'dummyTextId'
        };
    }

    async getUserTimeline(userId: string): Promise<IUserTimeline[]> {
        //FIXME 
        return [];
    }
};