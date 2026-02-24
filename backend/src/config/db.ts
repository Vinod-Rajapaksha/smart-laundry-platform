import mongoose from "mongoose";
import config from "./env.js";
import logger from "./logger.js";

mongoose.set("strictQuery", true);

export const connectDB = async (): Promise<void> => {
  try {
    if (!config.MONGO_URI) {
      throw new Error("MONGO_URI is missing in environment config");
    }

    if (mongoose.connection.readyState === 1) {
      logger.warn("MongoDB already connected");
      return;
    }

    await mongoose.connect(config.MONGO_URI);

    logger.info(`MongoDB Connected Successfully`);
  } catch (err) {
    logger.error("MongoDB Connection Failed");
    logger.error(err);
    process.exit(1);
  }
};

export const closeDB = async (): Promise<void> => {
  try {
    if (mongoose.connection.readyState === 0) {
      logger.warn("MongoDB is already disconnected");
      return;
    }

    await mongoose.connection.close();
    logger.info("MongoDB connection closed");
  } catch (err) {
    logger.error("Error while closing MongoDB connection");
    logger.error(err);
  }
};

export const registerDBShutdownHooks = (): void => {
  const shutdown = async (signal: string) => {
    logger.info(`${signal} received. Closing MongoDB connection...`);
    await closeDB();
    process.exit(0);
  };

  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));
};