//import { NextFunction } from 'express';
import passport from 'passport';
import passportLocal from 'passport-local';
import passportJwt from 'passport-jwt';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { IUserAccount } from '../persistence/account/model';
import { accRepo } from '../persistence/account/repository';


interface JwtData {
    email: string,
    passwd: string,
    iat: string
};

const testSecret = 'fixme';

const LocalStrategy = passportLocal.Strategy;
const JwtStrategy = passportJwt.Strategy;
const ExtractJwt = passportJwt.ExtractJwt;

const localStrategyOptions: passportLocal.IStrategyOptions = {
    usernameField: 'email',
    passwordField: 'password'
};

const verifyLocal = async (email: string, password: string, done: Function): Promise<void> => {
    accRepo.loadUserAccount({ email: email})
    .then((user: IUserAccount | null) => {
        if(user === null) return done(null, false, { msg: 'user not found' });

        if(!bcrypt.compare(password, user.password)) return done(null, false, { msg: 'invalid password' });

        const token: string = jwt.sign({
            email: user.email,
            password: user.password
        }, testSecret);

        return done(null, user, { msg: 'success', jwtToken: token});
    })
    .catch((err: any) => done(err));
};

export const passportInit = () => {
    passport.use(new LocalStrategy(localStrategyOptions, verifyLocal));
};