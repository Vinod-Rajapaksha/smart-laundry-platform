import api from "../api";
import { RegisterData, LoginResponse, AuthUser } from "../../types/auth.types";
import { setAccessToken, setRefreshToken, clearAuthStorage, setUserStorage } from "../storage";

export const login = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
  const response = await api.post("/auth/login", { email, password });
  const { user, accessToken, refreshToken } = response.data.data;

  await setAccessToken(accessToken);

  if (refreshToken) {
  await setRefreshToken(refreshToken);
  }

  await setUserStorage(user);

  return { user, accessToken, refreshToken };
};

export const register = async (data: RegisterData): Promise<AuthUser> => {
  const response = await api.post("/auth/register", data);
  return response.data.data;
};

export const logout = async (): Promise<void> => {
  await clearAuthStorage();
};