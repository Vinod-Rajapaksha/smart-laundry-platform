import { apiFetch } from "../../../services/http/interceptors";
import type { LaundryService, ServiceQuery, ServiceResponse } from "../types";

export const servicesApi = {
  getAll: (query: ServiceQuery = {}) => {
    const params = new URLSearchParams();
    if (query.category && query.category !== "All") params.append("category", query.category);
    if (query.isActive !== undefined) params.append("isActive", String(query.isActive));
    if (query.isPopular !== undefined) params.append("isPopular", String(query.isPopular));
    if (query.page) params.append("page", String(query.page));
    if (query.limit) params.append("limit", String(query.limit));
    if (query.search) params.append("search", query.search);

    const queryString = params.toString();
    return apiFetch<ServiceResponse>(`/services${queryString ? `?${queryString}` : ""}`);
  },

  getById: (id: string) => apiFetch<LaundryService>(`/services/${id}`),

  create: (data: Partial<LaundryService>) =>
    apiFetch<LaundryService>("/services", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (id: string, data: Partial<LaundryService>) =>
    apiFetch<LaundryService>(`/services/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    apiFetch<void>(`/services/${id}`, {
      method: "DELETE",
    }),
};
