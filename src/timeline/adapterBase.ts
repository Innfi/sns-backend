import { IUserTimeline, UserTimelineInput, LoadTimelineOptions } from './model';

export interface TimelineAdapterBase {
    connectToCollection(): Promise<void>;
    connected(): boolean;
    writeUserTimeline(userId: string, input: UserTimelineInput): Promise<IUserTimeline>;
    getUserTimeline(userId: string, options: LoadTimelineOptions): Promise<IUserTimeline[]>;
    clear(userId: string): Promise<void>;
}