import express from 'express';
import LoginManager from './loginManager';


const loginRouter = express.Router();

loginRouter.get('/:userId', (req: express.Request, res: express.Response) => {
    try {

    } catch(e) {
        res.status(400).send('error from PUT');
    } finally {
        res.status(500).send('server unavailable');
    }
});

loginRouter.put('/:userId', (req: express.Request, res: express.Response) => {
    try {

    } catch(e) {
        res.status(400).send('error from PUT');
    } finally {
        res.status(500).send('server unavailable');
    }
});

export default loginRouter;