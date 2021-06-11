import 'reflect-metadata';
import { Service } from 'typedi';
import passport from 'passport';
import passportLocal from 'passport-local';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { AccountRepository } from './repository';
import { IUserAccount } from './model';

@Service()
export class PassportInitializer {
    protected dummySecret: string = 'changeme';

    constructor(protected accRepo: AccountRepository) {
        this.init();
    }

    protected init(): void {
        let LocalStrategy = passportLocal.Strategy;
        console.log('PassportInitializer.init] start');

        passport.use(
            new LocalStrategy({
                usernameField: 'email',
                passwordField: 'passwd'
            }, 
            (email: string, passwd: string, done: Function) => {
                this.accRepo.loadUserAccount({
                    email: email
                })
                .then((value: IUserAccount | null) => {
                    if(!value) return done(null, false, { msg: 'user not found'});
                
                    const user = value as IUserAccount;
                    if(!bcrypt.compare(passwd, user.password!)) return done(null, false, { msg: 'invalid passwd'});
                
                    const token: string = jwt.sign({ 
                        email: user.email,
                        passwd: user.password!
                    }, this.dummySecret);
                
                    return done(null, user, { msg: 'login success', token: token});
                })
                .catch((err: any) => done(err));
            })
        );

        console.log('PassportInitializer.init] end');
    }
}