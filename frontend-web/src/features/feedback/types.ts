import type { FeedbackStatus } from "../../types/enums";

export const FEEDBACK_TAGS = {
  GOOD_SERVICE: "good service",
  EXCELLENT_CUSTOMER_SERVICE: "excellent customer service",
  ON_TIME: "on time",
  REASONABLE_PRICES: "reasonable prices",
  RECOMMENDED: "recommended",
} as const;

export type FeedbackTag = (typeof FEEDBACK_TAGS)[keyof typeof FEEDBACK_TAGS];

export interface FeedbackUser {
  _id: string;
  name: string;
}

export interface FeedbackOrder {
  _id: string;
  orderNo: string;
}

export interface FeedbackItem {
  _id: string;
  orderId: FeedbackOrder | null;
  userId: FeedbackUser | null;
  rating: number;
  status: FeedbackStatus;
  comment: string | null;
  suggestions: string | null;
  tags: FeedbackTag[];
  createdAt: string;
  updatedAt: string;
}

export interface FeedbackPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface FeedbackListResponse {
  feedbacks: FeedbackItem[];
  pagination: FeedbackPagination;
}

export interface FeedbackStatsStatusItem {
  _id: string;
  count: number;
}

export interface FeedbackStatsRatingItem {
  _id: number;
  count: number;
}

export interface FeedbackStats {
  totalReviews: number;
  averageRating: number;
  totalApproved: number;
  approvedAverageRating: number;
  ratingDistribution: FeedbackStatsRatingItem[];
  statusBreakdown: FeedbackStatsStatusItem[];
}

export interface FeedbackListQuery {
  page?: number;
  limit?: number;
  status?: FeedbackStatus | "";
  hasSuggestions?: boolean;
}

export interface FeedbackState {
  items: FeedbackItem[];
  pagination: FeedbackPagination;
  stats: FeedbackStats | null;
  selectedFeedback: FeedbackItem | null;
  loadingList: boolean;
  loadingStats: boolean;
  loadingDetails: boolean;
  updatingStatusId: string | null;
  error: string | null;
  filters: {
    page: number;
    limit: number;
    status: FeedbackStatus | "";
    hasSuggestions: boolean;
  };
}