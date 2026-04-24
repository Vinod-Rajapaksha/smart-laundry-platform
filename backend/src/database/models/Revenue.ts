import mongoose from 'mongoose';

const revenueSchema = new mongoose.Schema(
  {
    amount: { 
        type: Number, 
        required: true, 
        min: 0, 
    },
    date: { 
        type: Date, 
        required: true, 
    },
    sourceType: { 
        type: String, 
        required: true, 
        trim: true, 
    },
  },
  { 
    timestamps: true, 
  },
);

export default mongoose.model('Revenue', revenueSchema);