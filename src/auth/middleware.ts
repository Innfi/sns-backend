//import 'reflect-metadata';
//import { Service } from 'typedi';
//import { ExpressMiddlewareInterface } from 'routing-controllers';
//import passport from 'passport';
//import passportLocal from 'passport-local';
//import bcrypt from 'bcrypt';
//import jwt from 'jsonwebtoken';
//import { NextFunction } from 'express';
//import { IUserAccount } from './model';
//import { AccountRepository } from './repository';
//
//
//
//@Service()
//export class AuthLocalMiddleware implements ExpressMiddlewareInterface {
//    protected dummySecret: string = 'dummySecretKey';
//
//    constructor(protected accRepo: AccountRepository) {
//        this.initPassportLocal();
//    }
//
//    protected initPassportLocal() {
//        const LocalStrategy = passportLocal.Strategy;
//
//        passport.use(
//            new LocalStrategy({
//                usernameField: 'email',
//                passwordField: 'passwd'
//            }, 
//            (email: string, passwd: string, done: Function) => {
//                this.accRepo.loadUserAccount({
//                    email: email
//                })
//                .then((value: IUserAccount | null) => {
//                    if(!value) return done(null, false, { msg: 'user not found'});
//
//                    const user = value as IUserAccount;
//                    if(!bcrypt.compare(passwd, user.password!)) return done(null, false, { msg: 'invalid passwd'});
//
//                    const token: string = jwt.sign({ 
//                        email: user.email,
//                        passwd: user.password!
//                    }, this.dummySecret);
//
//                    return done(null, user, { msg: 'login success', token: token});
//                })
//                .catch((err: any) => done(err));
//            })
//        );
//    }
//
//    async use(request: Request, response: Response, next: NextFunction): Promise<void> {
//        return passport.authenticate('local', {
//        });
//    }   
//}
//
//