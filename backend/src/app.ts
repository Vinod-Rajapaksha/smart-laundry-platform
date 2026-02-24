import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import morgan from "morgan";
import routes from "./routes/index.js";
import errorHandler from "./middleware/error.js";
import requestLogger from "./middleware/requestLogger.js";
import ApiError from "./core/apiError.js";
import { ApiResponse } from "./core/apiResponse.js";
import config from "./config/env.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(requestLogger);

if (config.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Health check
app.get("/health", (_req: Request, res: Response) => {
  res.set("Cache-Control", "no-store");
  return ApiResponse(res, 200, "OK", { status: "ok" });
});

// Register Routes
app.use("/api", routes);

// 404 Handler
app.use((_req: Request, _res: Response, next: NextFunction) => {
  next(new ApiError(404, "Route not found"));
});

// Global Error Handler
app.use(errorHandler);

export default app;