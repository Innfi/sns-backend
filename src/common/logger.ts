import winston from 'winston';
import { Service } from 'typedi';
import { CommonConfig } from './config';


@Service()
export class LoggerBase {
    protected logger: winston.Logger;

    constructor(protected config: CommonConfig) {
        this.init();
    }

    protected init(): void {
        this.logger = winston.createLogger({
            transports: [
                new winston.transports.Console({
                    format: winston.format.combine(
                        winston.format.colorize(),
                        winston.format.timestamp(),
                        winston.format.printf(info => 
                            `${info.timestamp} ${info.level}: ${info.message}`)
                    ),
                    level: 'info'
                }),
                new winston.transports.File({
                    filename: this.config.fileLogPath,
                    format: winston.format.combine(
                        winston.format.timestamp(),
                        winston.format.printf(info => 
                            `${info.timestamp} ${info.level}: ${info.message}`)
                    ),
                    level: 'warn'
                })
            ]
        });
    }

    public info(msg: any): void {
        this.logger.info(msg);
    }

    public debug(msg: any): void {
        this.logger.debug(msg);
    }

    public error(msg: any): void {
        this.logger.error(msg);
    }
}