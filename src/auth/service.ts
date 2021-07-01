import 'reflect-metadata';
import { Service } from 'typedi';

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
            this.logger.error(input.email + '] loadUserAccount: ' +  err);
            return undefined;
        }
    }

    public async createUserAccount(input: CreateUserAccountInput): 
        Promise<CreateUserAccountResult> {
        try {
            return this.accRepo.createUserAccount(input);
        } catch (err: any) {
            this.logger.error(input.email + '] createUserAccount: ' +  err);
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