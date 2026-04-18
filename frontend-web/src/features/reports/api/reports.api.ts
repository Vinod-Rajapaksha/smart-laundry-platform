import { apiFetch } from "../../../services/http/interceptors";
import type { Report } from "../types";

export const getReports = async () => {
  return apiFetch<Report[]>(`/analytics/reports`);
};

export const createReport = async (data: Partial<Report>) => {
  return apiFetch<Report>(`/analytics/reports/save`, {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const downloadReport = async (id: string) => {
  return apiFetch<Blob>(`/analytics/reports/download/${id}`, {
    method: "GET",
  });
};
