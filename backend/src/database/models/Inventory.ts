import mongoose, { Schema, Document } from "mongoose";

export interface ICategory extends Document {
    name: string;
}

const CategorySchema = new Schema<ICategory>(
    {
        name: { type: String, required: true, unique: true },
    },
    { timestamps: true }
);

export const CategoryModel = mongoose.model<ICategory>("Category", CategorySchema);

export interface IInventoryItem extends Document {
    itemId: string;
    name: string;
    category: string;
    price: number;
    stock: string;
    threshold: string;
    supplierId?: string;
    lowStockEmailSent?: boolean;
}

const InventorySchema = new Schema<IInventoryItem>(
    {
        itemId: { type: String, required: true, unique: true },
        name: { type: String, required: true },
        category: { type: String, required: true },
        price: { type: Number, required: true },
        stock: { type: String, required: true },
        threshold: { type: String, required: true },
        supplierId: { type: String, required: false },
        lowStockEmailSent: { type: Boolean, default: false },
    },
    { timestamps: true }
);

export const InventoryModel = mongoose.model<IInventoryItem>("Inventory", InventorySchema);

export interface IInventoryTransaction extends Document {
    itemId: string;
    amount: number;
    unit: string;
    type: string;
    date: Date;
}

const InventoryTransactionSchema = new Schema<IInventoryTransaction>(
    {
        itemId: { type: String, required: true },
        amount: { type: Number, required: true },
        unit: { type: String, required: true },
        type: { type: String, required: true, default: 'deduction' },
        date: { type: Date, default: Date.now }
    },
    { timestamps: true }
);

export const InventoryTransactionModel = mongoose.model<IInventoryTransaction>("InventoryTransaction", InventoryTransactionSchema);
