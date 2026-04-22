import Inventory from '../../database/models/Inventory.js';
import ApiError from '../../core/apiError.js';
import { DEFAULT_PAGINATION } from '../../core/constants.js';
import { generateInventoryId } from '../../utils/reference.js';

interface InventoryInput {
  itemId?: string;
  categoryName: string;
  name: string;
  sku?: string | null;
  unit: 'PCS' | 'KG' | 'L';
  unitPrice: number;
  qtyInStock?: number;
  reorderLevel?: number;
  isActive?: boolean;
  isDefault?: boolean;
  description?: string | null;
  supplierId?: string | null;
}

export const createInventory = async (input: InventoryInput) => {
  if (!input.itemId) {
    let itemId = generateInventoryId();
    let exists = await Inventory.exists({ itemId });
    while (exists) {
      itemId = generateInventoryId();
      exists = await Inventory.exists({ itemId });
    }
    input.itemId = itemId;
  }

  if (input.isDefault) {
    await Inventory.updateMany(
      { categoryName: input.categoryName },
      { $set: { isDefault: false } }
    );
  }

  const inventory = await Inventory.create(input);
  return inventory;
};

export const updateInventory = async (id: string, input: Partial<InventoryInput>) => {
  const existing = await Inventory.findById(id);
  if (!existing) {
    throw new ApiError(404, 'Inventory item not found');
  }

  const category = input.categoryName || existing.categoryName;

  if (input.isDefault) {
    await Inventory.updateMany(
      { categoryName: category },
      { $set: { isDefault: false } }
    );
  }

  const updated = await Inventory.findByIdAndUpdate(
    id,
    { $set: input },
    { new: true, runValidators: true }
  );

  return updated;
};

export const deleteInventory = async (id: string) => {
  const result = await Inventory.findByIdAndDelete(id);
  if (!result) {
    throw new ApiError(404, 'Inventory item not found');
  }
  return { success: true };
};

export const getInventoryById = async (id: string) => {
  const inventory = await Inventory.findById(id);
  if (!inventory) {
    throw new ApiError(404, 'Inventory item not found');
  }
  return inventory;
};

export const getAllInventory = async (query: any) => {
  const { category, isActive, isDefault, page, limit } = query;
  const p = parseInt(page) || DEFAULT_PAGINATION.PAGE;
  const l = parseInt(limit) || DEFAULT_PAGINATION.LIMIT;
  const skip = (p - 1) * l;

  const filter: any = {};
  if (category) filter.categoryName = category;
  if (isActive !== undefined) filter.isActive = isActive;
  if (isDefault !== undefined) filter.isDefault = isDefault;

  const [items, total] = await Promise.all([
    Inventory.find(filter)
      .sort({ categoryName: 1, name: 1 })
      .populate('supplierId', 'name contactPerson')
      .skip(skip)
      .limit(l),
    Inventory.countDocuments(filter),
  ]);

  return {
    items,
    pagination: {
      total,
      page: p,
      limit: l,
      totalPages: Math.ceil(total / l),
    },
  };
};

export const getInventoryByCategory = async (category: string) => {
  return await Inventory.find({ categoryName: category, isActive: true })
    .sort({ isDefault: -1, name: 1 });
};
