import { IUserTimeline, UserTimelineInput, LoadTimelineOptions } from './model';


export interface TimelineAdapterBase {
    connectToCollection(): Promise<void>;
    connected(): boolean;
    loadUserTimeline(userId: string, options: LoadTimelineOptions): Promise<IUserTimeline[]>;
    writeUserTimeline(userId: string, input: UserTimelineInput): Promise<IUserTimeline>;
    clear(userId: string): Promise<void>;
}