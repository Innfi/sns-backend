import 'reflect-metadata';
import { Container } from 'typedi';
import passport from 'passport';
import passportLocal from 'passport-local';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { AccountRepository } from './repository';
import { IUserAccount, UserAccountInput } from './model';

const LocalStrategy = passportLocal.Strategy;
const accRepo: AccountRepository = Container.get(AccountRepository);
const dummySecret = 'changeme';


passport.use(
    new LocalStrategy({
        usernameField: 'email',
        passwordField: 'passwd'
    }, 
    (email: string, passwd: string, done: Function) => {
        accRepo.loadUserAccount({
            email: email
        })
        .then((value: IUserAccount | null) => {
            if(!value) return done(null, false, { msg: 'user not found'});

            const user = value as IUserAccount;
            if(!bcrypt.compare(passwd, user.password!)) return done(null, false, { msg: 'invalid passwd'});

            const token: string = jwt.sign({ 
                email: user.email,
                passwd: user.password!
            }, dummySecret);

            return done(null, user, { msg: 'login success', token: token});
        })
        .catch((err: any) => done(err));
    })
);
