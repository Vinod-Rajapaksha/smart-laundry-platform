import api from "../services/api";
import { AuthUser } from "../types/auth.types";

export async function fetchUserById(userId: string): Promise<AuthUser> {
  const response = await api.get(`/users/${userId}`);
  return response.data.data;
}
