import { Request, Response } from 'express';
import * as service from './service.js';
import asyncHandler from '../../utils/asyncHandler.js';
import { ApiResponse } from '../../core/apiResponse.js';

export const createService = asyncHandler(async (req: Request, res: Response) => {
  const result = await service.createService(req.body);
  return ApiResponse(res, 201, 'Service created successfully', result);
});

export const updateService = asyncHandler(async (req: Request, res: Response) => {
  const result = await service.updateService(req.params.id as string, req.body);
  return ApiResponse(res, 200, 'Service updated successfully', result);
});

export const deleteService = asyncHandler(async (req: Request, res: Response) => {
  await service.deleteService(req.params.id as string);
  return ApiResponse(res, 200, 'Service deleted successfully');
});

export const getServiceById = asyncHandler(async (req: Request, res: Response) => {
  const result = await service.getServiceById(req.params.id as string);
  return ApiResponse(res, 200, 'Service fetched successfully', result);
});

export const getAllServices = asyncHandler(async (req: Request, res: Response) => {
  const result = await service.getAllServices(req.query);
  return ApiResponse(res, 200, 'All services fetched successfully', result);
});

export const getServicesByCategory = asyncHandler(async (req: Request, res: Response) => {
  const result = await service.getServicesByCategory(req.params.categoryId as string);
  return ApiResponse(res, 200, `Services for category ${req.params.categoryId} fetched successfully`, result);
});
