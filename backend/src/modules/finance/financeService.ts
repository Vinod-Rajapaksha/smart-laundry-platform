export const getAllRevenues = async (): Promise<IRevenue[]> => {
  // Find all documents in the 'finance' collection with type 'revenue'
  return RevenueModel.find({ type: 'revenue' }).sort({ date: -1 });
};

export const getAllExpenses = async (): Promise<IExpense[]> => {
  // Find all documents in the 'finance' collection with type 'expense'
  return ExpenseModel.find({ type: 'expense' }).sort({ date: -1 });
};
import RevenueModel, { IRevenue } from '../../database/models/Revenue.js';
import ExpenseModel, { IExpense } from '../../database/models/Expense.js';

interface FinanceEntry {
  date: string;
  name: string;
  amount: number;
}

export const addRevenue = async (entry: FinanceEntry): Promise<IRevenue> => {
  console.log('addRevenue payload:', entry);
  const revenue = new RevenueModel({
    date: new Date(entry.date),
    name: entry.name,
    amount: entry.amount,
    type: 'revenue',
  });
  await revenue.save();
  return revenue;
};

export const addExpense = async (entry: FinanceEntry): Promise<IExpense> => {
  console.log('addExpense payload:', entry);
  const expense = new ExpenseModel({
    date: new Date(entry.date),
    name: entry.name,
    amount: entry.amount,
    type: 'expense',
  });
  await expense.save();
  return expense;
};
export const getFinanceSummary = async () => {
  // Get all revenues and expenses
  const revenues = await RevenueModel.find({ type: 'revenue' }).sort({ date: -1 });
  const expenses = await ExpenseModel.find({ type: 'expense' }).sort({ date: -1 });

  const totalRevenue = revenues.reduce((sum, r) => sum + (r.amount || 0), 0);
  const totalExpense = expenses.reduce((sum, e) => sum + (e.amount || 0), 0);
  const netProfit = totalRevenue - totalExpense;

  // Calculate growth percent (last month vs previous month)
  let growthPercent = 0;
  if (revenues.length > 0) {
    const now = new Date();
    const lastMonth = now.getMonth();
    const lastMonthYear = now.getFullYear();
    const prevMonth = lastMonth === 0 ? 11 : lastMonth - 1;
    const prevMonthYear = lastMonth === 0 ? lastMonthYear - 1 : lastMonthYear;

    const lastMonthRevenue = revenues.filter(r => {
      const d = new Date(r.date);
      return d.getMonth() === lastMonth && d.getFullYear() === lastMonthYear;
    }).reduce((sum, r) => sum + (r.amount || 0), 0);
    const prevMonthRevenue = revenues.filter(r => {
      const d = new Date(r.date);
      return d.getMonth() === prevMonth && d.getFullYear() === prevMonthYear;
    }).reduce((sum, r) => sum + (r.amount || 0), 0);
    if (prevMonthRevenue > 0) {
      growthPercent = Math.round(((lastMonthRevenue - prevMonthRevenue) / prevMonthRevenue) * 100);
    }
  }

  // Insights (static for now, can be made dynamic)
  const insights = [
    'Revenue increased steadily over last 3 months.',
    'Staff salaries are the highest expense category.',
    'Profit margin is currently 38%.',
    'Consider reducing electricity consumption to improve margin.'
  ];

  return { totalRevenue, totalExpense, netProfit, growthPercent, insights };
};

