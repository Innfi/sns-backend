import { Service } from 'typedi';
import { Request } from 'express';
import AWS from 'aws-sdk';
import multer from 'multer';
import multerS3 from 'multer-s3';
import dotenv from 'dotenv';

import { LoggerBase } from './logger';


dotenv.config();

@Service()
export class S3UploadService {
    public akid: string;
    public secretKey: string;
    public bucketName: string;
    public folder: string;
    protected storageEngine: multer.StorageEngine;
    //protected multer: multer.Multer;

    public constructor(protected logger: LoggerBase) {
        this.initAws();
        this.initMulter();
    }

    protected initAws(): void {
        this.logger.info('S3UploadService.initAws] ');
        this.akid = process.env.AKID as string;
        this.secretKey = process.env.SECRET as string;
        this.bucketName = process.env.BUCKET as string;
        this.folder = 'image';

        AWS.config.update({
            region: 'ap-northeast-2',
            credentials: new AWS.Credentials({
                accessKeyId: this.akid,
                secretAccessKey: this.secretKey
            })
        });
    }

    protected initMulter(): void {
        this.logger.info('S3UploadService.initMulter] ');
        this.storageEngine = multerS3({
            s3: new AWS.S3({
                apiVersion: '2006-03-01',
                params: { Bucket: this.bucketName }
            }),
            bucket: this.bucketName,
            contentType: multerS3.AUTO_CONTENT_TYPE,
            acl: 'public-read-write',
            key: this.keyFunction
        });

        // this.multer = multer({
        //     storage: this.storageEngine,
        //     limits: { 
        //         fieldNameSize: 255,
        //         fileSize: 1024*1024*5 
        //     }
        // });
    }

    protected keyFunction(req: Request, file: Express.Multer.File, 
        callback: (err: any, key?: string | undefined) => void ): void {

        callback(null, `${this.folder}/${file.filename}`);
    };

    public getMulter(): multer.Multer {
        //return this.multer;
        return multer({
            storage: this.storageEngine,
            limits: { 
                fieldNameSize: 255,
                fileSize: 1024*1024*5 
            }
        });
    }
};