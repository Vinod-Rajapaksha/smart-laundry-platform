import { apiFetch } from "../../../services/http/interceptors";
import type { DashboardKPIs } from "../types";

export const getDashboardKPIs = async (range?: string) => {
  const query = range ? `?range=${range}` : "";
  return apiFetch<DashboardKPIs>(`/analytics/dashboard${query}`);
};
