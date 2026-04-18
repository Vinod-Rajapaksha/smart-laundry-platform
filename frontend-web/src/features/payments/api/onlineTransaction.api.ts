import { apiFetch } from "../../../services/http/interceptors";
import type { OnlineTransaction } from "../types";

export const getOnlineTransactions = async (params: { status?: string; search?: string } = {}) => {
  const query = new URLSearchParams();
  if (params.status && params.status !== "All") query.append("status", params.status);
  if (params.search) query.append("search", params.search);
  
  const queryString = query.toString() ? `?${query.toString()}` : "";
  return apiFetch<{ success: boolean; data: OnlineTransaction[] }>(`/payments/online${queryString}`);
};

export const getOnlineTransactionById = async (id: string) => {
  return apiFetch<{ success: boolean; data: OnlineTransaction }>(`/payments/online/${id}`);
};
