import mongoose from 'mongoose';

const loyaltyTierSchema = new mongoose.Schema(
  {
    name: { 
        type: String, 
        required: true, 
        trim: true, 
    },
    minPoints: { 
        type: Number, 
        required: true, 
        min: 0, 
    },
    discountPercent: { 
        type: Number, 
        required: true, 
        min: 0, 
        max: 100, 
    },
    perks: { 
        type: [String], 
        default: [], 
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

export default mongoose.model('LoyaltyTier', loyaltyTierSchema);