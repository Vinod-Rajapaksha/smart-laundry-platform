import { Request, Response, NextFunction } from "express";
import { z, ZodObject, ZodError, ZodIssue } from "zod";
import ApiError from "../core/apiError.js";

type AnyZodObject = ZodObject<any, any>;

export const validateRequest = (schema: AnyZodObject) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      const validated = await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      
      req.body = validated.body;
      
      Object.keys(req.params).forEach(key => delete req.params[key]);
      Object.assign(req.params, validated.params);
      
      Object.keys(req.query).forEach(key => delete req.query[key]);
      Object.assign(req.query, validated.query);

      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        const message = error.issues.map((e: ZodIssue) => e.message).join(", ");
        return next(new ApiError(400, message));
      }
      return next(error);
    }
  };
};

export const validateBody = (schema: AnyZodObject) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      req.body = await schema.parseAsync(req.body);
      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        const message = error.issues.map((e: ZodIssue) => e.message).join(", ");
        return next(new ApiError(400, message));
      }
      return next(error);
    }
  };
};

export const validateParams = (schema: AnyZodObject) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      const validated = await schema.parseAsync(req.params);
      Object.keys(req.params).forEach(key => delete req.params[key]);
      Object.assign(req.params, validated);
      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        const message = error.issues.map((e: ZodIssue) => e.message).join(", ");
        return next(new ApiError(400, message));
      }
      return next(error);
    }
  };
};

export const validateQuery = (schema: AnyZodObject) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      const validated = await schema.parseAsync(req.query);
      Object.keys(req.query).forEach(key => delete req.query[key]);
      Object.assign(req.query, validated);
      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        const message = error.issues.map((e: ZodIssue) => e.message).join(", ");
        return next(new ApiError(400, message));
      }
      return next(error);
    }
  };
};

export const validate = (schema: any) => validateRequest(z.object(schema));
