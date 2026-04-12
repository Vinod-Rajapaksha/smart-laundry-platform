import { InventoryModel, CategoryModel, InventoryTransactionModel, IInventoryItem, ICategory } from '../../database/models/Inventory.js';

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

    static async deductStock(itemId: string, deductValue: number, deductUnit: string): Promise<IInventoryItem> {
        const item = await InventoryModel.findOne({ itemId });
        if (!item) throw new Error("Item not found");

        const stockParts = item.stock.trim().split(/\s+/);
        const stockVal = parseFloat(stockParts[0]);
        const stockUnit = stockParts[1] || 'units';

        const normalize = (val: number, unit: string) => {
            const u = unit.toLowerCase();
            if (u === 'l') return { type: 'vol', base: val * 1000 };
            if (u === 'ml') return { type: 'vol', base: val };
            if (u === 'kg') return { type: 'weight', base: val * 1000 };
            if (u === 'g') return { type: 'weight', base: val };
            if (u === 'units' || u === 'unit') return { type: 'count', base: val };
            throw new Error(`Unknown unit: ${unit}`);
        };

        const currentNorm = normalize(stockVal, stockUnit);
        const deductNorm = normalize(deductValue, deductUnit);

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

        const thresholdParts = item.threshold.trim().split(/\s+/);
        const thresholdVal = parseFloat(thresholdParts[0]);
        const thresholdUnit = thresholdParts[1] || 'units';

        try {
            const thresholdNorm = normalize(thresholdVal, thresholdUnit);
            if (newBaseValue <= thresholdNorm.base && !item.lowStockEmailSent && item.supplierId) {
                // Set the flag to prevent duplicate emails
                item.lowStockEmailSent = true;
                await item.save();

                // Trigger the Supplier Management webhook
                fetch('http://localhost:5001/api/suppliers/notify-low-stock', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        supplierId: item.supplierId,
                        itemId: item.id,
                        itemName: item.name,
                        currentStock: newBaseValue,
                        reorderLevel: thresholdNorm.base
                    })
                }).catch(err => console.error('Failed to trigger supplier webhook:', err));
            }
        } catch (err) {
            console.error('Failed to parse threshold or trigger email', err);
        }

        return item;
    }

    static async restockItem(itemId: string, restockValue: number, restockUnit: string): Promise<IInventoryItem> {
        const item = await InventoryModel.findOne({ itemId });
        if (!item) throw new Error("Item not found");

        const stockParts = item.stock.trim().split(/\s+/);
        const stockVal = parseFloat(stockParts[0]);
        const stockUnit = stockParts[1] || 'units';

        const normalize = (val: number, unit: string) => {
            const u = unit.toLowerCase();
            if (u === 'l') return { type: 'vol', base: val * 1000 };
            if (u === 'ml') return { type: 'vol', base: val };
            if (u === 'kg') return { type: 'weight', base: val * 1000 };
            if (u === 'g') return { type: 'weight', base: val };
            if (u === 'units' || u === 'unit') return { type: 'count', base: val };
            throw new Error(`Unknown unit: ${unit}`);
        };

        const currentNorm = normalize(stockVal, stockUnit);
        const restockNorm = normalize(restockValue, restockUnit);

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
