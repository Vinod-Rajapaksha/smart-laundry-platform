import { apiFetch } from "../../../services/http/interceptors";
import type { StaffJob } from "../types";

export const getStaffJobs = async (status?: string) => {
  const query = status ? `?status=${status}` : "";
  return apiFetch<StaffJob[]>(`/orders/delivery${query}`);
};

export const updateJobStatus = async (id: string, status: string) => {
  return apiFetch<StaffJob>(`/orders/delivery/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
};
