import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    orderNo: { 
      type: String, 
      required: true, 
      unique: true, 
      trim: true, 
    },
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true, 
    },
    updateBy: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      default: null, 
    },
    serviceId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Service', 
      required: true, 
    },
    weightKg: { 
      type: Number, 
      min: 0, 
      default: null, 
    },
    status: { 
      type: String, required: true, trim: true },
    reservedDateTime: { 
      type: Date, 
      default: null, 
    },
    pickupAddress: { 
      type: String, 
      trim: true, 
      default: null, 
    },
    deliveryAddress: { 
      type: String, 
      trim: true, 
      default: null, 
    },
    notes: { 
      type: String, 
      trim: true, 
      default: null, 
    },
    subtotal: { 
      type: Number, 
      default: 0, 
      min: 0, 
    },
    extraFee: { 
      type: Number, 
      default: 0, 
      min: 0, 
    },
    discountTotal: { 
      type: Number, 
      default: 0, 
      min: 0,
    },
    deliveryFee: { 
      type: Number, 
      default: 0, 
      min: 0, 
    },
    totalAmount: { 
      type: Number, 
      default: 0, 
      min: 0, 
    },
    paymentMethod: { 
      type: String, 
      required: true, 
      trim: true, 
    },
    paymentStatus: { 
      type: String, 
      required: true, 
      trim: true, 
    },
  },
  { 
    timestamps: true, 
  },
);

export default mongoose.model('Order', orderSchema);