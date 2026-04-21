import { apiFetch } from "../../../services/http/interceptors";
import type { Feedback, FeedbackStatus, FeedbackStats } from "../types";

export const feedbackApi = {
  getFeedbacks: async (status?: string) => {
    const query = status ? `?status=${status}` : "";
    return apiFetch<any>(`/feedback${query}`);
  },

  getFeedbackStats: async () => {
    return apiFetch<FeedbackStats>(`/feedback/stats`);
  },

  updateFeedbackStatus: async (id: string, status: FeedbackStatus) => {
    return apiFetch<Feedback>(`/feedback/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  },

  deleteFeedback: async (id: string) => {
    return apiFetch<void>(`/feedback/${id}`, {
      method: "DELETE",
    });
  },
};
