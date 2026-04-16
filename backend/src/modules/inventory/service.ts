import { InventoryModel, CategoryModel, InventoryTransactionModel, IInventoryItem, ICategory } from '../../database/models/Inventory.js';
import { SupplierModel } from '../../database/models/Supplier.js';
import { SupplierNotificationModel } from '../../database/models/SupplierNotification.js';
import { sendLowStockEmail } from '../../utils/mailer.js';

export class InventoryService {
    // Helpers
    private static normalizeStock(val: number, unit: string) {
        const u = unit.toLowerCase();
        if (u === 'l') return { type: 'vol', base: val * 1000 };
        if (u === 'ml') return { type: 'vol', base: val };
        if (u === 'kg') return { type: 'weight', base: val * 1000 };
        if (u === 'g') return { type: 'weight', base: val };
        if (u === 'units' || u === 'unit') return { type: 'count', base: val };
        throw new Error(`Unknown unit: ${unit}`);
    }

    private static async checkLowStockAndNotify(item: IInventoryItem) {
        const stockParts = item.stock.trim().split(/\s+/);
        const stockVal = parseFloat(stockParts[0]);
        const stockUnit = stockParts[1] || 'units';

        const thresholdParts = item.threshold.trim().split(/\s+/);
        const thresholdVal = parseFloat(thresholdParts[0]);
        const thresholdUnit = thresholdParts[1] || 'units';

        try {
            const currentNorm = this.normalizeStock(stockVal, stockUnit);
            const thresholdNorm = this.normalizeStock(thresholdVal, thresholdUnit);

            // Notify if below threshold and not already notified
            if (currentNorm.base <= thresholdNorm.base && !item.lowStockEmailSent && item.supplierId) {
                // Set the flag to prevent duplicate emails
                item.lowStockEmailSent = true;
                await item.save();

                // Fetch supplier details
                const supplier = await SupplierModel.findById(item.supplierId);
                if (supplier && supplier.email) {
                    const quantityRequired = `${(thresholdNorm.base * 2) / (stockUnit.toLowerCase() === 'l' || stockUnit.toLowerCase() === 'kg' ? 1000 : 1)} ${stockUnit}`;
                    await sendLowStockEmail(supplier.email, item.name, quantityRequired);

                    // Log the notification
                    await SupplierNotificationModel.create({
                        supplierId: supplier._id,
                        itemId: item.itemId,
                        itemName: item.name,
                        quantityRequired,
                        recipientEmail: supplier.email,
                        status: 'success'
                    });
                }
            } else if (currentNorm.base > thresholdNorm.base && item.lowStockEmailSent) {
                // Reset flag if manually restocked via update
                item.lowStockEmailSent = false;
                await item.save();
            }
        } catch (err) {
            console.error('Failed to trigger low stock check', err);
        }
    }

    // Categories
    static async getCategories(): Promise<ICategory[]> {
        return CategoryModel.find();
    }

    static async createCategory(name: string): Promise<ICategory> {
        return CategoryModel.create({ name });
    }

    static async deleteCategory(name: string): Promise<void> {
        const result = await CategoryModel.findOneAndDelete({ name });
        if (!result) throw new Error("Category not found");
    }

    // Items
    static async getItems(): Promise<IInventoryItem[]> {
        return InventoryModel.find();
    }

    static async createItem(data: Partial<IInventoryItem>): Promise<IInventoryItem> {
        const item = await InventoryModel.create(data);
        await this.checkLowStockAndNotify(item);
        return item;
    }

    static async updateItem(itemId: string, data: Partial<IInventoryItem>): Promise<IInventoryItem | null> {
        const item = await InventoryModel.findOne({ itemId });
        if (!item) return null;

        // Apply updates
        Object.assign(item, data);
        await item.save();

        // Trigger check after manual update
        await this.checkLowStockAndNotify(item);
        
        return item;
    }

    static async deleteItem(itemId: string): Promise<void> {
        const result = await InventoryModel.findOneAndDelete({ itemId });
        if (!result) throw new Error("Item not found");
    }

