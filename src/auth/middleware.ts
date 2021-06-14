import 'reflect-metadata';
import { Container, Service } from 'typedi';
import { useContainer, ExpressMiddlewareInterface } from 'routing-controllers';
import { Request, Response } from 'express';
import { AccountRepository } from './repository';
import { LoggerBase } from '../common/logger';


useContainer(Container);

@Service()
export class AuthMiddleware implements ExpressMiddlewareInterface {
    constructor(protected accRepo: AccountRepository, protected logger: LoggerBase) {
        this.logger.info('AuthMiddleware')
    }
    use(req: Request, res: Response, next: (err?: any) => any): any {

        next();
    }
}