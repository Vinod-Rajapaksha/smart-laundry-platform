import mongoose from 'mongoose';

const inventorySchema = new mongoose.Schema(
  {
    categoryName: { 
        type: String, 
        required: true, 
        trim: true, 
    },
    name: { 
        type: String, 
        required: true, 
        trim: true, 
    },
    sku: { 
        type: String, 
        trim: true, 
        default: null, 
    },
    unit: { 
        type: String, 
        enum: ['PCS', 'KG', 'L'], 
        required: true, 
    },
    unitPrice: { 
        type: Number, 
        required: true, 
        min: 0, 
    },
    qtyInStock: { 
        type: Number, 
        default: 0, 
        min: 0, 
    },
    reorderLevel: { 
        type: Number, 
        default: 0, 
        min: 0, 
    },
    isActive: { 
        type: Boolean, 
        default: true, 
    },
  },
  { 
    timestamps: true, 
   },
);

export default mongoose.model('Inventory', inventorySchema);