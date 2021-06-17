import 'reflect-metadata';
import { Container } from 'typedi';
import express from 'express';
import passport from 'passport';
import { useExpressServer } from 'routing-controllers';

import { AuthController } from './auth/controller';
import { CommonController } from './commonController';
import { LoggerBase } from './common/logger';


export class SnsApp {
    protected app: any;
    protected logger: LoggerBase;

    constructor() {
        this.init();

        this.app = express();
        this.app.use(passport.initialize());

        useExpressServer(this.app, {
            controllers: [ 
                CommonController,
                AuthController,
            ],
        });
    }

    protected init() {
        this.logger = Container.get(LoggerBase);
    }

    public start() {
        this.app
            .listen(process.env.npm_package_config_port, () => {
            console.log(`listening ${process.env.npm_package_config_port}`);
        });
    }
}