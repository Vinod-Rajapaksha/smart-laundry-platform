import RevenueModel from '../../database/models/Revenue.js';
import ExpenseModel from '../../database/models/Expense.js';

export const getReportData = async (options: {
  from: string;
  to: string;
  fields: string[];
}) => {
  const { from, to, fields } = options;
  const fromDate = new Date(from);
  const toDate = new Date(to);
  const result: any = {};

  if (fields.includes('totalRevenue')) {
    const revenues = await RevenueModel.find({
      type: 'revenue',
      date: { $gte: fromDate, $lte: toDate },
    }).sort({ date: -1 });
    result.totalRevenue = revenues.reduce((sum, r) => sum + (r.amount || 0), 0);
    result.revenueList = revenues.map(r => ({ name: r.name, amount: r.amount, date: r.date }));
  }

  if (fields.includes('totalExpense')) {
    const expenses = await ExpenseModel.find({
      type: 'expense',
      date: { $gte: fromDate, $lte: toDate },
    }).sort({ date: -1 });
    result.totalExpense = expenses.reduce((sum, e) => sum + (e.amount || 0), 0);
    result.expenseList = expenses.map(e => ({ name: e.name, amount: e.amount, date: e.date }));
  }

  // Add more fields as needed

  return result;
};
