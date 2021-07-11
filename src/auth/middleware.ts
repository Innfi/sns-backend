import express from 'express';
import passport from 'passport';
import { ExpressMiddlewareInterface, UnauthorizedError } from 'routing-controllers';
import { Service } from 'typedi';


@Service()
export class AuthMiddleware implements ExpressMiddlewareInterface {
    authenticate = (callback: ((...args: any[]) => any) | undefined) => {
        return passport.authenticate('jwt', { session: false }, callback);
    };

    use(req: express.Request, res: express.Response, next: express.NextFunction): 
        Promise<passport.Authenticator> {
        return this.authenticate((err, user, info) => {
            if(err || !user) return next(new UnauthorizedError(info));

            req.user = user;
            return next();
        })(req, res, next);
    }
}