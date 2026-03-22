import axios from "axios";
import { API_CONFIG } from "../constants/api";
import { getAccessToken, clearAuthStorage } from "../services/storage";

const axiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(async (config) => {
  const token = await getAccessToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error?.response?.status === 401) {
      await clearAuthStorage();
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;