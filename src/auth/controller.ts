import 'reflect-metadata';
import { Container, Service } from 'typedi';
import {
  useContainer,
  JsonController,
  Req,
  Res,
  Body,
  Post,
} from 'routing-controllers';
import { Request, Response } from 'express';

import { LoggerBase } from '../common/logger';
import {
  LoadUserAccountInput,
  CreateUserAccountInput,
  CreateUserAccountResult,
  AuthenticateResponse,
} from './model';
import { AccountService } from './service';

useContainer(Container);

@Service()
@JsonController()
export class AuthController {
  constructor(
    protected accService: AccountService,
    protected logger: LoggerBase,
  ) {}

  @Post('/signup')
  async signUp(
    @Req() req: Request,
    @Res() res: Response,
    @Body() userData: CreateUserAccountInput,
  ) {
    try {
      this.logger.info(`/signup: ${  JSON.stringify(userData)}`);

      const signupResp: CreateUserAccountResult =
        await this.accService.createUserAccount(userData);

      if (signupResp.err !== 'ok') {
        this.logger.error(`signup error: ${JSON.stringify(signupResp)}`);
        return res.status(500).send('server error');
      }

      return res.status(200).send(signupResp);
    } catch (err) {
      this.logger.error(`/signup error: ${err}`);
      return res.status(500).send('server error');
    }
  }

  @Post('/signin')
  async signIn(
    @Req() req: Request,
    @Res() res: Response,
    @Body() userData: LoadUserAccountInput,
  ) {
    try {
      if (!userData) return res.status(400).end();

      this.logger.info(`/signin: ${  JSON.stringify(userData)}`);

      const resp: AuthenticateResponse = await this.accService.authenticate(
        userData,
      );
      if (resp.err !== 'ok') return res.status(404).end();

      return res.status(200).send(resp).end();
    } catch (err) {
      this.logger.error(`/signin error: ${err}`);
      return res.status(500).send('server error');
    }
  }
}
