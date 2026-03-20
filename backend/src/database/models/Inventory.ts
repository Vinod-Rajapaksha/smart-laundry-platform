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
}

const InventorySchema = new Schema<IInventoryItem>(
    {
        itemId: { type: String, required: true, unique: true },
        name: { type: String, required: true },
        category: { type: String, required: true },
        price: { type: Number, required: true },
        stock: { type: String, required: true },
        threshold: { type: String, required: true },
    },
    { timestamps: true }
);

export const InventoryModel = mongoose.model<IInventoryItem>("Inventory", InventorySchema);
