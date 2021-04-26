import winston from 'winston';

//process.env.npm_package_config_port
const logger = winston.createLogger({
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
            filename: './log/backend.log',
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