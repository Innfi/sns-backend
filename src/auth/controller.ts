import 'reflect-metadata';
import { Container, Service } from 'typedi';
import { useContainer, JsonController, Req, Res, Body, Post, UseBefore,
    ExpressMiddlewareInterface } from 'routing-controllers';
import { Request, Response } from 'express';

import { LoggerBase } from '../common/logger';
import { AccountRepository } from './repository';
import { IUserAccount, UserAccountInput } from './model';
import { AuthLocalMiddleware } from './middleware';


useContainer(Container);

@Service()
class TestMiddleware implements ExpressMiddlewareInterface {
    use (req: any, res: any, next: (err?: any) => any): any {
        console.log(`test] body: ${req.body}`);

        next();
    }
}

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

    @Post('/signin')  
    //@UseBefore(TestMiddleware)
    @UseBefore(AuthLocalMiddleware)
    async signIn(@Req() req: Request, @Res() res: Response, @Body() userData: UserAccountInput) {
        try {
            console.log(`/signin] body: ${JSON.stringify(req.body)}`);

            return res.status(200).send({
                msg: 'dummy success'
            });
            //const token: Express.AuthInfo | undefined = req.authInfo;
            //if(token === undefined) {
            //    return res.status(400).send('invalid token');
            //}

            //const signinResp: IUserAccount | null = await this.accRepo.loadUserAccount(req.body);
            //if(signinResp === null) { //FIXME
            //    res.status(500).send('server error').end();
            //    return;
            //} 
                
            //return res.status(200).send({
            //    token: req.authInfo as Express.AuthInfo
            //});
        } catch (err) {
            this.logger.error(`/signin error: ${err}`);
            return res.status(500).send('server error');
        }
    }
}