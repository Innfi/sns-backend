import winston from 'winston';
import { Service } from 'typedi';
import { fileLogPath } from './config';

@Service()
class LoggerBase {
  protected logger: winston.Logger;

  constructor() {
    this.init();
  }

  protected init() {
    this.logger = winston.createLogger({
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.timestamp(),
            winston.format.printf(
              (info) => `${info.timestamp} ${info.level}: ${info.message}`,
            ),
          ),
          level: 'info',
        }),
        new winston.transports.File({
          filename: fileLogPath,
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.printf(
              (info) => `${info.timestamp} ${info.level}: ${info.message}`,
            ),
          ),
          level: 'warn',
        }),
      ],
    });
  }

  info(msg: any) {
    this.logger.info(msg);
  }

  debug(msg: any) {
    this.logger.debug(msg);
  }

  error(msg: any) {
    this.logger.error(msg);
  }
}

export default LoggerBase;
