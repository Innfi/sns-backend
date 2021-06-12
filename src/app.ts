import 'reflect-metadata';
import { Container } from 'typedi';
import { createExpressServer } from 'routing-controllers';
import cors from 'cors';

import { PassportInitializer } from './auth/passport';
import { AuthController } from './auth/controller';
import { CommonController } from './commonController';
import { LoggerBase } from './common/logger';
import passport from 'passport';
import { AuthLocalMiddleware } from './auth/middleware';


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
        this.app.use(passport.initialize());
    }

    protected init() {
        //const initializer = Container.get(PassportInitializer);
        Container.get(AuthLocalMiddleware);

        this.logger = Container.get(LoggerBase);
    }

    public start() {
        this.app
            .listen(process.env.npm_package_config_port, () => {
            console.log(`listening ${process.env.npm_package_config_port}`);
        });
    }
}