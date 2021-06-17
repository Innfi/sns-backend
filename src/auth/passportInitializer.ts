import 'reflect-metadata';
import { Container, Service } from 'typedi';
import passport from 'passport';
import passportJwt from 'passport-jwt';

import { IUserAccount } from './model';
import { AccountRepository } from './repository';


interface JwtData {
    email: string,
    password: string,
    iat: string
};

@Service()
export class PassportInitializer {
    protected seedKey: string = 'changeme'; //FIXME: get secret from other source


    constructor() {
        console.log('constructor');

        const JwtStrategy = passportJwt.Strategy;
        const ExtractJwt = passportJwt.ExtractJwt;
        const jwtStrategyOptions: passportJwt.StrategyOptions = {
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: this.seedKey
        };

        passport.use(new JwtStrategy(jwtStrategyOptions, this.verifyJwt));
    }

    public async verifyJwt(jwtData: JwtData, done: Function): Promise<void> {
        if(jwtData === null) return done(null, false, { msg: 'empty auth data'});
        if(jwtData === undefined) return done(null, false, { msg: 'empty auth data'});

        const accRepo = Container.get(AccountRepository);
        const userAccount = await accRepo.loadUserAccount({ email: jwtData.email });
        if(!userAccount) done(null, false, { msg: 'invalid token'})

        if((userAccount as IUserAccount).password !== jwtData.password) done(null, false);

        done(null, userAccount, jwtData);
    }

    public secret(): string { return this.seedKey; }
};