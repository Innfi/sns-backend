import { IUserTimeline, UserTimelineInput, LoadTimelineOptions } from '.';

export interface TimelineAdapterBase {
  connectToCollection();
  connected(): boolean;
  loadUserTimeline(
    userId: string,
    options: LoadTimelineOptions,
  ): Promise<IUserTimeline[]>;
  writeUserTimeline(
    userId: string,
    input: UserTimelineInput,
  ): Promise<IUserTimeline>;
  cleanupData();
}
