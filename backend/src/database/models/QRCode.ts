import mongoose from 'mongoose';

const qrCodeSchema = new mongoose.Schema(
  {
    orderId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Order', 
        required: true, 
        unique: true, 
    },
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true, 
    },
    codeId: { 
        type: String, 
        required: true, 
        unique: true, 
        trim: true, 
    },
    isUsed: { 
        type: Boolean, 
        default: false, 
    },
    usedAt: { 
        type: Date, 
        default: null, 
    },
    expiresAt: { 
        type: Date, 
        required: true, 
    },
  },
  { 
    timestamps: true, 
  },
);

export default mongoose.model('QRCode', qrCodeSchema);