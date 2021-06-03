import 'reflect-metadata';
import { Service } from 'typedi';
import { JsonController, Req, Res, Body, Post } from 'routing-controllers';
import { Request, Response } from 'express';
import logger from '../common/logger';
import { AccountRepository } from './repository';
import { IUserAccount, UserAccountInput } from './model';


@Service()
@JsonController() 
export class AuthController {
    constructor(protected accRepo: AccountRepository) {}

    @Post('/signup') 
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