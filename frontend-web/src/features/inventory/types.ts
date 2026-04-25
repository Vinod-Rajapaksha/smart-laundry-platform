export type InventoryUnit = "PCS" | "KG" | "L" | "ML" | "SET";

export interface InventoryItem {
  _id: string;
  categoryName: string;
  name: string;
  sku?: string;
  unit: InventoryUnit;
  unitPrice: number;
  qtyInStock: number;
  reorderLevel: number;
  batchQty: number;
  isOrderPending: boolean;
  isActive: boolean;
  isDefault: boolean;
  description?: string;
  supplierId?: string;
  createdAt: string;
  updatedAt: string;
}

export type Tab = "All Items" | "Low Stock" | "Inactive";
