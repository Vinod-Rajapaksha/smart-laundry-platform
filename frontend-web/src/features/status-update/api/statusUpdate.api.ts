import { apiFetch } from "../../../services/http/interceptors";
import type { StatusUpdateOrder, OrderStatus } from "../types";

export const statusUpdateApi = {
  getOrders: async (status?: string) => {
    const query = status ? `?status=${status}` : "";
    return apiFetch<any>(`/orders${query}`);
  },

  updateStatus: async (id: string, status: OrderStatus) => {
    return apiFetch<StatusUpdateOrder>(`/orders/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  },
};
