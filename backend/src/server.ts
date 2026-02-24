import http from "http";
import app from "./app.js";
import config from "./config/env.js";
import { connectDB, closeDB } from "./config/db.js";
import logger from "./config/logger.js";

let server: http.Server | undefined;
let isShuttingDown = false;

const startServer = async (): Promise<void> => {
  try {
    // Connect DB
    await connectDB();

    // Create server
    server = http.createServer(app);

    // Start server
    server.listen(config.PORT, "0.0.0.0", () => {
      logger.info(
        `Server running on port ${config.PORT} in ${config.NODE_ENV} mode`
      );
    });
  } catch (error) {
    logger.error("Failed to start server");
    logger.error(error);
    process.exit(1);
  }
};

startServer();

// Graceful Shutdown
const shutdown = async (
  reason: string,
  error?: unknown,
  exitCode: number = 0
): Promise<void> => {
  if (isShuttingDown) return;
  isShuttingDown = true;

  logger.error(`${reason} - Shutting down...`);
  if (error) logger.error(error);

  try {
    await closeDB();
    logger.info("MongoDB connection closed");
  } catch (dbError) {
    logger.error("Failed to close MongoDB connection");
    logger.error(dbError);
  }

  if (server) {
    server.close(() => {
      logger.info("HTTP server closed");
      process.exit(exitCode);
    });

    // Safety timeout
    setTimeout(() => {
      logger.error("Force shutdown after timeout");
      process.exit(exitCode);
    }, 10000).unref();
  } else {
    process.exit(exitCode);
  }
};

// Process-level error handlers
process.on("unhandledRejection", (err) => {
  shutdown("UNHANDLED REJECTION", err, 1);
});

process.on("uncaughtException", (err) => {
  shutdown("UNCAUGHT EXCEPTION", err, 1);
});

// Signals
process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));