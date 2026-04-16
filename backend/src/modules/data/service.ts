

import Order from "../../database/models/Order.js";
import User from "../../database/models/User.js";
import RevenueModel from '../../database/models/Revenue.js';

export interface DashboardStats {
	totalOrders: number;
	totalCustomers: number;
	pendingOrders: number;
	monthlyRevenue: number[]; // Array of revenue per month (Jan-Dec)
}


export const getDashboardStats = async () => {
	const [totalOrders, totalCustomers, pendingOrders, monthlyRevenueAgg] = await Promise.all([
		Order.countDocuments(),
		User.countDocuments({ role: "CUSTOMER" }),
		Order.countDocuments({
			status: { $in: ["PICKUP_ENROUTE", "PICKED_UP"] },
		}),
		// Aggregate revenue by month for the current year
		RevenueModel.aggregate([
			{
				$match: {
					date: {
						$gte: new Date(new Date().getFullYear(), 0, 1),
						$lt: new Date(new Date().getFullYear() + 1, 0, 1),
					},
					type: 'revenue',
				},
			},
			{
				$group: {
					_id: { month: { $month: "$date" } },
					total: { $sum: "$amount" },
				},
			},
			{ $sort: { "_id.month": 1 } },
		]),
	]);

	// Map aggregation result to an array of 12 months (Jan-Dec)
	const monthlyRevenue: number[] = Array(12).fill(0);
	monthlyRevenueAgg.forEach((item: any) => {
		monthlyRevenue[item._id.month - 1] = item.total;
	});

	return {
		totalOrders,
		totalCustomers,
		pendingOrders,
		monthlyRevenue,
	};
};
	

interface DashboardUserListQuery {
	page?: number;
	limit?: number;
	search?: string;
	role?: string;
}

export interface DashboardUser {
	_id: string;
	name: string;
	email: string;
	telephone: string;
	role: string;
	isActive: boolean;
	createdAt?: Date;
}

export interface DashboardUserListResult {
	data: DashboardUser[];
	pagination: {
		page: number;
		limit: number;
		total: number;
		pages: number;
	};
}

export const getDashboardUsers = async (
	query: DashboardUserListQuery
): Promise<DashboardUserListResult> => {
	const page = Math.max(1, query.page || 1);
	const limit = Math.min(50, query.limit || 8);
	const skip = (page - 1) * limit;

	const filter: any = {};

	if (query.search) {
		filter.$or = [
			{ name: { $regex: query.search, $options: "i" } },
			{ email: { $regex: query.search, $options: "i" } },
			{ telephone: { $regex: query.search, $options: "i" } },
		];
	}

	if (query.role) {
		filter.role = query.role;
	}

	const [users, total] = await Promise.all([
		User.find(filter)
			.select("name email telephone role isActive createdAt")
			.skip(skip)
			.limit(limit)
			.sort({ createdAt: -1 }),
		User.countDocuments(filter),
	]);

	return {
		data: users as DashboardUser[],
		pagination: {
			page,
			limit,
			total,
			pages: Math.ceil(total / limit) || 1,
		},
	};
};
