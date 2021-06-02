import 'reflect-metadata';
import { Service } from 'typedi';


@Service()
export class Config { //FIXME: read configurations from persistence layer
    public dbUrl: string = 'mongodb://127.0.0.1:27017';
}