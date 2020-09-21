import { exception } from "console";


class UserLoginInfo {
    id: string = '';
    email: string = '';
}

class LoginManager {
    constructor() {

    }

    async loadUser(id: string): Promise<UserLoginInfo> {
        throw new exception('not implemented');
    }

    async createUser(id: string): Promise<UserLoginInfo> {
        throw new exception('not implemented');
    }
} 

export default LoginManager;