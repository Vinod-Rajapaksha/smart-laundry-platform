import ServiceCategory from '../../database/models/ServiceCategory.js';
import ApiError from '../../core/apiError.js';

interface CategoryInput {
  name: string;
  price?: number;
  isActive?: boolean;
}

export const createCategory = async (input: CategoryInput) => {
  return await ServiceCategory.create(input);
};

export const updateCategory = async (id: string, input: Partial<CategoryInput>) => {
  const category = await ServiceCategory.findByIdAndUpdate(
    id,
    { $set: input },
    { new: true, runValidators: true }
  );
  if (!category) {
    throw new ApiError(404, 'Category not found');
  }
  return category;
};

export const deleteCategory = async (id: string) => {
  const result = await ServiceCategory.findByIdAndDelete(id);
  if (!result) {
    throw new ApiError(404, 'Category not found');
  }
  return { success: true };
};

export const getCategoryById = async (id: string) => {
  const category = await ServiceCategory.findById(id);
  if (!category) {
    throw new ApiError(404, 'Category not found');
  }
  return category;
};

export const getAllCategories = async () => {
  return await ServiceCategory.find().sort({ name: 1 });
};
