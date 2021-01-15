import express from 'express';
import logger from '../common/logger';
import { IUserTimeline } from '../persistence/timeline/model';
import { TimelineRepository } from '../persistence/timeline/repository';


const timelineRouter = express.Router();

timelineRouter.get('/', async (req: express.Request, res: express.Response) => {
    try {
        logger.info('/timeline get: ' + JSON.stringify(req.body));

        //TODO: call from repository
    } catch (err: any) {
        logger.error('/timeline get error: ' + err);
        res.status(500).send('server error').end();
    }
});

timelineRouter.post('/', async (req: express.Request, res: express.Response) => {
    try {
        logger.info('/timeline post: ' + JSON.stringify(req.body));

        //TODO: call from repository
    } catch (err: any) {
        logger.error('/timeline post error: ' + err);
        res.status(500).send('server error').end();
    }
});

export default timelineRouter;