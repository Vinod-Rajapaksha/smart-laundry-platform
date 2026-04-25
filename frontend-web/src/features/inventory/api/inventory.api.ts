import { apiFetch } from "../../../services/http/interceptors";
import type { InventoryItem } from "../types";

export const getInventory = async (status?: string) => {
  const query = status ? `?status=${status}` : "";
  return apiFetch<InventoryItem[]>(`/inventory${query}`);
};

export const createInventoryItem = async (data: Partial<InventoryItem>) => {
  return apiFetch<InventoryItem>(`/inventory`, {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const updateInventoryItem = async (id: string, data: Partial<InventoryItem>) => {
  return apiFetch<InventoryItem>(`/inventory/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
};

export const deleteInventoryItem = async (id: string) => {
  return apiFetch<void>(`/inventory/${id}`, {
    method: "DELETE",
  });
};
