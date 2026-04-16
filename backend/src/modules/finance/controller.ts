
import { Request, Response } from 'express';
import * as financeService from './service.js';
import { validateFinanceEntryPayload } from './validation.js';
import asyncHandler from '../../utils/asyncHandler.js';
import { ApiResponse } from '../../core/apiResponse.js';


// Get monthly revenue totals for the last 12 months
export const getMonthlyRevenue = asyncHandler(async (req: Request, res: Response) => {
  const now = new Date();
  const monthConfigs = Array.from({ length: 12 }, (_, idx) => {
    const i = 11 - idx;
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const start = new Date(d.getFullYear(), d.getMonth(), 1);
    const end = new Date(d.getFullYear(), d.getMonth() + 1, 1);
    return { start, end };
  });

  const totals = await Promise.all(
    monthConfigs.map(({ start, end }) => financeService.getRevenueTotalForRange(start, end))
  );

  const months = monthConfigs.map(({ start }, idx) => ({
    month: start.toLocaleString('default', { month: 'short' }).toUpperCase(),
    year: start.getFullYear(),
    total: totals[idx],
  }));

  return ApiResponse(res, 200, 'Monthly revenue fetched successfully', months);
});

export const getFinanceSummary = asyncHandler(async (req: Request, res: Response) => {
  const { month } = req.query;
  // month is expected as 'YYYY-MM' string
  const summary = await financeService.getFinanceSummary(typeof month === 'string' ? month : undefined);
  return ApiResponse(res, 200, 'Finance summary fetched successfully', summary);
});
export const getAllRevenues = asyncHandler(async (req: Request, res: Response) => {
  const revenues = await financeService.getAllRevenues();
  return ApiResponse(res, 200, 'All revenues fetched successfully', revenues);
});

export const getAllExpenses = asyncHandler(async (req: Request, res: Response) => {
  const expenses = await financeService.getAllExpenses();
  return ApiResponse(res, 200, 'All expenses fetched successfully', expenses);
});

export const addRevenue = asyncHandler(async (req: Request, res: Response) => {
  const validationError = validateFinanceEntryPayload(req.body);
  if (validationError) {
    return ApiResponse(res, 400, validationError);
  }

  const { date, name, amount } = req.body;
  const revenue = await financeService.addRevenue({ date, name, amount });
  return ApiResponse(res, 201, 'Revenue added successfully', revenue);
});

export const addExpense = asyncHandler(async (req: Request, res: Response) => {
  const validationError = validateFinanceEntryPayload(req.body);
  if (validationError) {
    return ApiResponse(res, 400, validationError);
  }

  const { date, name, amount } = req.body;
  const expense = await financeService.addExpense({ date, name, amount });
  return ApiResponse(res, 201, 'Expense added successfully', expense);
});
