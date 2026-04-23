import { apiFetch } from "../../../services/http/interceptors";
import type { Order } from "../types";

export const getOrders = async (status?: string) => {
  let query = "";
  if (status === "Pending") {
    const s = ["ORDER_PLACED", "PICKUP_ASSIGNED", "PICKUP_ON_THE_WAY", "PICKUP_ARRIVED", "PICKED_UP", "HANDED_OVER", "WASHING", "DRYING", "PROCESSING", "READY", "DELIVERY_ASSIGNED", "DELIVERY_ON_THE_WAY", "DELIVERY_ARRIVED"];
    query = `?${s.map(x => `status=${x}`).join('&')}`;
  } else if (status === "Pickup") {
    const s = ["PICKUP_ASSIGNED", "PICKUP_ON_THE_WAY", "PICKUP_ARRIVED", "PICKED_UP"];
    query = `?${s.map(x => `status=${x}`).join('&')}`;
  } else if (status === "Processing") {
    const s = ["HANDED_OVER", "WASHING", "DRYING", "PROCESSING", "READY"];
    query = `?${s.map(x => `status=${x}`).join('&')}`;
  } else if (status === "Delivery") {
    const s = ["DELIVERY_ASSIGNED", "DELIVERY_ON_THE_WAY", "DELIVERY_ARRIVED", "DELIVERED"];
    query = `?${s.map(x => `status=${x}`).join('&')}`;
  } else if (status === "Completed") {
    query = `?status=DELIVERED`;
  } else if (status) {
    query = `?status=${status}`;
  }
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
export const deleteOrder = async (id: string) => {
  return apiFetch<void>(`/orders/${id}`, {
    method: "DELETE",
  });
};
