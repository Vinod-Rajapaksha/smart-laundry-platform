import mongoose from 'mongoose';

const voucherSchema = new mongoose.Schema(
  {
    code: { 
        type: String, 
        required: true, 
        unique: true, 
        trim: true, 
    },
    voucherType: { 
        type: String, 
        required: true, 
        trim: true, 
    },
    allowedTierIds: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'LoyaltyTier', 
    }],
    discountType: { 
        type: String, 
        required: true, 
        trim: true, 
    },
    discountValue: { 
        type: Number, 
        required: true, 
        min: 0, 
    },
    minOrderAmount: { 
        type: Number, 
        default: 0, 
        min: 0, 
    },
    maxDiscount: { 
        type: Number, 
        default: null, 
        min: 0, 
    },
    usageLimitPerUser: { 
        type: Number, 
        default: null, 
        min: 1, 
    },
    usageLimitTotal: { 
        type: Number, 
        default: null, 
        min: 1, 
    },
    startDate: { 
        type: Date, 
        required: true, 
    },
    endDate: { 
        type: Date, 
        required: true, 
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

export default mongoose.model('Voucher', voucherSchema);