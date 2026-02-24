import { Request, Response, NextFunction } from "express";
import ApiError from "../core/apiError.js";
import { ApiResponse } from "../core/apiResponse.js";
import logger from "../config/logger.js";

const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): Response => {
  logger.error(err);

  if (err instanceof ApiError) {
    return ApiResponse<null>(res, err.statusCode, err.message, null);
  }

  return ApiResponse<null>(res, 500, "Internal Server Error", null);
};

export default errorHandler;