import Inventory from '../../database/models/Inventory.js';
import StockMovement from '../../database/models/StockMovement.js';
import ApiError from '../../core/apiError.js';
import { DEFAULT_PAGINATION } from '../../core/constants.js';
import { generateInventoryId } from '../../utils/reference.js';
import { sendEmail } from '../../utils/mailService.js';
import mongoose from 'mongoose';

interface InventoryInput {
  itemId?: string;
  categoryName: string;
  name: string;
  sku?: string | null;
  unit: 'PCS' | 'KG' | 'L' | 'ML';
  unitPrice: number;
  qtyInStock?: number;
  reorderLevel?: number;
  batchQty?: number;
  isOrderPending?: boolean;
  isActive?: boolean;
  isDefault?: boolean;
  description?: string | null;
  supplierId: string;
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

export const markAsOrdered = async (id: string, qty: number) => {
  const item = await Inventory.findById(id).populate('supplierId');
  if (!item) throw new ApiError(404, 'Item not found');

  const supplier = item.supplierId as any;
  const managementName = process.env.MANAGEMENT_NAME || 'B & W Laundry Management';

  const subject = `Restock Order: ${item.name} - ${managementName}`;
  const body = `Dear ${supplier?.name || 'Vendor'},\n\n` +
    `This is an official purchase order from ${managementName} for the following item:\n\n` +
    `Item: ${item.name}\n` +
    `Quantity: ${qty} ${item.unit}\n\n` +
    `Please confirm receipt of this order and reply with an estimated delivery time within 24 hours.\n\n` +
    `Best Regards,\n` +
    `${managementName}`;

  if (supplier?.email) {
    await sendEmail(supplier.email, subject, body);
  }

  item.isOrderPending = true;
  await item.save();

  return item;
};

export const confirmRestock = async (id: string, actualQty?: number) => {
  const item = await Inventory.findById(id);
  if (!item) throw new ApiError(404, 'Item not found');

  const qtyToAdd = actualQty || item.batchQty || 0;

  const updated = await Inventory.findByIdAndUpdate(
    id,
    {
      $inc: { qtyInStock: qtyToAdd },
      $set: { isOrderPending: false }
    },
    { new: true }
  );

  await StockMovement.create({
    itemId: id,
    type: 'IN',
    quantity: qtyToAdd,
    reason: 'Restock Order Arrived',
    referenceId: id
  });

  return updated;
};

export const deductStockForOrder = async (orderId: string, serviceId: string, options: any[], multiplier: number) => {
  // 1. Deduct items linked to the service (consumption per unit)
  const service = await mongoose.model('Service').findById(serviceId);
  if (service && service.inventoryItems && service.inventoryItems.length > 0) {
    for (const mapping of service.inventoryItems) {
      const amountToDeduct = mapping.quantity * multiplier;
      await Inventory.findByIdAndUpdate(mapping.itemId, {
        $inc: { qtyInStock: -amountToDeduct }
      });

      // Log movement
      await StockMovement.create({
        itemId: mapping.itemId,
        type: 'OUT',
        quantity: amountToDeduct,
        reason: `Order Delivery: Service Consumption`,
        referenceId: orderId
      });
    }
  }

  // 2. Deduct items selected as options (one-time deduction per order)
  if (options && options.length > 0) {
    for (const opt of options) {
      await Inventory.findByIdAndUpdate(opt.inventoryId, {
        $inc: { qtyInStock: -1 }
      });

      // Log movement
      await StockMovement.create({
        itemId: opt.inventoryId,
        type: 'OUT',
        quantity: 1,
        reason: `Order Delivery: Add-on Option`,
        referenceId: orderId
      });
    }
  }
};
