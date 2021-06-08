import { createExpressServer } from 'routing-controllers';
import cors from 'cors';
import { AuthController } from './auth/controller';
import { CommonController } from './commonController';


export class SnsApp {
    protected app: any;

    constructor() {
        this.app = createExpressServer({
            controllers: [ 
                CommonController,
                AuthController,
            ],
            //cors: cors(),
        });
    }

    start() {
        this.app
            .listen(process.env.npm_package_config_port, () => {
            console.log(`listening ${process.env.npm_package_config_port}`);
        });
    }
}