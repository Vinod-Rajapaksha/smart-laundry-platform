import { Response } from "express";

export const ApiResponse = <T>(
  res: Response,
  statusCode: number,
  message: string = "Success",
  data?: T
): Response => {
  return res.status(statusCode).json({
    success: statusCode < 400,
    message,
    data,
  });
};