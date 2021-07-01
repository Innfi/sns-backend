//import 'reflect-metadata';
import { IUserAccount, LoadUserAccountInput, CreateUserAccountInput, 
    CreateUserAccountResult, UserProfilePayload } from './model';


export interface AccountAdapterBase {
    connectToCollection(): Promise<void>;
    connected(): boolean;
    loadUserAccount(input: LoadUserAccountInput, projection?: string): 
        Promise<IUserAccount | undefined>
    createUserAccount(input: CreateUserAccountInput): Promise<CreateUserAccountResult>;
    deleteUserAccount(input: CreateUserAccountInput): Promise<number>;

    loadUserProfile(userId: string): Promise<UserProfilePayload|null>;
}