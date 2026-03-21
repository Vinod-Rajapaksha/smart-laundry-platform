import RevenueModel, { IRevenue } from '../../database/models/Revenue.js';
import ExpenseModel, { IExpense } from '../../database/models/Expense.js';

interface FinanceEntry {
  date: string;
  name: string;
  amount: number;
}

export const addRevenue = async (entry: FinanceEntry): Promise<IRevenue> => {
  const revenue = new RevenueModel({
    date: entry.date,
    name: entry.name,
    amount: entry.amount,
  });
  await revenue.save();
  return revenue;
};

export const addExpense = async (entry: FinanceEntry): Promise<IExpense> => {
  const expense = new ExpenseModel({
    date: entry.date,
    name: entry.name,
    amount: entry.amount,
  });
  await expense.save();
  return expense;
};
