import 'reflect-metadata';
import { Container, Service } from 'typedi';
import express from 'express';
import passport from 'passport';
import { useContainer, useExpressServer } from 'routing-controllers';

import LoggerBase from './common/logger';
import AuthController from './auth/controller';
import FollowsController from './follows/controller';
import TimelineController from './timeline/controller';
import CommonController from './commonController';

useContainer(Container);

@Service()
class SnsApp {
  app: any;

  constructor(private logger: LoggerBase) {
    this.app = express();
    this.app.use(passport.initialize());

    useExpressServer(this.app, {
      cors: true,
      controllers: [
        CommonController,
        AuthController,
        FollowsController,
        TimelineController,
      ],
    });
  }

  start() {
    this.app.listen(process.env.npm_package_config_port, () => {
      console.log(`listening ${process.env.npm_package_config_port}`);
    });
  }
}

export default SnsApp;
