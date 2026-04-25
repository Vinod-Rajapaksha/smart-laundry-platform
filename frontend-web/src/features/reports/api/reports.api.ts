import { apiFetch, apiDownload } from "../../../services/http/interceptors";
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
  return apiDownload(`/analytics/reports/download/${id}`, {
    method: "GET",
  });
};

export const deleteReport = async (id: string) => {
  return apiFetch<void>(`/analytics/reports/${id}`, {
    method: "DELETE",
  });
};
