export interface DashboardStats {
	totalOrders: number;
	totalCustomers: number;
	pendingOrders: number;
}

export interface DashboardUser {
	_id: string;
	name: string;
	email: string;
	telephone: string;
	role: "ADMIN" | "STAFF" | "CUSTOMER";
	isActive: boolean;
	createdAt?: string;
}

export interface DashboardUserListResponse {
	data: DashboardUser[];
	pagination: {
		page: number;
		limit: number;
		total: number;
		pages: number;
	};
}
