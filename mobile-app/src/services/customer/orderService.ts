import api from '../api';
import { Order } from '../../types/order.types';

export const orderService = {
  getMyOrders: async (filters?: any): Promise<Order[]> => {
    const response = await api.get('/orders/my', { params: filters });
    if (response.data.success) {
      return response.data.data.orders || [];
    }
    throw new Error(response.data.message || 'Failed to fetch orders');
  },

  getOrderById: async (id: string): Promise<Order> => {
    const response = await api.get(`/orders/${id}`);
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to fetch order details');
  },

  getActiveOrder: async (): Promise<Order | null> => {
    const response = await api.get('/orders/my', { 
        params: { limit: 1, sort: '-createdAt', status_ne: 'DELIVERED' } 
    });
    if (response.data.success && response.data.data.orders && response.data.data.orders.length > 0) {
      return response.data.data.orders[0];
    }
    return null;
  },

  getReceiptUrl: (id: string): string => {
    return `${process.env.EXPO_PUBLIC_API_BASE_URL}/orders/${id}/receipt`;
  }
};

export default orderService;
