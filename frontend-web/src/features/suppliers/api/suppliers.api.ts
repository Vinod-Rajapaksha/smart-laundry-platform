import { apiFetch } from "../../../services/http/interceptors";
import type { Supplier, SupplierStats } from "../types";

export const suppliersApi = {
  getSuppliers: async (status?: string) => {
    const query = status ? `?status=${status}` : "";
    return apiFetch<any>(`/suppliers${query}`);
  },

  getSupplierStats: async () => {
    return apiFetch<SupplierStats>(`/suppliers/stats`);
  },

  createSupplier: async (data: Partial<Supplier>) => {
    return apiFetch<Supplier>("/suppliers", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  updateSupplier: async (id: string, data: Partial<Supplier>) => {
    return apiFetch<Supplier>(`/suppliers/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  deleteSupplier: async (id: string) => {
    return apiFetch<void>(`/suppliers/${id}`, {
      method: "DELETE",
    });
  },
};
