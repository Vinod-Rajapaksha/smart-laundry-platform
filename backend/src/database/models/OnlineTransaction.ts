import mongoose from 'mongoose';

const onlineTransactionSchema = new mongoose.Schema(
  {
    paymentId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Payment', 
        required: true, 
    },
    gatewayOrderId: { 
        type: String, 
        required: true, 
        trim: true, 
    },
    gatewayPaymentId: { 
        type: String, 
        required: true, 
        trim: true, 
    },
    status: { 
        type: String, 
        required: true, 
        trim: true, 
    },
    rawResponse: { 
        type: Object, 
        default: {}, 
    },
  },
  { 
    timestamps: true,    
  },
);

export default mongoose.model('OnlineTransaction', onlineTransactionSchema);