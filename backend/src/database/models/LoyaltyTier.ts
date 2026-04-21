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
    discountType: {
        type: String,
        enum: ['PERCENTAGE', 'FIXED'],
        default: 'PERCENTAGE',
    },
    discountValue: { 
        type: Number, 
        required: true, 
        min: 0, 
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