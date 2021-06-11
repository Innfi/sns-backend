import 'reflect-metadata';
import { Container } from 'typedi';
import { createExpressServer } from 'routing-controllers';
import cors from 'cors';

import { PassportInitializer } from './auth/passport';
import { AuthController } from './auth/controller';
import { CommonController } from './commonController';
import { LoggerBase } from './common/logger';


export class SnsApp {
    protected app: any;
    protected logger: LoggerBase;

    constructor() {
        this.init();

        this.app = createExpressServer({
            controllers: [ 
                CommonController,
                AuthController,
            ],
            //cors: cors(),
        });
    }

    protected init() {
        const initializer = Container.get(PassportInitializer);

        this.logger = Container.get(LoggerBase);
    }

    public start() {
        this.app
            .listen(process.env.npm_package_config_port, () => {
            console.log(`listening ${process.env.npm_package_config_port}`);
        });
    }
}