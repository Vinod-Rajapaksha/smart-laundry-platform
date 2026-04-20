import { apiFetch } from "../../../services/http/interceptors";
import type { CODPayment } from "../types";

export const getCashOnDeliveries = async (params: { status?: string; search?: string } = {}) => {
  const query = new URLSearchParams();
  if (params.status && params.status !== "All") query.append("status", params.status);
  if (params.search) query.append("search", params.search);
  
  const queryString = query.toString() ? `?${query.toString()}` : "";
  return apiFetch<{ success: boolean; data: CODPayment[] }>(`/payments/cod/list${queryString}`);
};

export const updateCODStatus = async (id: string, status: string) => {
  return apiFetch<{ success: boolean; data: CODPayment }>(`/payments/cod/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
};
