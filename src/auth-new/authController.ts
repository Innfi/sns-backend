import 'reflect-metadata';
import { Request, Response } from 'express';
import { JsonController, Req, Res, Body, Post } from 'routing-controllers';
import logger from '../common/logger';
import { IUserAccount } from '../login/model';
import { accRepo } from '../login/repository';
import { UserAccountInput } from '../login/model';


@JsonController() 
export class AuthController {
    @Post('/signup') 
    async signUp(@Req() req: Request, @Res() res: Response, @Body() userData: UserAccountInput) {
        try {
            logger.info('/signup: ' + JSON.stringify(userData));

            const signupResp: IUserAccount | null = await accRepo.createUserAccount(userData);
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

            const signinResp: IUserAccount | null = await accRepo.loadUserAccount(req.body);
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