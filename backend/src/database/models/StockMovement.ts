import mongoose from 'mongoose';

const stockMovementSchema = new mongoose.Schema(
    {
        itemId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Inventory',
            required: true,
        },
        type: {
            type: String,
            enum: ['IN', 'OUT', 'ADJUSTMENT'],
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
        },
        reason: {
            type: String,
            required: true,
            trim: true,
        },
        referenceId: {
            type: mongoose.Schema.Types.ObjectId,
            required: false,
        },
        performedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: false,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model('StockMovement', stockMovementSchema);
