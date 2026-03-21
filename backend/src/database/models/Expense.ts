import mongoose, { Schema, Document } from 'mongoose';

export interface IExpense extends Document {
  date: Date;
  name: string;
  amount: number;
  type: 'expense';
}

const ExpenseSchema: Schema = new Schema({
  date: { type: Date, required: true },
  name: { type: String, required: true },
  amount: { type: Number, required: true },
  type: { type: String, enum: ['expense'], default: 'expense', required: true },
}, { timestamps: true });

export default mongoose.model<IExpense>('Expense', ExpenseSchema, 'finance');
