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

export const updateInventoryItem = async (id: string, item: Partial<InventoryItem>) => {
    const res = await fetch(`${API_URL}/items/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
    });
    if (!res.ok) throw new Error('Failed to update item');
    const data = await res.json();
    return data.data;
};

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
