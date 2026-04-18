import { apiFetch } from "../../../services/http/interceptors";
import type { Feedback } from "../types";

export const getFeedbacks = async () => {
  return apiFetch<Feedback[]>(`/feedback`);
};

export const updateFeedbackStatus = async (id: string, isActive: boolean) => {
  return apiFetch<Feedback>(`/feedback/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ isActive }),
  });
};
