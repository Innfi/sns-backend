import 'reflect-metadata';
import { Container, Service } from 'typedi';
import { useContainer, JsonController, Req, Res, Body, Post } from 'routing-controllers';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { LoggerBase } from '../common/logger';
import { PassportInitializer } from './passportInitializer';
import { AccountRepository } from './repository';
import { IUserAccount, LoadUserAccountInput, CreateUserAccountInput, 
    CreateUserAccountResult } from './model';


useContainer(Container);

@Service()
@JsonController() 
export class AuthController {
    constructor(
        protected accRepo: AccountRepository, 
        protected passportInitializer: PassportInitializer,
        protected logger: LoggerBase
    ) {}

    @Post('/signup') 
    public async signUp(
        @Req() req: Request, 
        @Res() res: Response, 
        @Body() userData: CreateUserAccountInput) {
        try {
            this.logger.info('/signup: ' + JSON.stringify(userData));

            const signupResp: CreateUserAccountResult = 
                await this.accRepo.createUserAccount(userData);

            if(signupResp.err !== 'ok') return res.status(500).send('server error');

            return res.status(200).send(signupResp);
        } catch(err) {
            this.logger.error(`/signup error: ${err}`);
            return res.status(500).send('server error');
        }
    }

    @Post('/signin')  
    public async signIn(
        @Req() req: Request, 
        @Res() res: Response, 
        @Body() userData: LoadUserAccountInput) {
        try {
            if(!userData) return res.status(400).end();

            this.logger.info('/signin: ' + JSON.stringify(userData));

            const account: IUserAccount | undefined = await this.accRepo.loadUserAccount(userData);
            if(!account) return res.status(404).end();
            if(account.password && 
                account.password !== userData.password) return res.status(404).end();

            const token: string = this.toJwtToken(userData);

            return res.status(200).send({
                err: 'ok', 
                userId: account.userId, 
                email: account.email,
                jwtToken: token
            }).end();

        } catch (err) {
            this.logger.error(`/signin error: ${err}`);
            return res.status(500).send('server error');
        }
    }

    protected toJwtToken(userData: LoadUserAccountInput): string {
        return jwt.sign({
            email: userData.email,
            password: userData.password
        }, this.passportInitializer.secret());
    };
}