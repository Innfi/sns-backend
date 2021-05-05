import express from 'express';
import cors from 'cors';
import passport from 'passport';
import { passportInit } from './login/auth';
import loginRouter from './login/router';


const app = express();

app.use(express.json());
app.use(cors());
app.use(passport.initialize());
passportInit();

app.use('/login', loginRouter);

app.get('/', (req: express.Request, res: express.Response) => {
    res.send('root page');
});

app.listen(process.env.npm_package_config_port, () => {
    console.log(`starting point ${process.env.npm_package_config_port}`);
});
