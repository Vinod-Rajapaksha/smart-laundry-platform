import { apiFetch } from "../../../services/http/interceptors";
import type { Voucher } from "../types";

export const getVouchers = async () => {
  return apiFetch<Voucher[]>(`/promotions`);
};

export const createVoucher = async (data: Partial<Voucher>) => {
  return apiFetch<Voucher>(`/promotions`, {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const deleteVoucher = async (id: string) => {
  return apiFetch<void>(`/promotions/${id}`, {
    method: "DELETE",
  });
};
