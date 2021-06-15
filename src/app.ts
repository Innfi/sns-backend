import 'reflect-metadata';
import { Container } from 'typedi';
import { createExpressServer, Action } from 'routing-controllers';
import express from 'express';

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
            authorizationChecker: this.authChecker,
        });
        this.app.use(express.json());
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

    public async authChecker(action: Action, roles: any[]): Promise<boolean> {
        console.log('authChecker] in here');

        const token = action.request.headers['authorization'] as string;
        console.log(`authChecker] token: ${token}`);

        return true;
    }
}