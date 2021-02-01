import express from 'express';
import logger from '../common/logger';



const followsRouter = express.Router();

followsRouter.get('/', async (req: express.Request, res: express.Response) =>  {
    try {
        logger.info(`follows] get: ${JSON.stringify(req.body)}`);
    } catch(err) {
        logger.error(`follows] get error: ${err}`);
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