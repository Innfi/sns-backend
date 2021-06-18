import express from 'express';
import passport from 'passport';
import { ExpressMiddlewareInterface, UnauthorizedError } from 'routing-controllers';
import { Service } from 'typedi';


@Service()
export class TestAuthMiddleware implements ExpressMiddlewareInterface {
    authenticate = (callback: ((...args: any[]) => any) | undefined) => 
        passport.authenticate('jwt', { session: false }, callback);

    use(req: express.Request, res: express.Response, next: express.NextFunction): 
        Promise<passport.Authenticator> {
        console.log()
        return this.authenticate((err, user, info) => {
            if(err || !user) return next(new UnauthorizedError(info));

            req.user = user;
            return next();
        })(req, res, next);
    }
}