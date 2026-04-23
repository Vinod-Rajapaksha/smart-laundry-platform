export interface Feedback {
  _id: string;
  orderId: any;
  userId: any;
  rating: number;
  comment: string | null;
  suggestions: string | null;
  tags: string[];
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
  updatedAt: string;
}

export interface CreateFeedbackInput {
  orderId: string;
  rating: number;
  comment?: string;
  suggestions?: string;
  tags?: string[];
}
