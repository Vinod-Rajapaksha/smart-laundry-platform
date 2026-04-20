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
    options: [
      {
        inventoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Inventory' },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        categoryName: { type: String, required: true },
      }
    ],
    staffId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      default: null 
    },
    pickupLat: { type: Number, default: null },
    pickupLng: { type: Number, default: null },
    deliveryLat: { type: Number, default: null },
    deliveryLng: { type: Number, default: null },
    voucherId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Voucher', 
      default: null 
    },
    isActive: {
      type: Boolean,
      default: true,
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

export default mongoose.model('Order', orderSchema);