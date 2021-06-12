import 'reflect-metadata';
import { Service } from 'typedi';
import { ExpressMiddlewareInterface } from 'routing-controllers';
import { Request, Response } from 'express';
import passport from 'passport';
import passportLocal from 'passport-local';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { NextFunction } from 'express';
import { IUserAccount } from './model';
import { AccountRepository } from './repository';



@Service()
export class AuthLocalMiddleware implements ExpressMiddlewareInterface {
    protected dummySecret: string = 'changeme';
    protected localStrategyOptions: passportLocal.IStrategyOptions = {
        usernameField: 'email',
        passwordField: 'password'
    };

    constructor(protected accRepo: AccountRepository) {
	    console.log('AuthLocalMiddleware] ');
        this.init();
    }

    protected init(): void {
        console.log('AuthLocalMiddleware.init] ');
        let LocalStrategy = passportLocal.Strategy;
        passport.use(new LocalStrategy(this.localStrategyOptions, this.verifyLocal));
    }

    //public async verifyLocal(email: string, password: string, done: Function): Promise<void> {
    //    console.log('verifyLocal');
    //    this.accRepo.loadUserAccount({ email: email})
    //    .then((user: IUserAccount | null) => {
    //        if(user === null) return done(null, false, { msg: 'user not found' });

    //        if(!bcrypt.compare(password, user.password as string)) return done(null, false, { msg: 'invalid password' });

    //        const token: string = jwt.sign({
    //            email: user.email,
    //            password: user.password
    //        }, this.dummySecret);

    //        return done(null, user, { msg: 'success', jwtToken: token});
    //    })
    //    .catch((err: any) => done(err));
    //};

    public async use(request: Request, response: Response, next: (err?: any) => any): Promise<any> {
        //console.log('AuthLocalMiddleware.use] ');
        //console.log(`result: ${JSON.stringify(passport.authenticate('local'))}`);
        //return next(request);

        console.log(request.body.email);
        console.log(request.body.password);

        next();
    }
}