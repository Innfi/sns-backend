import 'reflect-metadata';
import { IUserAccount, UserAccountInput, UserProfilePayload } from './model';


export interface AccountAdapterBase {
    connectToCollection(): Promise<void>;
    connected(): boolean;
    loadUserAccount(input: UserAccountInput, projection?: string): 
        Promise<IUserAccount | null>
    createUserAccount(input: UserAccountInput): Promise<IUserAccount>;
    deleteUserAccount(input: UserAccountInput): Promise<number>;

    loadUserProfile(userId: string): Promise<UserProfilePayload|null>;
}