import express from 'express';
import logger from '../common/logger';
import { IUserAccount } from '../persistence/account/model';
import { accRepo } from '../persistence/account/repository';


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

loginRouter.post('/signin', async (req: express.Request, res: express.Response) => {
    try {
        logger.info('/signin: ', JSON.stringify(req.body));

        const signinResp: IUserAccount | null = await accRepo.loadUserAccount(req.body);
        if(signinResp === null) { //FIXME
            res.status(500).send('server error').end();
            return;
        } else {
            //todo: load user timeline 
            
            res.status(200).send(signinResp).end();
        }
    } catch (err) {
        logger.error('/signin error: ', err);
        res.status(500).send('server error').end();
    }
});


export default loginRouter;