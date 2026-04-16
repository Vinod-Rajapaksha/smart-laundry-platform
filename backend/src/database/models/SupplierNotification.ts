import mongoose, { Schema, Document } from "mongoose";

export interface ISupplierNotification extends Document {
    supplierId: mongoose.Types.ObjectId;
    itemId: string;
    itemName: string;
    quantityRequired: string;
    recipientEmail: string;
    sentAt: Date;
    status: 'success' | 'failed';
}

const SupplierNotificationSchema = new Schema<ISupplierNotification>(
    {
        supplierId: { type: Schema.Types.ObjectId, ref: "Supplier", required: true },
        itemId: { type: String, required: true },
        itemName: { type: String, required: true },
        quantityRequired: { type: String, required: true },
        recipientEmail: { type: String, required: true },
        sentAt: { type: Date, default: Date.now },
        status: { type: String, enum: ['success', 'failed'], default: 'success' },
    },
    { timestamps: true }
);

export const SupplierNotificationModel = mongoose.model<ISupplierNotification>(
    "SupplierNotification",
    SupplierNotificationSchema
);
