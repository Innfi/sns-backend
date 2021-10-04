import { Service } from 'typedi';
import multer from 'multer';
import multerS3 from 'multer-s3';
import AWS from 'aws-sdk';
import { Request } from 'express';
import dotenv from 'dotenv';


dotenv.config();

@Service()
export class S3UploadService {
    public akid: string;
    public secretKey: string;
    public bucketName: string;
    public folder: string;
    protected storageEngine: multer.StorageEngine;
    protected multer: multer.Multer;

    public constructor() {
        this.initAws();
        this.initMulter();
    }

    protected initAws(): void {
        AWS.config.update({
            region: 'ap-northeast-2',
            credentials: new AWS.Credentials({
                accessKeyId: this.akid,
                secretAccessKey: this.secretKey
            })
        });
    }

    protected initMulter(): void {
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
    }

    protected keyFunction(req: Request, file: Express.Multer.File, 
        callback: (err: any, key?: string | undefined) => void ): void {

        callback(null, `${this.folder}/${file.filename}`);
    };

    public getMulter(): multer.Multer {
        return this.multer;
    }
};