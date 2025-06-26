import winston from 'winston';

const logger = winston.createLogger({
  level: 'info', // puede ser 'debug', 'warn', 'error', etc.
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json() // o simple(), printf(), etc.
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

export default logger;
