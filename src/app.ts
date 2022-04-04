import 'reflect-metadata';
import { Container, Service } from 'typedi';
import express from 'express';
import passport from 'passport';
import { useExpressServer } from 'routing-controllers';

import { AuthController } from './auth';
import { CommonController } from './commonController';
import { LoggerBase } from './common/logger';
import { FollowsController } from './follows/controller';
import { TimelineController } from './timeline/controller';

@Service()
class SnsApp {
  public app: any;

  protected logger: LoggerBase;

  constructor() {
    this.init();
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

  protected init() {
    this.logger = Container.get(LoggerBase);
  }

  public start() {
    this.app.listen(process.env.npm_package_config_port, () => {
      console.log(`listening ${process.env.npm_package_config_port}`);
    });
  }
}

export default SnsApp;
