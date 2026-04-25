import { apiFetch } from "../../../services/http/interceptors";
import type { UserProfile } from "../types";

export const getProfile = async () => {
  return apiFetch<UserProfile>(`/users/profile`);
};

export const updateProfile = async (data: Partial<UserProfile>) => {
  return apiFetch<UserProfile>(`/users/profile`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

export const updatePassword = async (data: any) => {
  return apiFetch<void>(`/auth/update-password`, {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const uploadAvatar = async (file: File) => {
  const formData = new FormData();
  formData.append("avatar", file);

  return apiFetch<UserProfile>(`/users/profile/avatar`, {
    method: "POST",
    body: formData,
  });
};
