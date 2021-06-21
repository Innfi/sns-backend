import 'reflect-metadata';
import { Container, Service } from 'typedi';
import { useContainer, JsonController, Req, Res, Body, QueryParams, Get, Post } from 'routing-controllers';
import { Request, Response } from 'express';

import { IUserTimeline, LoadTimelineOptions, UserTimelineInput } from './model';
import { TimelineRepository } from './repository';
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
    public async getUserTimeline(@Req() req: Request, @Res() res: Response, 
        @QueryParams() options: LoadTimelineOptions) {
        try {
            const userId: string = req.params.userId;
            this.logger.info(`TimelineController.getUserTimeline] ${userId}`);
            
            const timelines: IUserTimeline[] = 
                await this.tmRepo.loadUserTimeline(userId, options);

            return res.status(200).send({
                err: 'ok',
                timelines: timelines
            }).end();
        } catch (err: any) {
            this.logger.error(`TimelineController.getUserTimeline] ${err}`);
            return res.status(500).end();
        }
    }

    @Post('/:userId')
    public async writeUserTimeline(@Req() req: Request, @Res() res: Response,
        @Body() body: UserTimelineInput) { //FIXME: UserTimelineInput
        try {
            const userId: string = req.params.userId;
            this.logger.info(`TimelineController.writeUserTimeline] ${userId}`);

            const result = await this.tmRepo.writeUserTimeline(
                userId, { authorId: userId, text: body.text});
            
            return res.status(200).send({
                err: 'ok', 
                newTimeline: result
            }).end();
        } catch (err: any) {
            this.logger.error(`TimelineController.writeUserTimeline] ${err}`);
            return res.status(500).end();
        }
    }
}