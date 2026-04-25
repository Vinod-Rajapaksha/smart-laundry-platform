import mongoose from 'mongoose';

const inventoryCategorySchema = new mongoose.Schema(
  {
    name: { 
        type: String, 
        required: true, 
        trim: true, 
        unique: true,
    },
    description: {
        type: String,
        trim: true,
        default: null,
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

export default mongoose.model('InventoryCategory', inventoryCategorySchema);
