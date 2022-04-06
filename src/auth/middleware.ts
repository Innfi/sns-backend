import express from 'express';
import passport from 'passport';
import {
  ExpressMiddlewareInterface,
  UnauthorizedError,
} from 'routing-controllers';
import { Service } from 'typedi';

const authenticate = (callback: ((...args: any[]) => any) | undefined) =>
  passport.authenticate('jwt', { session: false }, callback);

@Service()
class AuthMiddleware implements ExpressMiddlewareInterface {
  use(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ): Promise<passport.Authenticator> {
    return authenticate((err, user, info) => {
      if (err || !user) return next(new UnauthorizedError(info));

      req.user = user;
      return next();
    })(req, res, next);
  }
}

export default AuthMiddleware;
