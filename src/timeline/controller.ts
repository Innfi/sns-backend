import 'reflect-metadata';
import { Container, Service } from 'typedi';
import { useContainer, JsonController, Req, Res, Body, QueryParams, Get, Post } from 'routing-controllers';
import { Request, Response } from 'express';

import { IUserTimeline } from './model';
import { TimelineRepository, TimelineRepositoryFactory } from './repository';
import { LoggerBase } from '../common/logger';


useContainer(Container);

@Service()
@JsonController('/timeline')
export class TimelineController {
    constructor(
        protected tmRepo: TimelineRepository,
        protected logger: LoggerBase
    ) {}

    @Get('/:userId')
    public async getUserTimeline(@Req() req: Request, @Res() res: Response) {

    }

    @Post('/:userId')
    public async writeUserTimeline(@Req() req: Request, @Res() res: Response) {

    }
}