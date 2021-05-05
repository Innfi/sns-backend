import express from 'express';
import passport from 'passport';

import logger from '../common/logger';
import { IUserAccount } from './model';
import { accRepo } from './repository';


const loginRouter = express.Router();

loginRouter.post('/signup', async (req: express.Request, res: express.Response) => {
    try {
        logger.info('/signup: ' + JSON.stringify(req.body));

        const signupResp: IUserAccount | null = await accRepo.createUserAccount(req.body);
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
});

loginRouter.post('/signin', 
    passport.authenticate('local', {
        failureMessage: 'authentication failed',
        session: false
    }),
    async (req: express.Request, res: express.Response) => {
    try {
        const token: Express.AuthInfo | undefined = req.authInfo;
        if(token === undefined) {
            res.status(400).send('invalid token').end();
        }

        logger.info(`token: ${token}`);

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
});


export default loginRouter;