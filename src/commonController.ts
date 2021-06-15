import 'reflect-metadata';
import { Service } from 'typedi';
import { Authorized, Get, JsonController, Req, Res } from 'routing-controllers';
import { Request, response, Response } from 'express';
import { LoggerBase } from './common/logger';


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
    @Authorized()
    getHideout(@Req() req: Request, @Res() res: Response): any {
        return res.status(200).send({
            msg: 'test output for private page'
        });
    }
};
