//import express from 'express';
//import cors from 'cors';
//import passport from 'passport';
//import { passportInit } from './login/auth';
//import loginRouter from './login/router';
//import tempRouter from './dummy_private';
//
//
//const app = express();
//
//app.use(express.json());
//app.use(cors());
//app.use(passport.initialize());
//passportInit();
//
//app.use('/login', loginRouter);
//app.use('/temp', tempRouter);
//
//app.get('/', (req: express.Request, res: express.Response) => {
//    res.send('root page');
//});
//
//app.get('/error', (req: express.Request, res: express.Response) => {
//    res.status(401).send({ msg: 'not authenticated'}).end();
//});
//
//app.listen(process.env.npm_package_config_port, () => {
//    console.log(`starting point ${process.env.npm_package_config_port}`);
//});
//