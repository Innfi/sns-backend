import 'reflect-metadata';
import { Container } from 'typedi';
import { createExpressServer, Action } from 'routing-controllers';
import express from 'express';

import { AuthController } from './auth/controller';
import { CommonController } from './commonController';
import { LoggerBase } from './common/logger';

import passport from 'passport';
import passportJwt from 'passport-jwt';
import { IUserAccount } from './auth/model';

interface JwtData {
    email: string,
    password: string,
    iat: string
};

const verifyJwt = async (jwtData: JwtData, done: Function): Promise<void> => {
    console.log('verifyJwt');

    if(jwtData === null) return done(null, false, { msg: 'empty auth data'});
    if(jwtData === undefined) return done(null, false, { msg: 'empty auth data'});

    console.log(`jwtData: ${JSON.stringify(jwtData)}`);

    const dummyUser: IUserAccount = {
        userId: 'innfi',
        email: 'test@test.com', 
        created: new Date(),
        nickname: 'ennfi'
    };

    return done(null, dummyUser, jwtData);

    //accRepo.loadUserAccount({ email: jwtData.email})
    //.then((user: IUserAccount | null) => {
    //    if(user === null) return done(null, false, { msg: 'user not found'});

    //    if((user as IUserAccount).password !== jwtData.password) return done(null, false);

    //    return done(null, user, jwtData);
    //})
    //.catch((err: any) => done(err));
};

const JwtStrategy = passportJwt.Strategy;
const ExtractJwt = passportJwt.ExtractJwt;
const testSecret: string = 'changeme';
const jwtStrategyOptions: passportJwt.StrategyOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: testSecret
};

passport.use(new JwtStrategy(jwtStrategyOptions, verifyJwt));

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
        //this.app.use(express.json());
        this.app.use(passport.initialize());
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