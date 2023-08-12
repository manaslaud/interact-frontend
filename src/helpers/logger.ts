import * as winston from 'winston';

const formatConfig = winston.format.combine(
  winston.format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss',
  }),
  winston.format.simple(),
  winston.format.json(),
  winston.format.prettyPrint(),
  winston.format.errors({ stack: true })
);

const logger = winston.createLogger({
  transports: [
    new winston.transports.File({
      filename: `logs/info.log`,
      level: 'info',
      format: formatConfig,
    }),
  ],
});

export default logger;
