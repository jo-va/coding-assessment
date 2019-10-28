import winston from 'winston';
import config from '../config';

const silent = config.environment === 'test';

const Logger = winston.createLogger({
  level: config.logLevel,
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error', silent }),
    new winston.transports.File({ filename: 'combined.log', silent }),
  ],
});

if (config.environment !== 'production') {
  Logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.errors({ stack: true }),
        winston.format.splat(),
        winston.format.cli()
      ),
      silent,
    })
  );
}

export default Logger;
