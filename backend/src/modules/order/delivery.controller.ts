import { Request, Response } from 'express';
import * as service from './delivery.service.js';
import asyncHandler from '../../utils/asyncHandler.js';
import { ApiResponse } from '../../core/apiResponse.js';

export const getJobs = asyncHandler(async (req: Request, res: Response) => {
  const result = await service.getDeliveryJobs(req.query);
  return ApiResponse(res, 200, 'Logistics jobs fetched', result);
});

export const updateStatus = asyncHandler(async (req: Request, res: Response) => {
  const result = await service.updateJobStatus(req.params.id, req.body.status);
  return ApiResponse(res, 200, 'Job status updated', result);
});
