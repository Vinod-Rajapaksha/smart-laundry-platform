import mongoose, { Schema, Document } from 'mongoose';

export interface IRevenue extends Document {
  date: Date;
  name: string;
  amount: number;
  type: 'revenue';
}

const RevenueSchema: Schema = new Schema({
  date: { type: Date, required: true },
  name: { type: String, required: true },
  amount: { type: Number, required: true },
  type: { type: String, enum: ['revenue'], default: 'revenue', required: true },
}, { timestamps: true });

export default mongoose.model<IRevenue>('Revenue', RevenueSchema, 'finance');
