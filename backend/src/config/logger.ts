import winston from "winston";
import config from "./env.js";

const isProduction = config.NODE_ENV === "production";

const logger = winston.createLogger({
  level: config.LOG_LEVEL,
  format: isProduction
    ? winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json()
      )
    : winston.format.combine(
        winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        winston.format.colorize(),
        winston.format.errors({ stack: true }),
        winston.format.printf(({ timestamp, level, message, stack }) => {
          return stack
            ? `[${timestamp}] ${level}: ${stack}`
            : `[${timestamp}] ${level}: ${message}`;
        })
      ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: "logs/error.log",
      level: "error",
    }),
    new winston.transports.File({
      filename: "logs/combined.log",
    }),
  ],
  exitOnError: false,
});

export default logger;