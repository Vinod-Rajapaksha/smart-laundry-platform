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
  },

  uploadAvatar: async (formData: FormData): Promise<UserProfile> => {
    const response = await api.post('/users/profile/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to upload avatar');
  },

  changePassword: async (data: any): Promise<void> => {
    const response = await api.post('/users/profile/change-password', data);
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to change password');
    }
  }
};

export default profileService;
