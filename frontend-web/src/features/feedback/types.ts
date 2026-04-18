export interface Feedback {
  _id: string;
  userId: string;
  orderId: string;
  rating: number;
  comment: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type Tab = "All Feedbacks" | "High Rating" | "Low Rating" | "Inactive";
