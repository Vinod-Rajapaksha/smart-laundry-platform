import { apiFetch } from "../../../services/http/client";
import { Supplier } from "../types";

export const supplierApi = {
  getSuppliers: async (): Promise<Supplier[]> => {
    const res = await apiFetch<any>("/suppliers");
    return res.data || res;
  },

  createSupplier: async (data: Supplier): Promise<Supplier> => {
    const res = await apiFetch<any>("/suppliers", {
      method: "POST",
      body: JSON.stringify(data),
    });
    return res.data || res;
  },

  updateSupplier: async (id: string, data: Supplier): Promise<Supplier> => {
    const res = await apiFetch<any>(`/suppliers/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
    return res.data || res;
  },

  deleteSupplier: async (id: string): Promise<void> => {
    await apiFetch(`/suppliers/${id}`, {
      method: "DELETE",
    });
  },

  getNotifications: async (): Promise<any[]> => {
    const res = await apiFetch<any>("/suppliers/notifications");
    return res.data || res;
  },
};
