import { Response } from 'express';
import { ApiResponse } from '../../core/apiResponse.js';
import { AuthRequest } from '../../types/auth.js';
import asyncHandler from '../../utils/asyncHandler.js';
import * as supplierService from './service.js';

export const createSupplier = asyncHandler(async (req: AuthRequest, res: Response) => {
  const supplier = await supplierService.createSupplier(req.body);
  return ApiResponse(res, 201, 'Supplier created successfully', supplier);
});

export const getSuppliers = asyncHandler(async (req: AuthRequest, res: Response) => {
  const result = await supplierService.getSuppliers(req.query);
  return ApiResponse(res, 200, 'Suppliers retrieved successfully', result);
});

export const getSupplierById = asyncHandler(async (req: AuthRequest, res: Response) => {
  const supplier = await supplierService.getSupplierById(req.params.id as string);
  return ApiResponse(res, 200, 'Supplier retrieved successfully', supplier);
});

export const updateSupplier = asyncHandler(async (req: AuthRequest, res: Response) => {
  const supplier = await supplierService.updateSupplier(req.params.id as string, req.body);
  return ApiResponse(res, 200, 'Supplier updated successfully', supplier);
});

export const deleteSupplier = asyncHandler(async (req: AuthRequest, res: Response) => {
  await supplierService.deleteSupplier(req.params.id as string);
  return ApiResponse(res, 200, 'Supplier deleted successfully');
});

export const getSupplierStats = asyncHandler(async (_req: AuthRequest, res: Response) => {
  const stats = await supplierService.getSupplierStats();
  return ApiResponse(res, 200, 'Supplier stats retrieved successfully', stats);
});
