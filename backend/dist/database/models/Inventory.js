import mongoose, { Schema } from "mongoose";
const CategorySchema = new Schema({
    name: { type: String, required: true, unique: true },
}, { timestamps: true });
export const CategoryModel = mongoose.model("Category", CategorySchema);
const InventorySchema = new Schema({
    itemId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: String, required: true },
    threshold: { type: String, required: true },
}, { timestamps: true });
export const InventoryModel = mongoose.model("Inventory", InventorySchema);
