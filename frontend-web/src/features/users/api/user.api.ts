import { apiFetch } from "../../../services/http/interceptors";
import type { User } from "../types";

export const getUsers = async (role?: string) => {
    const query = role ? `?role=${role}` : "";
    return apiFetch<User[]>(`/users${query}`);
};

export const getUserById = async (id: string) => {
    return apiFetch<User>(`/users/${id}`);
};

export const updateUser = async (id: string, data: Partial<User>) => {
    return apiFetch<User>(`/users/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
    });
};

export const deleteUser = async (id: string) => {
    return apiFetch<void>(`/users/${id}`, {
        method: "DELETE",
    });
};
