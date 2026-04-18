import { apiFetch } from "../../../services/http/interceptors";
import type { Order } from "../types";

export const getOrders = async (status?: string) => {
  const query = status ? `?status=${status}` : "";
  return apiFetch<Order[]>(`/orders${query}`);
};

export const getOrderByNo = async (orderNo: string) => {
  return apiFetch<Order>(`/orders/no/${orderNo}`);
};

export const updateOrderStatus = async (id: string, status: string) => {
  return apiFetch<Order>(`/orders/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
};

export const updateOrder = async (id: string, data: Partial<Order>) => {
  return apiFetch<Order>(`/orders/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
};
