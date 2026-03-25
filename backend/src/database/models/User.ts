import mongoose from 'mongoose';

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
  },
  {
    timestamps: true,
  },
);

export default mongoose.model('User', userSchema);