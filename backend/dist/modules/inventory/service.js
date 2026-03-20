import { InventoryModel, CategoryModel } from '../../database/models/Inventory.js';
export class InventoryService {
    // Categories
    static async getCategories() {
        return CategoryModel.find();
    }
    static async createCategory(name) {
        return CategoryModel.create({ name });
    }
    static async deleteCategory(name) {
        await CategoryModel.findOneAndDelete({ name });
    }
    // Items
    static async getItems() {
        return InventoryModel.find();
    }
    static async createItem(data) {
        return InventoryModel.create(data);
    }
    static async updateItem(itemId, data) {
        return InventoryModel.findOneAndUpdate({ itemId }, data, { new: true });
    }
    static async deleteItem(itemId) {
        await InventoryModel.findOneAndDelete({ itemId });
    }
}
