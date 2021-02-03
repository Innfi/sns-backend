import express from 'express';
import logger from '../common/logger';
import { followsRepo } from '../persistence/follows/repository';


const followsRouter = express.Router();

followsRouter.get('/follow', async (req: express.Request, res: express.Response) =>  {
    try {
        logger.info(`follows] get: ${JSON.stringify(req.body)}`);

        //const response = followsRepo.loadFollowsData();
    } catch(err) {
        logger.error(`follows] get error: ${err}`);
        res.status(500).send('server error').end();
    }
});

followsRouter.get('/follower', async (req: express.Request, res: express.Response) => {
    try {
        logger.info(`followers] get: ${JSON.stringify(req.body)}`);

        //const response = followsRepo.loadFollowersData();
    } catch (err) {
        logger.error(`followers] get error: ${err}`);
        res.status(500).send('server error').end();
    }
});

followsRouter.post('/', async (req: express.Request, res: express.Response) => {
    try {

    } catch(err) {
        logger.error(`follows] post error: ${err}`);
        res.status(500).send('server error').end();
    }
});


export default followsRouter;