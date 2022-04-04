import { Container, Service } from 'typedi';
import passport from 'passport';
import passportJwt from 'passport-jwt';
import bcrypt from 'bcrypt';

import { AccountRepository } from '.';

interface JwtData {
  email: string;
  password: string;
  iat: string;
}

@Service()
export class PassportInitializer {
  protected seedKey: string = 'changeme'; // FIXME: get secret from other source

  constructor() {
    console.log('constructor');

    const JwtStrategy = passportJwt.Strategy;
    const { ExtractJwt } = passportJwt;
    const jwtStrategyOptions: passportJwt.StrategyOptions = {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: this.seedKey,
    };

    passport.use(new JwtStrategy(jwtStrategyOptions, this.verifyJwt));
  }

  async verifyJwt(jwtData: JwtData, done: Function) {
    if (!jwtData) return done(null, false, { msg: 'empty auth data' });

    const accRepo = Container.get(AccountRepository);
    const userAccount = await accRepo.loadUserAccount({ email: jwtData.email });
    if (!userAccount) done(null, false, { msg: 'invalid token' });

    const password: string = userAccount?.password as string;

    const pass: boolean = await bcrypt.compare(jwtData.password, password);
    if (!pass) done(null, false);

    done(null, userAccount, jwtData);
  }

  secret(): string {
    return this.seedKey;
  }
}
