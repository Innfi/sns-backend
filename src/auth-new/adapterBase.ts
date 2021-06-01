import 'reflect-metadata';
import { IUserAccount, UserAccountInput } from './model';


export interface UserAdapterBase {
    connectToCollection(): Promise<void>;
    connected(): boolean;
    loadUserAccount(input: UserAccountInput, projection: string): 
        Promise<IUserAccount | null>
    createUserAccount(input: UserAccountInput): Promise<IUserAccount>;
    deleteUserAccount(input: UserAccountInput): Promise<number>;
}