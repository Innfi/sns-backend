import 'reflect-metadata';
import { Container, Service } from 'typedi';
import { useContainer, JsonController, Req, Res, Body, Get, Post, 
    UseBefore, Interceptor, UploadedFiles, UploadedFile, UploadOptions } from 'routing-controllers';
import { Request, Response } from 'express';
import multer from 'multer';

import { LoggerBase } from '../common/logger';
import { S3UploadService } from '../common/s3UploadService';
import { AuthMiddleware } from '../auth/middleware';
import { IUserTimeline, LoadTimelineOptions, UserTimelineInput } from './model';
import { TimelineService } from './service';


useContainer(Container);

// const s3Upload = Container.get(S3UploadService);

// const dummyUpload = () => ({
//     storage: multer.memoryStorage(),
//     limits: {  fieldNameSize: 255,
//         fileSize: 1024 * 1024 * 2 }
// });


@Service()
@JsonController('/timeline')
export class TimelineController {
    constructor(
        protected tmService: TimelineService,
        //protected s3Upload: S3UploadService,
        protected logger: LoggerBase
    ) {}

    @Get('/:userId')
    public async getUserTimeline(
        @Req() req: Request, 
        @Res() res: Response, 
        @Body() options: LoadTimelineOptions
    ): Promise<Response> {
        try {
            const userId: string = req.params.userId;
            this.logger.info(`TimelineController.getUserTimeline] ${userId}`);
            
            const timelines: IUserTimeline[] = 
                await this.tmService.loadUserTimeline(userId, options);

            return res.status(200).send({
                err: 'ok',
                timelines: timelines
            });
        } catch (err: any) {
            this.logger.error(`TimelineController.getUserTimeline] ${err}`);
            return res.status(500);
        }
    }

    @Post('/:userId')
    @UseBefore(AuthMiddleware)
    public async writeUserTimeline(
        @Req() req: Request, 
        @Res() res: Response,
        @Body() body: UserTimelineInput
    ): Promise<Response> { //FIXME: UserTimelineInput
        try {
            const userId: string = req.params.userId;

            const result = await this.tmService.writeUserTimeline(userId, body);
            if(!result) {
                return res.status(500).send({ err: 'write error', });
            }
            
            return res.status(200).send({
                err: 'ok', 
                newTimeline: result
            });
        } catch (err: any) {
            this.logger.error(`TimelineController.writeUserTimeline] ${err}`);
            return res.status(500);
        }
    }

    @Post('/media/:userId')
    @UseBefore(AuthMiddleware)
    public async writeUserTimelineMedia(
        @Req() req: Request, 
        @Res() res: Response, 
        @UploadedFile("filename", { 
            options: {
                storage: multer.memoryStorage(),
                limits: { fieldNameSize: 255, fileSize: 1024*1024*2 }
            } 
        }) file: any
    ): Promise<Response> {
        //@UploadedFiles("fileName", { options: s3Upload.getMulter }) files: any[]
        try {
            this.logger.info(`writeUserTimelineMedia] file req received`);

            return res.status(200).send({ err: 'ok' });
        } catch (err: any) {
            this.logger.error(`TimelineController.writeUserTimelineMedia] ${err}`);
            return res.status(500);
        }
    }
}