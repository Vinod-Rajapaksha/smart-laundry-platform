import api from '../api';

export interface StaffOrder {
  _id: string;
  orderNo: string;
  status: string;
  userId: {
    name: string;
    telephone: string;
  };
  serviceId: {
    name: string;
  };
  totalAmount: number;
  pickupAddress: string;
  deliveryAddress: string;
  pickupLat?: number;
  pickupLng?: number;
  deliveryLat?: number;
  deliveryLng?: number;
  staffId?: string;
  createdAt: string;
  updatedAt: string;
}

export const staffOrderService = {
  getAvailableOrders: async (page = 1, limit = 10): Promise<StaffOrder[]> => {
    const response = await api.get('/orders/available', {
      params: { page, limit }
    });
    if (response.data.success) {
      return response.data.data.orders;
    }
    throw new Error(response.data.message || 'Failed to fetch available orders');
  },

  getAssignedTasks: async (status?: string | string[]): Promise<StaffOrder[]> => {
    const response = await api.get('/orders/tasks', {
      params: { status }
    });
    if (response.data.success) {
      return response.data.data.orders;
    }
    throw new Error(response.data.message || 'Failed to fetch assigned tasks');
  },

  claimOrder: async (orderId: string): Promise<StaffOrder> => {
    const response = await api.patch(`/orders/${orderId}/claim`);
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to claim order');
  },

  getOrderById: async (orderId: string): Promise<StaffOrder> => {
    const response = await api.get(`/orders/${orderId}`);
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to fetch order details');
  },

  updateOrderStatus: async (orderId: string, status: string): Promise<StaffOrder> => {
    const response = await api.patch(`/orders/${orderId}/status`, { status });
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to update order status');
  },

  notifyArrival: async (orderId: string): Promise<any> => {
    const response = await api.post(`/orders/${orderId}/arrive`);
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to notify arrival');
  }
};
