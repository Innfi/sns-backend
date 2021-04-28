import express from 'express';
import passport from 'passport';
import logger from '../common/logger';
import { UserProfilePayload } from '../persistence/account/model';
import { RelateResult } from '../persistence/follows/model';
import { followsRepo } from '../persistence/follows/repository';


const followsRouter = express.Router();

followsRouter.get('/follow/:userId', async (req: express.Request, res: express.Response) =>  {
    try {
        logger.info(`follows] get: ${JSON.stringify(req.body)}`);

        const response: UserProfilePayload[] | null = 
            await followsRepo.loadFollowsData(req.params.userId, req.body);
        if(response === null) {
            res.status(500).send('server error').end();
            return;
        }

        res.status(200).send(response).end();
    } catch(err) {
        logger.error(`follows] get error: ${err}`);
        res.status(500).send('server error').end();
    }
});

followsRouter.get('/follower/:userId', async (req: express.Request, res: express.Response) => {
    try {
        logger.info(`followers] get: ${JSON.stringify(req.body)}`);

        const response: UserProfilePayload[] | null = 
            await followsRepo.loadFollowersData(req.params.userId, req.body);
        if(response === null) {
            res.status(500).send('server error').end();
            return;
        }

        res.status(200).send(response).end();
    } catch (err) {
        logger.error(`followers] get error: ${err}`);
        res.status(500).send('server error').end();
    }
});

followsRouter.post('/relate', 
    passport.authenticate('jwt', {
        session: false,
        failureMessage: 'not authorized'
    }),
    async (req: express.Request, res: express.Response) => {
    try {
        logger.info(`relate] post: ${JSON.stringify(req.body)}`);

        //TODO: who's calling relate?
        const userId: string = 'innfi'; //FIXME

        const response: RelateResult | null = 
            await followsRepo.relate(req.body.followId, userId);
        if(response === null) {
            res.status(500).send('server error').end();
        }

        res.status(200).send(response).end();
    } catch(err) {
        logger.error(`follows] post error: ${err}`);
        res.status(500).send('server error').end();
    }
});


export default followsRouter;