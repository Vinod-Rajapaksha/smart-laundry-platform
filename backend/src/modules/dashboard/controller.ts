import { Request, Response } from "express";

import { ApiResponse } from "../../core/apiResponse.js";
import { getDashboardStats, getDashboardUsers } from "./service.js";
import asyncHandler from "../../utils/asyncHandler.js";


export const getDashboardData = asyncHandler(async (_req: Request, res: Response) => {
	const stats = await getDashboardStats();
	return ApiResponse(res, 200, "Dashboard data fetched successfully", stats);
});


export const getDashboardUsersController = asyncHandler(async (
	req: Request,
	res: Response
) => {
	const page = req.query.page ? parseInt(req.query.page as string, 10) : undefined;
	const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : undefined;
	const search = (req.query.search as string) || undefined;
	const role = (req.query.role as string) || undefined;

	const result = await getDashboardUsers({ page, limit, search, role });
	return ApiResponse(res, 200, "Dashboard users fetched successfully", result);
});
