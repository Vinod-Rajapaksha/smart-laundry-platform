export type InventoryUnit = "PCS" | "KG" | "L";

export interface InventoryItem {
  _id: string;
  categoryName: string;
  name: string;
  sku?: string;
  unit: InventoryUnit;
  unitPrice: number;
  qtyInStock: number;
  reorderLevel: number;
  isActive: boolean;
  isDefault: boolean;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export type Tab = "All Items" | "Low Stock" | "Inactive";
