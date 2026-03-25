import axios from 'axios';
import type { User, CreateUserInput, UpdateUserInput, UserListResponse, UserStats } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Get all users with pagination and filtering
 */
export const getAllUsers = async (
  page?: number,
  limit?: number,
  search?: string,
  role?: string
): Promise<UserListResponse> => {
  const response = await axiosInstance.get('/users', {
    params: { page, limit, search, role },
  });
  return response.data.data;
};

/**
 * Get user by ID
 */
export const getUserById = async (id: string): Promise<User> => {
  const response = await axiosInstance.get(`/users/${id}`);
  return response.data.data;
};

/**
 * Create a new user
 */
export const createUser = async (data: CreateUserInput): Promise<User> => {
  const response = await axiosInstance.post('/users', data);
  return response.data.data;
};

/**
 * Update user
 */
export const updateUser = async (id: string, data: UpdateUserInput): Promise<User> => {
  const response = await axiosInstance.put(`/users/${id}`, data);
  return response.data.data;
};

/**
 * Delete user (soft delete)
 */
export const deleteUser = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/users/${id}`);
};

/**
 * Toggle user status
 */
export const toggleUserStatus = async (id: string): Promise<User> => {
  const response = await axiosInstance.patch(`/users/${id}/toggle-status`);
  return response.data.data;
};

/**
 * Get user statistics
 */
export const getUserStats = async (): Promise<UserStats> => {
  const response = await axiosInstance.get('/users/stats');
  return response.data.data;
};

export default {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  toggleUserStatus,
  getUserStats,
};
