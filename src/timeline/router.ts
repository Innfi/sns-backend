import express from 'express';
import logger from '../common/logger';
import { IUserTimeline } from '../persistence/timeline/model';
import { tmRepo } from '../persistence/timeline/repository';


const timelineRouter = express.Router();

timelineRouter.get('/:userId', async (req: express.Request, res: express.Response) => {
    try {
        const userId: string = req.params.userId;
        const page: string = req.query.page as string;
        const limit: string = req.query.limit as string;

        logger.info(`userId: ${userId}, page: ${page}, limit: ${limit}`);

        tmRepo.loadUserTimeline(userId, 
            { page: Number.parseInt(page), limit: Number.parseInt(limit)})
        .then((value: IUserTimeline[]| null) => {
            if(value === null) res.status(400).send({ error: 'timeline not found'}).end();

            res.status(200).send({ error: 'ok', timeline: value}).end();
        });
    } catch (err: any) {
        logger.error('/timeline get error: ' + err);
        res.status(500).send('server error').end();
    }
});

timelineRouter.post('/:userId', async (req: express.Request, res: express.Response) => {
    try {
        logger.info('/timeline post: ' + JSON.stringify(req.body));
        const userId: string = req.params.userId;
        const text: string = req.query.text as string;

        tmRepo.writeUserTimeline(userId, { authorId: userId, text: text})
        .then((value: IUserTimeline | null) => {
            if(value === null) res.status(400).send({ error: 'write error'}).end();

            res.status(200).send({ error: 'ok', newTimeline: value}).end();
        });
    } catch (err: any) {
        logger.error('/timeline post error: ' + err);
        res.status(500).send('server error').end();
    }
});

export default timelineRouter;