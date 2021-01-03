import { IUserTimeline } from "./model";


export class TimelineRepository {
    async loadUserTimeline(userId: string): Promise<IUserTimeline[]> {
        return [{ //FIXME: load user timeline from persistence
            authorId: 'admin',
            authorNickname: 'admin', 
            text: 'start write your own!',
            date: new Date()
        }];
    };
};