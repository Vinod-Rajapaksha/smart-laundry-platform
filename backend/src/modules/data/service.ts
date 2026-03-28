import Order from "../../database/models/Order.js";
import User from "../../database/models/User.js";

export interface DashboardStats {
	totalOrders: number;
	totalCustomers: number;
	pendingOrders: number;
}

export const getDashboardStats = async (): Promise<DashboardStats> => {
	const [totalOrders, totalCustomers, pendingOrders] = await Promise.all([
		Order.countDocuments(),
		User.countDocuments({ role: "CUSTOMER" }),
		Order.countDocuments({
			status: { $in: ["PICKUP_ENROUTE", "PICKED_UP"] },
		}),
	]);

	return {
		totalOrders,
		totalCustomers,
		pendingOrders,
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
