import InventoryCategory from '../../database/models/InventoryCategory.js';
import ApiError from '../../core/apiError.js';

interface CategoryInput {
  name: string;
  description?: string | null;
  isActive?: boolean;
}

export const createCategory = async (input: CategoryInput) => {
  return await InventoryCategory.create(input);
};

export const updateCategory = async (id: string, input: Partial<CategoryInput>) => {
  const category = await InventoryCategory.findByIdAndUpdate(
    id,
    { $set: input },
    { new: true, runValidators: true }
  );
  if (!category) {
    throw new ApiError(404, 'Inventory Category not found');
  }
  return category;
};

export const deleteCategory = async (id: string) => {
  const result = await InventoryCategory.findByIdAndDelete(id);
  if (!result) {
    throw new ApiError(404, 'Inventory Category not found');
  }
  return { success: true };
};

export const getCategoryById = async (id: string) => {
  const category = await InventoryCategory.findById(id);
  if (!category) {
    throw new ApiError(404, 'Inventory Category not found');
  }
  return category;
};

export const getAllCategories = async () => {
  return await InventoryCategory.find().sort({ name: 1 });
};
