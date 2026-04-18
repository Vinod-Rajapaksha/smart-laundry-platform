import api from '../api';
import { UserProfile, UpdateProfilePayload } from '../../types/user.types';

export const profileService = {
  getProfile: async (): Promise<UserProfile> => {
    const response = await api.get('/users/profile');
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to fetch profile');
  },

  updateProfile: async (data: UpdateProfilePayload): Promise<UserProfile> => {
    const response = await api.put('/users/profile', data);
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to update profile');
  }
};

export default profileService;
