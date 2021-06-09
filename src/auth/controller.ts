import 'reflect-metadata';
import { Service } from 'typedi';
import { JsonController, Req, Res, Body, Post, UseBefore } from 'routing-controllers';
import { Request, Response, NextFunction } from 'express';
import passport from 'passport';

import { LoggerBase } from '../common/logger';
import { AccountRepository } from './repository';
import { IUserAccount, UserAccountInput } from './model';


@Service()
@JsonController() 
export class AuthController {
    constructor(protected accRepo: AccountRepository, protected logger: LoggerBase) {}

    @Post('/signup') 
    async signUp(@Req() req: Request, @Res() res: Response, @Body() userData: UserAccountInput) {
        try {
            this.logger.info('/signup: ' + JSON.stringify(userData));

            const signupResp: IUserAccount | null = await this.accRepo.createUserAccount(userData);
            if(signupResp === null) { //FIXME
                res.status(500).send('server error').end();
                return;
            } else {
                res.status(200).send(signupResp).end();
            }
        } catch(err) {
            this.logger.error(`/signup error: ${err}`);
            res.status(500).send('server error').end();
        }
    }

    @Post('/signin')  //TODO: apply password authentication / jwt sign
    @UseBefore(passport.authenticate('local'))
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
            this.logger.error(`/signin error: ${err}`);
            res.status(500).send('server error').end();
        }
    }
}