import 'reflect-metadata';
import { Container, Service } from 'typedi';
import { useContainer, JsonController, Req, Res, Body, Post, UseBefore } from 'routing-controllers';
import { Request, Response } from 'express';
import passport from 'passport';

import { LoggerBase } from '../common/logger';
import { AccountRepository } from './repository';
import { IUserAccount, UserAccountInput } from './model';


useContainer(Container);

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
              return res.status(500).send('server error');
          } else {
              return res.status(200).send(signupResp);
          }
        } catch(err) {
            this.logger.error(`/signup error: ${err}`);
            return res.status(500).send('server error');
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