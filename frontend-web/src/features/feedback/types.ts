export const FEEDBACK_STATUS = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
} as const;

export type FeedbackStatus = typeof FEEDBACK_STATUS[keyof typeof FEEDBACK_STATUS];

export interface Feedback {
  _id: string;
  userId: {
    _id: string;
    name: string;
  };
  orderId: {
    _id: string;
    orderNo: string;
  };
  rating: number;
  comment: string;
  suggestions?: string;
  tags?: string[];
  status: FeedbackStatus;
  createdAt: string;
  updatedAt: string;
}

export interface FeedbackStats {
  totalReviews: number;
  averageRating: number;
  totalApproved: number;
  approvedAverageRating: number;
  ratingDistribution: { _id: number; count: number }[];
  statusBreakdown: { _id: string; count: number }[];
}

export type Tab = "All Feedbacks" | "Pending Moderation" | "High Rating" | "Low Rating" | "Rejected";
