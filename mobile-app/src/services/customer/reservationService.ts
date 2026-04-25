import api from '../api';
import { InventoryItem, Service } from '../../types/reservation.types';

export const reservationService = {
  /**
   * Fetch all available laundry services
   */
  getServices: async (): Promise<Service[]> => {
    const response = await api.get('/services');
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to fetch services');
  },

  /**
   * Fetch a single service by ID
   */
  getServiceById: async (id: string): Promise<Service> => {
    const response = await api.get(`/services/${id}`);
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to fetch service details');
  },

  /**
   * Fetch inventory items by category (Detergent, FabricCare, etc.)
   */
  getInventoryByCategory: async (category: string): Promise<InventoryItem[]> => {
    const response = await api.get(`/inventory/category/${category}`);
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.message || `Failed to fetch ${category} items`);
  },

  /**
   * Create a new reservation order
   */
  createOrder: async (orderData: any) => {
    const response = await api.post('/orders', orderData);
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to place order');
  }
};

export default reservationService;
