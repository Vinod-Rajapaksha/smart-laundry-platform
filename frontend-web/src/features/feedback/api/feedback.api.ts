import { apiFetch } from "../../../services/http/interceptors";
import { feedbackEndpoints } from "./feedback.endpoints";
import type {
  FeedbackItem,
  FeedbackListQuery,
  FeedbackListResponse,
  FeedbackStats,
} from "../types";
import type { FeedbackStatus } from "../../../types/enums";

function buildFeedbackQuery(params: FeedbackListQuery): string {
  const searchParams = new URLSearchParams();

  if (params.page !== undefined) {
    searchParams.set("page", String(params.page));
  }

  if (params.limit !== undefined) {
    searchParams.set("limit", String(params.limit));
  }

  if (params.status) {
    searchParams.set("status", params.status);
  }

  if (params.hasSuggestions) {
    searchParams.set("hasSuggestions", "true");
  }

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : "";
}

export const feedbackApi = {
  getFeedbacks(params: FeedbackListQuery) {
    return apiFetch<FeedbackListResponse>(
      `${feedbackEndpoints.list}${buildFeedbackQuery(params)}`
    );
  },

  getFeedbackStats() {
    return apiFetch<FeedbackStats>(feedbackEndpoints.stats);
  },

  getFeedbackById(id: string) {
    return apiFetch<FeedbackItem>(feedbackEndpoints.byId(id));
  },

  updateFeedbackStatus(id: string, status: FeedbackStatus) {
    return apiFetch<FeedbackItem>(feedbackEndpoints.updateStatus(id), {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  },
};