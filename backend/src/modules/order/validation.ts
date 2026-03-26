import { Request, Response, NextFunction } from 'express';

// Valid statuses a rider can set during PICKUP task
const VALID_PICKUP_STATUSES = [
  'PICKUP_ENROUTE',
  'PICKED_UP',
] as const;

// Valid statuses a rider can set during DELIVERY task
const VALID_DELIVERY_STATUSES = [
  'DELIVERY_ENROUTE',
  'DELIVERED',
] as const;

// All statuses a rider is allowed to set combined
const ALL_VALID_RIDER_STATUSES = [
  ...VALID_PICKUP_STATUSES,
  ...VALID_DELIVERY_STATUSES,
] as const;

// ─────────────────────────────────────────
// Validator 1 — Update Order Status
// ─────────────────────────────────────────
export const validateUpdateStatus = (
  req: Request,
  res: Response,
  next: NextFunction
): Response | void => {
  const { status } = req.body as Record<string, unknown>;

  if (!status || typeof status !== 'string') {
    return res.status(400).json({
      success: false,
      message: 'Status is required',
    });
  }

  if (!ALL_VALID_RIDER_STATUSES.includes(status as any)) {
    return res.status(400).json({
      success: false,
      message: `Status must be one of: ${ALL_VALID_RIDER_STATUSES.join(', ')}`,
    });
  }

  next();
};

// ─────────────────────────────────────────
// Validator 2 — Update GPS Location
// ─────────────────────────────────────────
export const validateUpdateLocation = (
  req: Request,
  res: Response,
  next: NextFunction
): Response | void => {
  const { latitude, longitude } = req.body as Record<string, unknown>;

  if (latitude === undefined || latitude === null) {
    return res.status(400).json({
      success: false,
      message: 'Latitude is required',
    });
  }

  if (longitude === undefined || longitude === null) {
    return res.status(400).json({
      success: false,
      message: 'Longitude is required',
    });
  }

  if (typeof latitude !== 'number' || latitude < -90 || latitude > 90) {
    return res.status(400).json({
      success: false,
      message: 'Latitude must be a number between -90 and 90',
    });
  }

  if (typeof longitude !== 'number' || longitude < -180 || longitude > 180) {
    return res.status(400).json({
      success: false,
      message: 'Longitude must be a number between -180 and 180',
    });
  }

  next();
};