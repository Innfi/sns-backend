import 'reflect-metadata';
import { Service } from 'typedi';
import bcrypt from 'bcrypt';

import { LoggerBase } from '../common/logger';
import { LoadUserAccountInput, CreateUserAccountInput, CreateUserAccountResult, 
    IUserAccount  } from './model';
import { AccountRepository } from './repository';


@Service()
export class AccountService {
    constructor(
        protected accRepo: AccountRepository,
        protected logger: LoggerBase
    ) {}

    public async loadUserAccount(input: LoadUserAccountInput): 
        Promise<IUserAccount | undefined> {         
        try {
            return this.accRepo.loadUserAccount(input);    
        } catch (err: any) {
            this.logger.error(`loadUserAccount] email: ${input.email}, err: ${err}`);
            return undefined;
        }
    }

    public async createUserAccount(input: CreateUserAccountInput): 
        Promise<CreateUserAccountResult> {
        try {
            input.password = await bcrypt.hash(input.password, 10);

            return this.accRepo.createUserAccount(input);
        } catch (err: any) {
            this.logger.error(`createUserAccount] email: ${input.email}, err: ${err}`);
            return {
                err: 'server error'
            };
        }
    };

    // public async loadUserProfile(userId: string): Promise<UserProfilePayload | null> {
    //     try {
    //         //TODO: caching
            
    //     } catch (err: any) {
    //         this.logger.error(`${userId}] loadUserProfile: + ${err}`);
    //         return null;
    //     }
    // }
};