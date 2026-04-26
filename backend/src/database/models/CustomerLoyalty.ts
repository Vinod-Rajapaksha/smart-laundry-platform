import mongoose from 'mongoose';

const customerLoyaltySchema = new mongoose.Schema(
  {
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true, 
        unique: true, 
    },
    tierId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'LoyaltyTier', 
        required: true, 
    },
    points: { 
        type: Number, 
        default: 0, 
        min: 0, 
    },
    totalSpent: { 
        type: Number, 
        default: 0, 
        min: 0, 
    },
  },
  { 
    timestamps: true, 
   },
);

export default mongoose.model('CustomerLoyalty', customerLoyaltySchema);