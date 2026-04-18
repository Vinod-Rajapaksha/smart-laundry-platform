import { Request, Response } from 'express';
import * as service from './service.js';
import asyncHandler from '../../utils/asyncHandler.js';
import { ApiResponse } from '../../core/apiResponse.js';

export const getDashboardKPIs = asyncHandler(async (req: Request, res: Response) => {
  const data = await service.getDashboardKPIs();
  return ApiResponse(res, 200, 'Dashboard KPIs fetched successfully', data);
});

export const getMonthlyAnalysis = asyncHandler(async (req: Request, res: Response) => {
  const { year, month } = req.query;
  const data = await service.getMonthlyAnalysis(Number(year), Number(month));
  return ApiResponse(res, 200, 'Monthly analysis fetched successfully', data);
});

export const addRevenue = asyncHandler(async (req: Request, res: Response) => {
  const data = await service.addRevenue(req.body);
  return ApiResponse(res, 201, 'Revenue added successfully', data);
});

export const addExpense = asyncHandler(async (req: Request, res: Response) => {
  const data = await service.addExpense(req.body);
  return ApiResponse(res, 201, 'Expense added successfully', data);
});

export const previewReport = asyncHandler(async (req: Request, res: Response) => {
  const { periodFrom, periodTo, sections } = req.body;
  const data = await service.previewReport(new Date(periodFrom), new Date(periodTo), sections);
  return ApiResponse(res, 200, 'Report preview generated successfully', data);
});

export const saveReport = asyncHandler(async (req: Request, res: Response) => {
  const { periodFrom, periodTo, reportType } = req.body;
  const userId = (req as any).user.id;
  const data = await service.saveReport(new Date(periodFrom), new Date(periodTo), reportType, userId);
  return ApiResponse(res, 201, 'Report saved successfully', data);
});

export const getReports = asyncHandler(async (req: Request, res: Response) => {
  const data = await service.getReports();
  return ApiResponse(res, 200, 'Reports fetched successfully', data);
});

export const downloadReport = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  await service.downloadReport(id, res);
});
