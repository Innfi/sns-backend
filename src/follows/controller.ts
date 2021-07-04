import 'reflect-metadata';
import { Container, Service } from 'typedi';
import { useContainer, JsonController, Req, Res, Body, Get, Post, UseBefore } from 'routing-controllers';
import { Request, Response } from 'express';


import { LoggerBase } from '../common/logger';
import { AuthMiddleware } from '../auth/middleware';
import { FollowsParams, LoadFollowOptions, RelateResult } from './model';
import { UserProfilePayload } from '../auth/model';
import { FollowsService } from './service';


useContainer(Container)

@Service()
@JsonController()
export class FollowsController {
    constructor(
        protected followsService: FollowsService,
        protected logger: LoggerBase
    ) {}

    @Post('/followuser/:userId')
    @UseBefore(AuthMiddleware)
    public async followUser(@Req() req: Request, @Res() res: Response, 
        @Body() followParams: FollowsParams) {
        try {
            const userId: string = req.params.userId;
            this.logger.info(`FollowsController.followUser] ${userId}`);

            const response: RelateResult | null = 
                await this.followsService.relate(followParams.userIdToFollow, userId);
            if(response === null) return res.status(500).send({ err: 'server error'}).end();

            return res.status(200).send(response).end();
        } catch (err: any) {
            this.logger.error(`FollowsController.followUser] ${err}`);
            return res.status(500).end();
        }
    }

    @Get('/follows/:userId')
    public async loadFollows(@Req() req: Request, @Res() res: Response, 
        @Body() options: LoadFollowOptions) {
        try {
            const userId: string = req.params.userId;
            this.logger.info(`FollowsController.follows] ${userId}`);  

            const response: UserProfilePayload[] | undefined = 
                await this.followsService.loadFollows(userId, options);
            if(!response) return res.status(500).send({ err: 'server error'}).end();

            return res.status(200).send(response).end();
        } catch (err: any) {
            this.logger.error(`FollowsController.follows] ${err}`);
            return res.status(500).end();
        }
    }

    @Get('/followers/:userId')
    public async loadFollowers(@Req() req: Request, @Res() res: Response, 
        @Body() options: LoadFollowOptions) {
        try {
            const userId: string = req.params.userId;
            this.logger.info(`FollowsContainer.followers] ${userId}`);

            const response: UserProfilePayload[] | undefined = 
                await this.followsService.loadFollowers(userId, options);
            if(!response) return res.status(500).send({ err: 'server error' }).end();

            return res.status(200).send(response).end();
        } catch (err: any) {
            this.logger.error(`FollowsContainer.followers] $[err]`);
            return res.status(500).end();
        }     
    }
}