import mongoose from 'mongoose';
import { PAYMENT_METHODS, PAYMENT_STATUS } from '../../core/constants.js';

const paymentSchema = new mongoose.Schema(
  {
    orderId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Order', 
        required: true, 
    },
    amount: { 
        type: Number, 
        required: true, 
        min: 0, 
    },
    method: { 
        type: String, 
        required: true, 
        enum: Object.values(PAYMENT_METHODS),
    },
    status: { 
        type: String, 
        required: true, 
        enum: Object.values(PAYMENT_STATUS),
        default: PAYMENT_STATUS.PENDING,
    },
    provider: { 
        type: String, 
        default: null, 
        trim: true, 
    },
    transactionRef: { 
        type: String, 
        default: null, 
        trim: true, 
    },
    paidAt: { 
        type: Date, 
        default: null, 
    },
  },
  { 
    timestamps: true, 
   },
);

export default mongoose.model('Payment', paymentSchema);