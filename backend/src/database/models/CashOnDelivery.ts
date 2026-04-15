import mongoose from 'mongoose';
import { PAYMENT_STATUS } from '../../core/constants.js';

const cashOnDeliverySchema = new mongoose.Schema(
  {
    paymentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Payment',
      required: true,
    },

    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
    },

    collectedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },

    collectedAt: {
      type: Date,
      default: null,
    },

    status: {
      type: String,
      enum: Object.values(PAYMENT_STATUS),
      default: PAYMENT_STATUS.PENDING,
      required: true,
    },

    notes: {
      type: String,
      trim: true,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('CashOnDelivery', cashOnDeliverySchema);