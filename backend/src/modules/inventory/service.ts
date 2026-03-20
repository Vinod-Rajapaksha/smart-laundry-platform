import { InventoryModel, CategoryModel, IInventoryItem, ICategory } from '../../database/models/Inventory.js';

export class InventoryService {
    // Categories
    static async getCategories(): Promise<ICategory[]> {
        return CategoryModel.find();
    }

    static async createCategory(name: string): Promise<ICategory> {
        return CategoryModel.create({ name });
    }

    static async deleteCategory(name: string): Promise<void> {
        await CategoryModel.findOneAndDelete({ name });
    }

    // Items
    static async getItems(): Promise<IInventoryItem[]> {
        return InventoryModel.find();
    }

    static async createItem(data: Partial<IInventoryItem>): Promise<IInventoryItem> {
        return InventoryModel.create(data);
    }

    static async updateItem(itemId: string, data: Partial<IInventoryItem>): Promise<IInventoryItem | null> {
        return InventoryModel.findOneAndUpdate({ itemId }, data, { new: true });
    }

    static async deleteItem(itemId: string): Promise<void> {
        await InventoryModel.findOneAndDelete({ itemId });
    }
}
