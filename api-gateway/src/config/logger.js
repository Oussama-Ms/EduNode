import winston from 'winston';

/**
 * Winston Logger Configuration
 * 
 * WHY: Console.log is synchronous and doesn't provide structured data.
 * Winston is a versatile logging library that allows us to log to multiple
 * transports (e.g., console, files, third-party services) with timestamps,
 * log levels, and custom formats. This is crucial for production monitoring.
 */

const { combine, timestamp, printf, colorize } = winston.format;

// Custom log format
const customFormat = printf(({ level, message, timestamp, ...meta }) => {
  return `[${timestamp}] ${level}: ${message} ${Object.keys(meta).length ? JSON.stringify(meta) : ''}`;
});

const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    customFormat
  ),
  transports: [
    // Write all logs with level 'error' and below to `error.log`
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    // Write all logs with level 'info' and below to `combined.log`
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
});

// If we're not in production, log to the `console` with colors
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: combine(
      colorize(),
      timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      customFormat
    )
  }));
}

export default logger;
