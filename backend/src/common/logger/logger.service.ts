import { Injectable, LoggerService as NestLoggerService } from '@nestjs/common';
import * as winston from 'winston';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class LoggerService implements NestLoggerService {
  private logger: winston.Logger;

  constructor(private configService: ConfigService) {
    const nodeEnv = this.configService.get('NODE_ENV', 'development');
    const isProduction = nodeEnv === 'production';

    // Define log format
    const logFormat = winston.format.combine(
      winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      winston.format.errors({ stack: true }),
      winston.format.splat(),
      isProduction
        ? winston.format.json() // JSON format for production (easier to parse)
        : winston.format.combine(
            winston.format.colorize(),
            winston.format.printf(({ timestamp, level, message, context, trace, ...meta }) => {
              const metaStr = Object.keys(meta).length ? JSON.stringify(meta) : '';
              const contextStr = context ? `[${context}]` : '';
              const traceStr = trace ? `\n${trace}` : '';
              return `${timestamp} ${level} ${contextStr} ${message} ${metaStr}${traceStr}`;
            }),
          ),
    );

    // Define log transports
    const transports: winston.transport[] = [
      // Console transport (always enabled)
      new winston.transports.Console({
        level: isProduction ? 'info' : 'debug',
      }),
    ];

    // Add file transports in production
    if (isProduction) {
      transports.push(
        new winston.transports.File({
          filename: 'logs/error.log',
          level: 'error',
          maxsize: 5242880, // 5MB
          maxFiles: 5,
        }),
        new winston.transports.File({
          filename: 'logs/combined.log',
          maxsize: 5242880, // 5MB
          maxFiles: 5,
        }),
      );
    }

    // Create logger instance
    this.logger = winston.createLogger({
      level: isProduction ? 'info' : 'debug',
      format: logFormat,
      transports,
      exitOnError: false,
    });
  }

  log(message: string, context?: string) {
    this.logger.info(message, { context });
  }

  error(message: string, trace?: string, context?: string) {
    this.logger.error(message, { trace, context });
  }

  warn(message: string, context?: string) {
    this.logger.warn(message, { context });
  }

  debug(message: string, context?: string) {
    this.logger.debug(message, { context });
  }

  verbose(message: string, context?: string) {
    this.logger.verbose(message, { context });
  }

  // Additional helper methods for structured logging
  http(message: string, meta?: Record<string, any>) {
    this.logger.http(message, meta);
  }

  info(message: string, meta?: Record<string, any>) {
    this.logger.info(message, meta);
  }

  // Log with metadata
  logWithMeta(level: string, message: string, meta: Record<string, any>) {
    this.logger.log(level, message, meta);
  }
}
