import express from 'express';
import cors from 'cors';
import passport from 'passport';

import loginRouter from './login/router';
import timelineRouter from './timeline/router';


const app = express();

app.use(express.json());
app.use(cors());
app.use(passport.initialize());
app.use('/login', loginRouter);
app.use('/timeline', timelineRouter);

app.get('/', (req: express.Request, res: express.Response) => {
    res.send('root page');
});

app.listen(1330, () => {
    console.log('starting point');
});
