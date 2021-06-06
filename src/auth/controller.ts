import 'reflect-metadata';
import { Service } from 'typedi';
import { JsonController, Req, Res, Body, Post, UseBefore } from 'routing-controllers';
import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import passportLocal from 'passport-local';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import logger from '../common/logger';
import { AccountRepository } from './repository';
import { IUserAccount, UserAccountInput } from './model';
//import { AuthLocalMiddleware } from './middleware';

const LocalStrategy = passportLocal.Strategy;

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

@Service()
@JsonController() 
export class AuthController {
    constructor(protected accRepo: AccountRepository) {}

    @Post('/signup') 
    @UseBefore(passport.authenticate('local'))
    async signUp(@Req() req: Request, @Res() res: Response, @Body() userData: UserAccountInput) {
        try {
            logger.info('/signup: ' + JSON.stringify(userData));

            const signupResp: IUserAccount | null = await this.accRepo.createUserAccount(userData);
            if(signupResp === null) { //FIXME
                res.status(500).send('server error').end();
                return;
            } else {
                res.status(200).send(signupResp).end();
            }
        } catch(err) {
            logger.error('/signup error: ' + err);
            res.status(500).send('server error').end();
        }
    }

    @Post('/signin')  //TODO: apply password authentication / jwt sign
    async signIn(@Req() req: Request, @Res() res: Response, @Body() userData: UserAccountInput) {
        try {
            const token: Express.AuthInfo | undefined = req.authInfo;
            if(token === undefined) {
                res.status(400).send('invalid token').end();
            }

            const signinResp: IUserAccount | null = await this.accRepo.loadUserAccount(req.body);
            if(signinResp === null) { //FIXME
                res.status(500).send('server error').end();
                return;
            } 
                
            res.status(200).send({
                email: signinResp.email,
                token: req.authInfo as Express.AuthInfo
            }).end();
        } catch (err) {
            logger.error('/signin error: ', err);
            res.status(500).send('server error').end();
        }
    }
}