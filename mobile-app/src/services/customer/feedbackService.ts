import api from '../api';
import { Feedback, CreateFeedbackInput } from '../../types/feedback.types';

export const feedbackService = {
  createFeedback: async (input: CreateFeedbackInput): Promise<Feedback> => {
    const response = await api.post('/feedback', input);
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to submit feedback');
  },

  getMyFeedbacks: async (): Promise<Feedback[]> => {
    const response = await api.get('/feedback/my');
    if (response.data.success) {
      return response.data.data || [];
    }
    throw new Error(response.data.message || 'Failed to fetch feedback history');
  },

  getFeedbackForOrder: async (orderId: string): Promise<Feedback | null> => {
    const response = await api.get(`/feedback/my/${orderId}`);
    if (response.data.success) {
      return response.data.data;
    }
    return null;
  }
};

export default feedbackService;
