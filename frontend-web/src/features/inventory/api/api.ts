import type { InventoryItem } from '../types';

const API_URL = 'http://localhost:5000/api/inventory';

export const fetchInventory = async () => {
    const res = await fetch(`${API_URL}/items`);
    if (!res.ok) throw new Error('Failed to fetch items');
    const data = await res.json();
    return data.data;
};

export const createInventoryItem = async (item: Partial<InventoryItem>) => {
    const res = await fetch(`${API_URL}/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
    });
    if (!res.ok) throw new Error('Failed to create item');
    const data = await res.json();
    return data.data;
};

export const updateInventoryItem = async (id: string, data: Partial<InventoryItem>): Promise<InventoryItem> => {
    const res = await fetch(`${API_URL}/items/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update item');
    const result = await res.json();
    return result.data;
};

// Deduct Stock
export const deductInventoryStock = async (id: string, amount: number, unit: string): Promise<InventoryItem> => {
    const res = await fetch(`${API_URL}/items/${id}/deduct`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, unit }),
    });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Failed to deduct stock');
    }
    const result = await res.json();
    return result.data;
};

// Restock
export const restockInventoryItem = async (id: string, amount: number, unit: string): Promise<InventoryItem> => {
    const res = await fetch(`${API_URL}/items/${id}/restock`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, unit }),
    });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Failed to restock item');
    }
    const result = await res.json();
    return result.data;
};

// Delete Item
export const deleteInventoryItem = async (id: string) => {
    const res = await fetch(`${API_URL}/items/${id}`, {
        method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete item');
    return true;
};

export const fetchCategories = async () => {
    const res = await fetch(`${API_URL}/categories`);
    if (!res.ok) throw new Error('Failed to fetch categories');
    const data = await res.json();
    return data.data;
};

export const createCategory = async (name: string) => {
    const res = await fetch(`${API_URL}/categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
    });
    if (!res.ok) throw new Error('Failed to create category');
    const data = await res.json();
    return data.data.name;
};

export const deleteCategory = async (name: string) => {
    const res = await fetch(`${API_URL}/categories/${name}`, {
        method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete category');
    return true;
};

export const fetchRecentDeductionsCount = async () => {
    const res = await fetch(`${API_URL}/deductions/recent`);
    if (!res.ok) return 0;
    const data = await res.json();
    return data.data?.count || 0;
};
