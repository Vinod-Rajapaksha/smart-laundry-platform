import mongoose, { Document, Schema } from 'mongoose';

export interface IRevenue extends Document {
  name: string;
  amount: number;
  date: Date;
  sourceType?: string;
  type: 'revenue';
}

const revenueSchema: Schema = new mongoose.Schema(
  {
    name: {
        type: String,
        required: true,
        trim: true,
    },
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
      default: 'revenue',
        trim: true,
    },
    type: {
        type: String,
        enum: ['revenue'],
        default: 'revenue',
        required: true,
    },
  },
  { 
    timestamps: true, 
  },
);

export default mongoose.model<IRevenue>('Revenue', revenueSchema, 'finance');
