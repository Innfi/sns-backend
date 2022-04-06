import { IUserTimeline } from './model';

export interface TimelineDict {
  [id: string]: IUserTimeline[];
}

class DictSingle {
  // FIXME: move helper class to src/common
  private static instance: DictSingle;

  private constructor() {}

  timelineDict: TimelineDict = {};

  static getInstance(): DictSingle {
    if (!DictSingle.instance) DictSingle.instance = new DictSingle();

    return DictSingle.instance;
  }
}

export default DictSingle;
