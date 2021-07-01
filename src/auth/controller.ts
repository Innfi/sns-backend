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
    async signUp(
        @Req() req: Request, 
        @Res() res: Response, 
        @Body() userData: CreateUserAccountInput) {
        try {
          this.logger.info('/signup: ' + JSON.stringify(userData));

          const signupResp: CreateUserAccountResult | null = 
            await this.accRepo.createUserAccount(userData);

          if(signupResp === null) { //FIXME
              return res.status(500).send('server error');
          } else {
              return res.status(200).send(signupResp);
          }
        } catch(err) {
            this.logger.error(`/signup error: ${err}`);
            return res.status(500).send('server error');
        }
    }

    @Post('/signin')  
    async signIn(
        @Req() req: Request, 
        @Res() res: Response, 
        @Body() userData: CreateUserAccountInput) {
        try {
            if(!userData) return res.status(400).end();

            this.logger.info('/signin: ' + JSON.stringify(userData));

            //FIXME
            // const user = await this.accRepo.loadUserAccount(userData);
            // if(user === null) return res.status(404).end();
            // if(user.password !== userData.password) return res.status(404).end();

            // const token: string = jwt.sign({
            //     email: user.email,
            //     password: user.password
            // }, this.passportInitializer.secret());

            // return res.status(200).send({
            //     msg: 'success', 
            //     jwtToken: token
            // }).end();

        } catch (err) {
            this.logger.error(`/signin error: ${err}`);
            return res.status(500).send('server error');
        }
    }
}