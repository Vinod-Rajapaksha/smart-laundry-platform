import RevenueModel, { IRevenue } from '../../database/models/Revenue.js';
import ExpenseModel, { IExpense } from '../../database/models/Expense.js';

const revenueFilter = {
  $or: [{ type: 'revenue' }, { sourceType: 'revenue' }],
};

const normalizeFinanceEntry = (entry: FinanceEntry) => {
  const date = new Date(entry.date);
  const name = entry.name?.trim();
  const amount = Number(entry.amount);

  if (Number.isNaN(date.getTime())) {
    throw new Error('Invalid date');
  }

  if (!name) {
    throw new Error('Name is required');
  }

  if (!Number.isFinite(amount) || amount < 0) {
    throw new Error('Amount must be a valid non-negative number');
  }

  return { date, name, amount };
};


export const getAllRevenues = async (): Promise<IRevenue[]> => {
  return RevenueModel.find(revenueFilter).sort({ date: -1 });
};

export const getAllExpenses = async (): Promise<IExpense[]> => {
  // Find all documents in the 'finance' collection with type 'expense'
  return ExpenseModel.find({ type: 'expense' }).sort({ date: -1 });
};


interface FinanceEntry {
  date: string | Date;
  name: string;
  amount: number | string;
}

export const addRevenue = async (entry: FinanceEntry): Promise<IRevenue> => {
  const normalized = normalizeFinanceEntry(entry);
  const revenue = new RevenueModel({
    date: normalized.date,
    name: normalized.name,
    amount: normalized.amount,
    type: 'revenue',
    sourceType: 'revenue',
  });
  await revenue.save();
  return revenue;
};

export const addExpense = async (entry: FinanceEntry): Promise<IExpense> => {
  const normalized = normalizeFinanceEntry(entry);
  const expense = new ExpenseModel({
    date: normalized.date,
    name: normalized.name,
    amount: normalized.amount,
    type: 'expense',
  });
  await expense.save();
  return expense;
};
export const getFinanceSummary = async (month?: string) => {
  let revenueQuery: any = { ...revenueFilter };
  let expenseQuery: any = { type: 'expense' };

  let filterMonth: number | null = null;
  let filterYear: number | null = null;
  if (month) {
    // month format: YYYY-MM
    const [yearStr, monthStr] = month.split('-');
    filterYear = parseInt(yearStr, 10);
    filterMonth = parseInt(monthStr, 10) - 1; // JS months are 0-based
    if (!isNaN(filterYear) && !isNaN(filterMonth)) {
      // Set date range for the month
      const start = new Date(filterYear, filterMonth, 1);
      const end = new Date(filterYear, filterMonth + 1, 1);
      revenueQuery.date = { $gte: start, $lt: end };
      expenseQuery.date = { $gte: start, $lt: end };
    }
  }

  const revenues = await RevenueModel.find(revenueQuery).sort({ date: -1 });
  const expenses = await ExpenseModel.find(expenseQuery).sort({ date: -1 });

  const totalRevenue = revenues.reduce((sum, r) => sum + (r.amount || 0), 0);
  const totalExpense = expenses.reduce((sum, e) => sum + (e.amount || 0), 0);
  const netProfit = totalRevenue - totalExpense;

  // Calculate growth percent (previous month vs month before that)
  let growthPercent = 0;
  if (filterMonth !== null && filterYear !== null) {
    // Calculate for selected month and previous month
    const prevMonth = filterMonth === 0 ? 11 : filterMonth - 1;
    const prevMonthYear = filterMonth === 0 ? filterYear - 1 : filterYear;
    const prevStart = new Date(prevMonthYear, prevMonth, 1);
    const prevEnd = new Date(prevMonthYear, prevMonth + 1, 1);
    const prevMonthRevenues = await RevenueModel.find({
      ...revenueFilter,
      date: { $gte: prevStart, $lt: prevEnd },
    });
    const prevMonthRevenue = prevMonthRevenues.reduce((sum, r) => sum + (r.amount || 0), 0);
    if (prevMonthRevenue > 0) {
      growthPercent = Math.round(((totalRevenue - prevMonthRevenue) / prevMonthRevenue) * 100);
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

