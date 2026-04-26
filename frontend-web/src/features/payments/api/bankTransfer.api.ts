import { apiFetch } from "../../../services/http/interceptors";
import type { PendingTransferData } from "../../bank-verification/api/bank-verification.api";

export const getBankTransfers = async (params: { status?: string; search?: string } = {}) => {
  const query = new URLSearchParams();
  if (params.status && params.status !== "All Transactions") query.append("status", params.status);
  if (params.search) query.append("search", params.search);
  
  const queryString = query.toString() ? `?${query.toString()}` : "";
  // Note: This matches the endpoint used in bank-verification
  return apiFetch<PendingTransferData[]>(`/bank-verification/transfers${queryString}`);
};
