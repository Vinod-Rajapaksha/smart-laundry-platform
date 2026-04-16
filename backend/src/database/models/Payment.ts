import mongoose from 'mongoose';

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
        trim: true, 
    },
    status: { 
        type: String, 
        required: true, 
        trim: true, 
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