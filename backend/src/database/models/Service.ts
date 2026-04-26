import mongoose from 'mongoose';
import { UNITS } from '../../core/constants.js';

const serviceSchema = new mongoose.Schema(
  {
    categoryId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'ServiceCategory', 
        required: true, 
    },
    name: { 
        type: String, 
        required: true, 
        trim: true, 
    },
    price: { 
        type: Number, 
        required: true, 
        min: 0, 
    },
    unit: {
        type: String,
        enum: Object.values(UNITS),
        default: UNITS.KG,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    isPopular: {
        type: Boolean,
        default: false,
    },
    description: {
        type: String,
        trim: true,
        default: null,
    },
    inventoryItems: [
        {
            itemId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Inventory',
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
                min: 0.01,
            },
        },
    ],
  },
  { 
    timestamps: true, 
  },
);

export default mongoose.model('Service', serviceSchema);