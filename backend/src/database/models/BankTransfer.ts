import mongoose from 'mongoose';
import { BANK_VERIFICATION_STATUS, OCR_STATUS } from '../../core/constants.js';

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
    systemRefId: { 
        type: String, 
        required: true, 
        unique: true,
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
        enum: Object.values(BANK_VERIFICATION_STATUS),
        default: BANK_VERIFICATION_STATUS.PENDING,
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
    isSuspicious: {
        type: Boolean,
        default: false,
    },
    internalNotes: {
        type: String,
        default: null,
        trim: true,
    },
    ocrText: {
        type: String,
        default: null,
    },
    ocrConfidence: {
        type: Number,
        default: 0,
    },
    ocrStatus: {
        type: String,
        enum: Object.values(OCR_STATUS),
        default: OCR_STATUS.PENDING,
    },
  },
  { 
    timestamps: true, 
   },
);

export default mongoose.model('BankTransfer', bankTransferSchema);