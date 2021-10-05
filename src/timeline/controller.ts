import 'reflect-metadata';
import { Container, Service } from 'typedi';
import { useContainer, JsonController, Req, Res, Body, Get, Post, 
    UseBefore, Interceptor, UploadedFiles } from 'routing-controllers';
import { Request, Response } from 'express';

import { LoggerBase } from '../common/logger';
import { S3UploadService } from '../common/s3UploadService';
import { AuthMiddleware } from '../auth/middleware';
import { IUserTimeline, LoadTimelineOptions, UserTimelineInput } from './model';
import { TimelineService } from './service';


useContainer(Container);

const s3Upload = Container.get(S3UploadService);

@Service()
@JsonController('/timeline')
export class TimelineController {
    constructor(
        protected tmService: TimelineService,
        //protected s3Upload: S3UploadService,
        protected logger: LoggerBase
    ) {}

    @Get('/:userId')
    public async getUserTimeline(@Req() req: Request, @Res() res: Response, 
        @Body() options: LoadTimelineOptions) {
        try {
            const userId: string = req.params.userId;
            this.logger.info(`TimelineController.getUserTimeline] ${userId}`);
            
            const timelines: IUserTimeline[] = 
                await this.tmService.loadUserTimeline(userId, options);

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
    @UseBefore(AuthMiddleware)
    public async writeUserTimeline(@Req() req: Request, @Res() res: Response,
        @Body() body: UserTimelineInput) { //FIXME: UserTimelineInput
        try {
            const userId: string = req.params.userId;
            this.logger.info(`TimelineController.writeUserTimeline] ${userId}`);

            const result = await this.tmService.writeUserTimeline(
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

    @Post('/media/:userId')
    @UseBefore(AuthMiddleware)
    public async writeUserTimelineMedia(
        @Req() req: Request, 
        @Res() res: Response, 
        @UploadedFiles("fileName", { options: s3Upload.getMulter }) files: File[]
    ) {
        try {
            return res.status(200).send({ err: 'ok' }).end();
        } catch (err: any) {
            this.logger.error(`TimelineController.writeUserTimelineMedia] ${err}`);
            return res.status(500).end();
        }
    }
}