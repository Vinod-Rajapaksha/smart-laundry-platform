/// <reference types="jest" />
import { validateInventoryItem } from '../inventoryValidation';

describe('validateInventoryItem', () => {
    it('should return no errors for a valid complete item', () => {
        const validItem = {
            id: '001',
            name: 'Lavender Liquid',
            category: 'Detergents',
            price: 75,
            stock: '5L',
            threshold: '2L',
        };
        const errors = validateInventoryItem(validItem);
        expect(Object.keys(errors).length).toBe(0);
    });

    it('should return errors for empty fields', () => {
        const emptyItem = {
            id: '',
            name: '',
            category: '',
            price: '',
            stock: '',
            threshold: '',
        };
        const errors = validateInventoryItem(emptyItem);
        expect(errors.id).toBeDefined();
        expect(errors.name).toBeDefined();
        expect(errors.category).toBeDefined();
        expect(errors.price).toBeDefined();
        expect(errors.stock).toBeDefined();
        expect(errors.threshold).toBeDefined();
    });

    it('should return error for invalid price', () => {
        const item = {
            id: '001',
            name: 'Test Item',
            category: 'Test',
            price: -10, // Invalid price
            stock: '5L',
            threshold: '2L',
        };
        const errors = validateInventoryItem(item);
        expect(errors.price).toBe('Price must be a valid number greater than 0');
    });

    it('should validate correctly formatted stock and threshold values', () => {
        const item = {
            id: '002',
            name: 'Test Item',
            category: 'Test',
            price: 10,
            stock: 'invalid-string', // Validation should fail here
            threshold: '5 units', // Validation should pass here
        };
        const errors = validateInventoryItem(item);
        expect(errors.stock).toBe('Format e.g., "5L", "7Kg", or "5 units"');
        expect(errors.threshold).toBeUndefined();
    });
});
