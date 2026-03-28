import { apiFetch } from '../../../services/http/interceptors';
import type { DeliveryDashboardData } from '../types';

export const pickupDeliveryApi = {
  getDeliveryDashboard(): Promise<DeliveryDashboardData> {
    return apiFetch<DeliveryDashboardData>('/orders/admin/delivery-dashboard');
  },
};