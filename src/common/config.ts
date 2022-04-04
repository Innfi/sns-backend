import { Service } from 'typedi';

@Service()
export class CommonConfig {
  // FIXME: read configurations from persistence layer
  dbUrl: string = 'mongodb://192.168.1.134:27017/sns';

  fileLogPath: string = './log/backend.log';
}
