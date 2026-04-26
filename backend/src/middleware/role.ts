import { Request, Response, NextFunction } from "express";
import ApiError from "../core/apiError.js";
import { Role, MESSAGES } from "../core/constants.js";

export const allowRoles =
  (...allowedRoles: Role[]) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user || !req.user.role) {
      return next(new ApiError(403, MESSAGES.UNAUTHORIZED));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(new ApiError(403, MESSAGES.FORBIDDEN));
    }

    next();
  };