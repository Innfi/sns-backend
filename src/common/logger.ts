import winston from 'winston';
import { logPath } from '../common/config';


const logger = winston.createLogger({
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.timestamp(),
                winston.format.printf(info => 
                    `${info.timestamp} ${info.level}: ${info.message}`)
            ),
            level: 'debug'
        }),
        new winston.transports.File({
            filename: logPath,
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.printf(info => 
                    `${info.timestamp} ${info.level}: ${info.message}`)
            ),
            level: 'warn'
        })
    ]
});

export default logger;