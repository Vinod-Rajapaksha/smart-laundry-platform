import { apiFetch } from "../../../services/http/interceptors";
import type { CreateCategoryInput, UpdateCategoryInput, CategoryType } from "../types";

const getBasePath = (type: CategoryType) => type === "SERVICE" ? "/categories" : "/inventory-categories";

export const categoryApi = {
  getAllCategories: async <T>(type: CategoryType): Promise<T[]> => {
    return apiFetch<T[]>(getBasePath(type));
  },

  getCategoryById: async <T>(type: CategoryType, id: string): Promise<T> => {
    return apiFetch<T>(`${getBasePath(type)}/${id}`);
  },

  createCategory: async <T>(type: CategoryType, data: CreateCategoryInput): Promise<T> => {
    return apiFetch<T>(getBasePath(type), {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  updateCategory: async <T>(type: CategoryType, data: UpdateCategoryInput): Promise<T> => {
    const { _id, ...updateData } = data;
    return apiFetch<T>(`${getBasePath(type)}/${_id}`, {
      method: "PATCH",
      body: JSON.stringify(updateData),
    });
  },

  deleteCategory: async (type: CategoryType, id: string): Promise<void> => {
    return apiFetch<void>(`${getBasePath(type)}/${id}`, {
      method: "DELETE",
    });
  },
};
