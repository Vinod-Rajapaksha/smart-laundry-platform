import AsyncStorage from "@react-native-async-storage/async-storage";
import { STORAGE_KEYS } from "../constants/storageKeys";
import { AuthUser } from "../types/auth.types";

export const setAccessToken = async (token: string) => {
  await AsyncStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);
};

export const getAccessToken = async () => {
  return AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
};

export const setRefreshToken = async (token: string) => {
  await AsyncStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, token);
};

export const getRefreshToken = async () => {
  return AsyncStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
};

export const setUserStorage = async (user: AuthUser) => {
  await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
};

export const getUserStorage = async (): Promise<AuthUser | null> => {
  const raw = await AsyncStorage.getItem(STORAGE_KEYS.USER);
  return raw ? JSON.parse(raw) : null;
};

export const clearAuthStorage = async () => {
  await AsyncStorage.multiRemove([
    STORAGE_KEYS.ACCESS_TOKEN,
    STORAGE_KEYS.REFRESH_TOKEN,
    STORAGE_KEYS.USER,
  ]);
};