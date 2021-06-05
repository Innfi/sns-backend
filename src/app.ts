import express from 'express';
import { createExpressServer } from 'routing-controllers';
import cors from 'cors';
import passport from 'passport';
import { AuthController } from './auth/controller';


export class SnsApp {
    protected app: any;
    

    constructor() {
        this.app = createExpressServer({
            controllers: [ 
                AuthController,
                //add controllers
            ],
            cors: cors(),
        });
    }

    start() {
        this.app
            .listen(process.env.npm_package_config_port, () => {
            console.log(`listening ${process.env.npm_package_config_port}`);
        });
    }
}