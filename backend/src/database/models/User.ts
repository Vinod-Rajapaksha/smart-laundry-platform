import mongoose from 'mongoose';
import { LOYALTY_TIER_NAME } from '../../core/constants.js';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    telephone: {
      type: String,
      required: true,
      trim: true,
    },
    avatar: {
      type: String,
      default: null,
    },
    address: {
      type: String,
      trim: true,
    },
    role: {
      type: String,
      enum: ['ADMIN', 'STAFF', 'CUSTOMER'],
      default: 'CUSTOMER',
    },
    salary: {
      type: Number,
      min: 0,
      default: null,
    },
    staffType: {
      type: String,
      enum: ['DELIVERY', 'STORE', 'BOTH'],
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    refreshToken: {
      type: String,
      default: null,
    },
    otp: {
      type: String,
      default: null,
    },
    otpExpiresAt: {
      type: Date,
      default: null,
    },
    loyaltyPoints: {
      type: Number,
      default: 0,
      min: 0,
    },
    membership: {
      level: {
        type: String,
        enum: Object.values(LOYALTY_TIER_NAME),
        default: LOYALTY_TIER_NAME.BRONZE,
        uppercase: true,
      },
      validUntil: {
        type: Date,
        default: null,
      },
      pointsToNextLevel: {
        type: Number,
        default: 500,
      }
    },
    pushToken: {
      type: String,
      default: null,
      trim: true,
    }
  },
  {
    timestamps: true,
  },
);

export default mongoose.model('User', userSchema);