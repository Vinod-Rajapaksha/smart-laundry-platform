import api from "../api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RegisterData, LoginResponse, AuthUser } from "../../types/auth.types";

export const login = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
  const response = await api.post("/auth/login", { email, password });
  const { user, accessToken, refreshToken } = response.data.data;

  await AsyncStorage.setItem("accessToken", accessToken);

  if (refreshToken) {
    await AsyncStorage.setItem("refreshToken", refreshToken);
  }

  return { user, accessToken, refreshToken };
};

export const register = async (data: RegisterData): Promise<AuthUser> => {
  const response = await api.post("/auth/register", data);
  return response.data.data;
};

export const logout = async (): Promise<void> => {
  await AsyncStorage.removeItem("accessToken");
  await AsyncStorage.removeItem("refreshToken");
};