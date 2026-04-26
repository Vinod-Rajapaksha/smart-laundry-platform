import mongoose from 'mongoose';

const serviceCategorySchema = new mongoose.Schema(
  {
    name: { 
        type: String, 
        required: true, 
        trim: true, 
    },
    price: { 
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

export default mongoose.model('ServiceCategory', serviceCategorySchema);