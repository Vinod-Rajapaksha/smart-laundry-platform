import api from '../api';

export interface StaffStats {
  pickups: number;
  processing: number;
  deliveries: number;
  completedToday: number;
}

export const staffService = {
  getDashboardStats: async (): Promise<StaffStats> => {
    try {
      const response = await api.get('/analytics/staff-dashboard');
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch staff statistics');
    }
  }
};

export default staffService;
