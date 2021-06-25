import { Service } from 'typedi';


@Service()
export class CommonConfig { //FIXME: read configurations from persistence layer
    public dbUrl: string = 'mongodb://127.0.0.1:27017/sns';
    public fileLogPath: string = './log/backend.log';
}