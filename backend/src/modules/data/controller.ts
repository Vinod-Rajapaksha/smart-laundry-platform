import { Request, Response } from "express";
import { ApiResponse } from "../../core/apiResponse.js";
import { getDashboardStats, getDashboardUsers } from "./service.js";


export const getDashboardData = async (_req: Request, res: Response) => {
	try {
		const stats = await getDashboardStats();
		return ApiResponse(res, 200, "Dashboard data fetched successfully", stats);
	} catch (error) {
		return ApiResponse(res, 500, "Failed to fetch dashboard data");
	}
};

export const getDashboardUsersController = async (
	req: Request,
	res: Response
) => {
	try {
		const page = req.query.page ? parseInt(req.query.page as string, 10) : undefined;
		const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : undefined;
		const search = (req.query.search as string) || undefined;
		const role = (req.query.role as string) || undefined;

		const result = await getDashboardUsers({ page, limit, search, role });

		return ApiResponse(res, 200, "Dashboard users fetched successfully", result);
	} catch (error) {
		return ApiResponse(res, 500, "Failed to fetch dashboard users");
	}
};
