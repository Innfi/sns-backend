import 'reflect-metadata';
import { Container, Service } from 'typedi';
import { useContainer, ExpressMiddlewareInterface } from 'routing-controllers';
import { Request, Response } from 'express';
import passport from 'passport';
import passportLocal from 'passport-local';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { NextFunction } from 'express';
import { IUserAccount } from './model';
import { AccountRepository } from './repository';


useContainer(Container);

@Service()
export class AuthLocalMiddleware implements ExpressMiddlewareInterface {
    protected dummySecret: string = 'changeme';
    protected localStrategyOptions: passportLocal.IStrategyOptions = {
        usernameField: 'email',
        passwordField: 'password'
    };

    constructor(protected accRepo: AccountRepository) {
	    console.log('AuthLocalMiddleware] ');
        //this.init();
    }

    //protected init(): void {
    //    console.log('AuthLocalMiddleware.init] ');
    //    let LocalStrategy = passportLocal.Strategy;
    //    passport.use(new LocalStrategy(this.localStrategyOptions, this.verifyLocal));
    //}

    public verifyLocal(email: string, password: string, done: Function): void {
        console.log('verifyLocal');
        this.accRepo.loadUserAccount({ email: email})
        .then((user: IUserAccount | null) => {
            if(user === null) return done(null, false, { msg: 'user not found' });

            if(!bcrypt.compare(password, user.password as string)) return done(null, false, { msg: 'invalid password' });

            const token: string = jwt.sign({
                email: user.email,
                password: user.password
            }, this.dummySecret);

            return done(null, user, { msg: 'success', jwtToken: token});
        })
        .catch((err: any) => done(err));
    };

    use(req: Request, res: Response, next: (err?: any) => any): any {
        console.log('AuthLocalMiddleware.use] ');
        console.log(`body: ${JSON.stringify(req.body)}`);
        console.log(`query: ${JSON.stringify(req.query)}`);
        console.log(`hdeader: ${JSON.stringify(req.header('content-type'))}`);

        //this.verifyLocal('innfi@test.com', 'dummy', next);

        next();
    }
}