import {
  IUserAccount,
  LoadUserAccountInput,
  CreateUserAccountInput,
  CreateUserAccountResult,
  UserProfilePayload,
} from './model';

export interface AccountAdapterBase {
  connectToCollection();
  connected(): boolean;
  loadUserAccount(
    input: LoadUserAccountInput,
    projection?: string,
  ): Promise<IUserAccount>;
  createUserAccount(
    input: CreateUserAccountInput,
  ): Promise<CreateUserAccountResult>;
  deleteUserAccount(input: CreateUserAccountInput): Promise<number>;
  loadUserProfile(userId: string): Promise<UserProfilePayload | undefined>;
  cleanupData();
}
