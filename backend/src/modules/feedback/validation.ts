import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import ApiError from '../../core/apiError.js';
import { FEEDBACK_STATUS, FEEDBACK_TAGS } from '../../core/constants.js';

export const validateCreateFeedback = (
  req: Request,
  _res: Response,
  next: NextFunction,
): void => {
  const { orderId, rating, comment, suggestions, tags } = req.body;

  if (!orderId) {
    return next(new ApiError(422, 'Order ID is required'));
  }
  if (!mongoose.isValidObjectId(orderId)) {
    return next(new ApiError(422, 'Invalid order ID'));
  }

  if (rating === undefined || rating === null) {
    return next(new ApiError(422, 'Rating is required'));
  }
  const parsedRating = Number(rating);
  if (!Number.isInteger(parsedRating) || parsedRating < 1 || parsedRating > 5) {
    return next(new ApiError(422, 'Rating must be an integer between 1 and 5'));
  }

  if (comment !== undefined && comment !== null) {
    if (typeof comment !== 'string') {
      return next(new ApiError(422, 'Comment must be a string'));
    }
    if (comment.trim().length > 1000) {
      return next(new ApiError(422, 'Comment must not exceed 1000 characters'));
    }
  }

  if (suggestions !== undefined && suggestions !== null) {
    if (typeof suggestions !== 'string') {
      return next(new ApiError(422, 'Suggestions must be a string'));
    }
    if (suggestions.trim().length > 1000) {
      return next(new ApiError(422, 'Suggestions must not exceed 1000 characters'));
    }
  }

  if (tags !== undefined) {
    if (!Array.isArray(tags)) {
      return next(new ApiError(422, 'Tags must be an array'));
    }
    const validTags = Object.values(FEEDBACK_TAGS);
    const invalid = tags.filter((t: unknown) => !validTags.includes(t as string));
    if (invalid.length > 0) {
      return next(
        new ApiError(422, `Invalid tags: ${invalid.join(', ')}. Allowed: ${validTags.join(', ')}`),
      );
    }
 }
 next();
};

export const validateUpdateMyFeedback = (
  req: Request,
  _res: Response,
  next: NextFunction,
): void => {
  const { id } = req.params;
  const { rating, comment, suggestions, tags } = req.body;

  if (!mongoose.isValidObjectId(id)) {
    return next(new ApiError(422, 'Invalid feedback ID'));
  }
  const hasAnyField =
    rating !== undefined ||
    comment !== undefined ||
    suggestions !== undefined ||
    tags !== undefined;

  if (!hasAnyField) {
    return next(
      new ApiError(
        422,
        'At least one of rating, comment, suggestions, or tags must be provided',
      ),
    );
  }

  if (rating !== undefined) {
    const parsedRating = Number(rating);
    if (!Number.isInteger(parsedRating) || parsedRating < 1 || parsedRating > 5) {
      return next(new ApiError(422, 'Rating must be an integer between 1 and 5'));
    }
  }

  if (comment !== undefined && comment !== null) {
    if (typeof comment !== 'string') {
      return next(new ApiError(422, 'Comment must be a string'));
    }
    if (comment.trim().length > 1000) {
      return next(new ApiError(422, 'Comment must not exceed 1000 characters'));
    }
  }

  if (suggestions !== undefined && suggestions !== null) {
    if (typeof suggestions !== 'string') {
      return next(new ApiError(422, 'Suggestions must be a string'));
    }
    if (suggestions.trim().length > 1000) {
      return next(new ApiError(422, 'Suggestions must not exceed 1000 characters'));
    }
  }

  if (tags !== undefined) {
    if (!Array.isArray(tags)) {
      return next(new ApiError(422, 'Tags must be an array'));
    }

    const validTags = Object.values(FEEDBACK_TAGS);
    const invalid = tags.filter((t: unknown) => !validTags.includes(t as string));

    if (invalid.length > 0) {
      return next(
        new ApiError(
          422,
          `Invalid tags: ${invalid.join(', ')}. Allowed: ${validTags.join(', ')}`,
        ),
      );
    }

    const uniqueTags = [...new Set(tags)];
    if (uniqueTags.length !== tags.length) {
      return next(new ApiError(422, 'Duplicate tags are not allowed'));
    }
  }

  next();
};

export const validateDeleteMyFeedback = (
  req: Request,
  _res: Response,
  next: NextFunction,
): void => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    return next(new ApiError(422, 'Invalid feedback ID'));
  }

  next();
};

export const validateUpdateStatus = (
  req: Request,
  _res: Response,
  next: NextFunction,
): void => {
  const { id } = req.params;
  const { status } = req.body;

  if (!mongoose.isValidObjectId(id)) {
    return next(new ApiError(422, 'Invalid feedback ID'));
  }

  if (!status) {
    return next(new ApiError(422, 'Status is required'));
  }
  const validStatuses = Object.values(FEEDBACK_STATUS) as string[];
  if (!validStatuses.includes(status)) {
    return next(
      new ApiError(422, `Status must be one of: ${validStatuses.join(', ')}`),
    );
  }

  next();
};

export const validateFeedbackId = (
  req: Request,
  _res: Response,
  next: NextFunction,
): void => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return next(new ApiError(422, 'Invalid feedback ID'));
  }

  next();
};

export const validateGetFeedbacks = (
  req: Request,
  _res: Response,
  next: NextFunction,
): void => {
  const { page, limit, status, rating, startDate, endDate } = req.query;

  if (page !== undefined) {
    const p = Number(page);
    if (!Number.isInteger(p) || p < 1) {
      return next(new ApiError(422, 'Page must be a positive integer'));
    }
  }

  if (limit !== undefined) {
    const l = Number(limit);
    if (!Number.isInteger(l) || l < 1 || l > 100) {
      return next(new ApiError(422, 'Limit must be between 1 and 100'));
    }
  }

  if (status !== undefined) {
    const validStatuses = Object.values(FEEDBACK_STATUS) as string[];
    if (!validStatuses.includes(status as string)) {
      return next(
        new ApiError(422, `Status must be one of: ${validStatuses.join(', ')}`),
      );
    }
  }

  if (rating !== undefined) {
    const r = Number(rating);
    if (!Number.isInteger(r) || r < 1 || r > 5) {
      return next(new ApiError(422, 'Rating must be between 1 and 5'));
    }
  }

  if (startDate !== undefined && isNaN(Date.parse(startDate as string))) {
    return next(new ApiError(422, 'startDate must be a valid date'));
  }

  if (endDate !== undefined && isNaN(Date.parse(endDate as string))) {
    return next(new ApiError(422, 'endDate must be a valid date'));
  }

  next();
};