export interface InventoryItem {
    id: string;
    name: string;
    category: string;
    price: string;
    stock: string;
    threshold: string;
}

export type InventoryErrors = Partial<Record<keyof InventoryItem, string>>;
