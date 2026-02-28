import mongoose from 'mongoose';

const bankTransferSchema = new mongoose.Schema(
  {
    paymentId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Payment', 
        required: true,
    },
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true, 
    },
    bankName: { 
        type: String, 
        required: true, 
        trim: true, 
    },
    referenceNo: { 
        type: String, 
        required: true, 
        trim: true, 
    },
    slipImageUrl: { 
        type: String, 
        required: true,
        trim: true, 
    },
    submittedAt: { 
        type: Date, 
        default: Date.now, 
    },
    verifyStatus: { 
        type: String, 
        required: true, 
        trim: true, 
    },
    verifiedBy: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        default: null, 
    },
    verifiedAt: { 
        type: Date, 
        default: null, 
    },
    rejectReason: { 
        type: String, 
        default: null, 
        trim: true, 
    },
  },
  { 
    timestamps: true, 
   },
);

export default mongoose.model('BankTransfer', bankTransferSchema);