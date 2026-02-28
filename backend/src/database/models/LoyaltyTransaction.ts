import mongoose from 'mongoose';

const loyaltyTransactionSchema = new mongoose.Schema(
  {
    loyaltyId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'CustomerLoyalty', 
        required: true, 
    },
    type: { 
        type: String, 
        required: true, 
        trim: true, 
    },
    points: { 
        type: Number, 
        required: true, 
    },

    expiresAt: { 
        type: Date, 
        default: null, 
    },
  },
  { 
    timestamps: true, 
   },
);

export default mongoose.model('LoyaltyTransaction', loyaltyTransactionSchema);