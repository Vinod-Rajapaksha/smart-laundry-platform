import { apiFetch } from "../../../services/http/interceptors";
import type { Payment, OnlineTransaction, CODPayment } from "../types";
import { getOnlineTransactions, getOnlineTransactionById } from "./onlineTransaction.api";
import { getCashOnDeliveries, updateCODStatus } from "./cod.api";
import { bankVerificationApi, type PendingTransferData } from "../../bank-verification/api/bank-verification.api";

export const getPayments = async (status?: string) => {
  const query = status ? `?status=${status}` : "";
  return apiFetch<Payment[]>(`/payments${query}`);
};

export const getPaymentById = async (id: string) => {
  return apiFetch<Payment>(`/payments/${id}`);
};

export const verifyPayment = async (id: string, status: string) => {
  return apiFetch<Payment>(`/payments/${id}/verify`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
};

export const getDashboardStats = async () => {
  return apiFetch<any>(`/payments/stats`);
};

export const paymentsApi = {
  getPayments,
  getPaymentById,
  verifyPayment,
  getOnlineTransactions,
  getOnlineTransactionById,
  getCashOnDeliveries,
  updateCODStatus,
  getDashboardStats,
  getBankTransfers: (params: { status?: string; search?: string }) => {
    return bankVerificationApi.getTransfers(params);
  }
};

export type { OnlineTransaction, CODPayment, PendingTransferData };
