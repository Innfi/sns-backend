import 'reflect-metadata';
import { Service } from 'typedi';
import { Get, JsonController, Req, Res, UseBefore, Body } from 'routing-controllers';
import { Request, Response } from 'express';
import { LoggerBase } from './common/logger';

import { IUserAccount } from './auth/model';
import { AuthMiddleware } from './auth/middleware';

//dummy service until whole routing is fixed
@Service() 
@JsonController()
export class CommonController {
    constructor(protected logger: LoggerBase) {}

    @Get('/')
    getRoot(@Req() req: Request, @Res() res: Response): any {
        try {
            return res
            .status(200)
            .send({
                msg: 'root page',
                error: 'ok~~'
            });

        } catch (err: any) {
            this.logger.error(`error: ${err}`);
            return res
            .status(500);
        }
    }

    @Get('/hideout')
    @UseBefore(AuthMiddleware)
    getHideout(@Req() req: Request, @Res() res: Response, @Body() body: IUserAccount): any {
        this.logger.info(`user: ${JSON.stringify(req.user)}`);

        return res.status(200).send({
            msg: 'test output for private page'
        }).end();
    }
};
