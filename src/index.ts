import express from 'express';
import passport from 'passport';

import loginRouter from './account/login';


const app = express();

app.use(express.json());
app.use(passport.initialize());
app.use('/login', loginRouter);

app.listen(3000, () => {
    console.log('starting point');
});

app.get('/', (req: express.Request, res: express.Response) => {
    res.send('initial response');
});