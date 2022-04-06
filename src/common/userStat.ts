// import { ExpressMiddlewareInterface } from 'routing-controllers';
// import { Request, Response } from 'express';
// import { Service } from 'typedi';
// import { EventEmitter } from 'events';

// import LoggerBase from './logger';
// import { userStatEvent } from './userStatHandler';

// @Service()
// export class UserStatMiddleware implements ExpressMiddlewareInterface {
//   protected emitter: EventEmitter;

//   constructor(protected logger: LoggerBase) {
//     this.emitter = new EventEmitter();
//   }

//   use(req: Request, res: Response, next: (err?: any) => any): any {
//     this.logger.info(`UserStatMiddleware] `);

//     if (!req.user) return next();

//     this.emitter.emit(userStatEvent, req.user);

//     next();
//   }
// }
