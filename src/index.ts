import express from 'express';
import cors from 'cors';
import passport from 'passport';

import loginRouter from './account/router';


const app = express();

app.use(express.json());
app.use(cors());
app.use(passport.initialize());
app.use('/login', loginRouter);

app.get('/', (req: express.Request, res: express.Response) => {
    res.send('initial response');
});

app.post('/', (req: express.Request, res: express.Response) => {
    console.log('data: ', req.body);
    res.status(200).send({
        userId: 'test',
        nickname: 'aa',
        email: 'innfi.world@gmail.com'
    }).end();
});

app.post('/signin', (req: express.Request, res: express.Response) => {
    console.log('data: ', req.body);

    res.status(200).send({
        isAuthenticated: true,
        userTimeline: [{
            index: 0,
            date: new Date(),
            text: 'dummy timeline'
        }]
    }).end();
});

app.listen(1330, () => {
    console.log('starting point');
});
