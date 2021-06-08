import 'reflect-metadata';
import { Service } from 'typedi';
import { Get, JsonController, Req, Res } from 'routing-controllers';
import { Request, Response } from 'express';
import logger from './common/logger';


//dummy service until whole routing is fixed
@Service() 
@JsonController()
export class CommonController {
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
            logger.error(`error: ${err}`);
            return res
            .status(500);
        }
    }
};