    static async deductStock(itemId: string, deductValue: number, deductUnit: string): Promise<IInventoryItem> {
        const item = await InventoryModel.findOne({ itemId });
        if (!item) throw new Error("Item not found");

        const stockParts = item.stock.trim().split(/\s+/);
        const stockVal = parseFloat(stockParts[0]);
        const stockUnit = stockParts[1] || 'units';

        const currentNorm = this.normalizeStock(stockVal, stockUnit);
        const deductNorm = this.normalizeStock(deductValue, deductUnit);

        if (currentNorm.type !== deductNorm.type) {
            throw new Error(`Unit mismatch: Cannot deduct ${deductUnit} from ${stockUnit}`);
        }

        const newBaseValue = currentNorm.base - deductNorm.base;

        if (newBaseValue < 0) {
            throw new Error(`Insufficient stock: Have ${item.stock}, tried to deduct ${deductValue} ${deductUnit}`);
        }

        let newStockVal = newBaseValue;
        const u = stockUnit.toLowerCase();
        if (u === 'l' || u === 'kg') {
            newStockVal = newBaseValue / 1000;
        }

        item.stock = `${parseFloat(newStockVal.toFixed(3))} ${stockUnit}`;
        await item.save();

        await InventoryTransactionModel.create({
            itemId: item.itemId,
            amount: deductValue,
            unit: deductUnit,
            type: 'deduction'
        });

        // Trigger check
        await this.checkLowStockAndNotify(item);

        return item;
    }

    static async deductStockByWeight(itemId: string, weightKg: number): Promise<IInventoryItem> {
        const item = await InventoryModel.findOne({ itemId });
        if (!item) throw new Error("Item not found");

        let deductValue = 0;
        let deductUnit = "";
        const itemNameLower = item.name.toLowerCase();
        
        const isPowder = itemNameLower.includes('powder') || itemNameLower.includes('surf excel'); 
        const isLiquid = itemNameLower.includes('liquid') || itemNameLower.includes('comfort') || itemNameLower.includes('softener');

        if (isPowder) {
            deductValue = weightKg * 20;
            deductUnit = "g";
        } else if (isLiquid) {
            deductValue = weightKg * 15;
            deductUnit = "ml";
        } else {
            deductValue = weightKg * 15;
            deductUnit = "ml";
        }

        return this.deductStock(itemId, deductValue, deductUnit);
    }

    static async restockItem(itemId: string, restockValue: number, restockUnit: string): Promise<IInventoryItem> {
        const item = await InventoryModel.findOne({ itemId });
        if (!item) throw new Error("Item not found");

        const stockParts = item.stock.trim().split(/\s+/);
        const stockVal = parseFloat(stockParts[0]);
        const stockUnit = stockParts[1] || 'units';

        const currentNorm = this.normalizeStock(stockVal, stockUnit);
        const restockNorm = this.normalizeStock(restockValue, restockUnit);

        if (currentNorm.type !== restockNorm.type) {
            throw new Error(`Unit mismatch: Cannot restock ${restockUnit} into ${stockUnit}`);
        }

        const newBaseValue = currentNorm.base + restockNorm.base;

        let newStockVal = newBaseValue;
        const u = stockUnit.toLowerCase();
        if (u === 'l' || u === 'kg') {
            newStockVal = newBaseValue / 1000;
        }

        item.stock = `${parseFloat(newStockVal.toFixed(3))} ${stockUnit}`;
        
        // Reset low stock email flag when restocking
        item.lowStockEmailSent = false;
        
        await item.save();

        await InventoryTransactionModel.create({
            itemId: item.itemId,
            amount: restockValue,
            unit: restockUnit,
            type: 'restock'
        });

        return item;
    }

    static async getRecentDeductionsCount(): Promise<number> {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        return InventoryTransactionModel.countDocuments({ type: 'deduction', date: { $gte: sevenDaysAgo } });
    }
}
