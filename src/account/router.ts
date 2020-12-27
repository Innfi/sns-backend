import express from 'express';
import logger from '../common/logger';
import LoginManager from './manager';


const loginRouter = express.Router();

loginRouter.post('/signup', (req: express.Request, res: express.Response) => {
    try {
        logger.info('/signup: ' + JSON.stringify(req.body));


    } catch(err) {
        logger.error('/signup error: ' + err);
        res.status(500).send('server error').end();
    }
});

loginRouter.post('/signin', (req: express.Request, res: express.Response) => {
    try {
        logger.info('/signin: ', JSON.stringify(req.body));

    } catch (err) {
        logger.error('/signin error: ', err);
        res.status(500).send('server error').end();
    }
});


export default loginRouter;