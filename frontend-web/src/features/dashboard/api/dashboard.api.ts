import { apiFetch } from "../../../services/http/interceptors";
import type { DashboardStats, DashboardUserListResponse } from "../types";

export const dashboardApi = {
	getDashboardStats() {
		return apiFetch<DashboardStats>("/data/dashboard");
	},
  getUsers(params?: { page?: number; limit?: number; search?: string; role?: string }) {
		const searchParams = new URLSearchParams();
		if (params?.page) searchParams.set("page", String(params.page));
		if (params?.limit) searchParams.set("limit", String(params.limit));
		if (params?.search) searchParams.set("search", params.search);
		if (params?.role) searchParams.set("role", params.role);

		const query = searchParams.toString();
		const path = `/data/users${query ? `?${query}` : ""}`;
		return apiFetch<DashboardUserListResponse>(path);
	},
};
