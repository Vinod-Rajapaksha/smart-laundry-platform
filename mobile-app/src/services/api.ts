import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_BASE_URL,
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await AsyncStorage.multiRemove(["accessToken", "refreshToken", "user"]);

      try {
        const { store } = require("../store/store");
        store.dispatch({ type: "auth/logout/fulfilled" });
      } catch (e) {
        console.error("Failed to dispatch logout from interceptor", e);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
