export interface InventoryErrors {
    id?: string;
    name?: string;
    category?: string;
    price?: string;
    stock?: string;
    threshold?: string;
}

export const validateInventoryItem = (item: any): InventoryErrors => {
    const errors: InventoryErrors = {};

    if (!item.id || typeof item.id !== 'string' || item.id.trim() === '') {
        errors.id = 'Item ID is required';
    } else if (!/^[\w-]+$/.test(item.id)) {
        // Allows alphanumeric and dashes, e.g. "001", "INV-01"
        errors.id = 'Invalid format. Use letters, numbers, and dashes.';
    }

    if (!item.name || typeof item.name !== 'string' || item.name.trim() === '') {
        errors.name = 'Item Name is required';
    } else if (item.name.length < 3) {
        errors.name = 'Name must be at least 3 characters long';
    }

    if (!item.category || typeof item.category !== 'string' || item.category.trim() === '') {
        errors.category = 'Category is required';
    }

    const priceValue = parseFloat(item.price);
    if (item.price === undefined || item.price === null || isNaN(priceValue) || priceValue <= 0) {
        errors.price = 'Price must be a valid number greater than 0';
    }

    // Regex to validate formats like "5L", "7Kg", "5 units"
    const stockRegex = /^\d+(\s*(L|Kg|units|ml|g|pcs))?$/i;

    if (!item.stock || typeof item.stock !== 'string' || item.stock.trim() === '') {
        errors.stock = 'Current Stock is required';
    } else if (!stockRegex.test(item.stock)) {
        errors.stock = 'Format e.g., "5L", "7Kg", or "5 units"';
    }

    if (!item.threshold || typeof item.threshold !== 'string' || item.threshold.trim() === '') {
        errors.threshold = 'Threshold is required';
    } else if (!stockRegex.test(item.threshold)) {
        errors.threshold = 'Format e.g., "2L", "5Kg"';
    }

    return errors;
};
