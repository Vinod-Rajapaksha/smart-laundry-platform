import PDFDocument from 'pdfkit';
import User from '../../database/models/User.js';
import Order from '../../database/models/Order.js';
import Revenue from '../../database/models/Revenue.js';
import Expense from '../../database/models/Expense.js';
import Report from '../../database/models/Report.js';
import { ORDER_STATUS } from '../../core/constants.js';
import { Response } from 'express';

// 1. Admin Dashboard
export const getDashboardKPIs = async () => {
  const [totalOrders, totalCustomers, pendingOrders, completedOrders] = await Promise.all([
    Order.countDocuments(),
    User.countDocuments({ role: 'CUSTOMER' }),
    Order.countDocuments({ status: { $nin: [ORDER_STATUS.DELIVERED, ORDER_STATUS.CANCELLED] } }),
    Order.countDocuments({ status: ORDER_STATUS.DELIVERED })
  ]);

  // Aggregate revenue for the last 6 months for the trend chart
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const revenueTrend = await Order.aggregate([
    { $match: { createdAt: { $gte: sixMonthsAgo }, status: ORDER_STATUS.DELIVERED } },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
        totalRevenue: { $sum: "$totalAmount" }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  return { totalOrders, totalCustomers, pendingOrders, completedOrders, revenueTrend };
};

// 2 & 3. Financial Analysis & Monthly Interaction
export const getMonthlyAnalysis = async (year: number, month: number) => {
  const startOfMonth = new Date(year, month - 1, 1);
  const endOfMonth = new Date(year, month, 0, 23, 59, 59);

  // Previous month for growth
  const startOfPrevMonth = new Date(year, month - 2, 1);
  const endOfPrevMonth = new Date(year, month - 1, 0, 23, 59, 59);

  const calculateTotals = async (start: Date, end: Date) => {
    // Orders revenue + Manual revenue
    const ordersRev = await Order.aggregate([
      { $match: { createdAt: { $gte: start, $lte: end }, status: ORDER_STATUS.DELIVERED } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } }
    ]);
    const manualRev = await Revenue.aggregate([
      { $match: { date: { $gte: start, $lte: end } } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);
    const expenses = await Expense.aggregate([
      { $match: { date: { $gte: start, $lte: end } } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);

    const ordRev = ordersRev[0]?.total || 0;
    const manRev = manualRev[0]?.total || 0;
    const exp = expenses[0]?.total || 0;

    const totalRev = ordRev + manRev;
    return { revenue: totalRev, expense: exp, net: totalRev - exp };
  };

  const currentMonthData = await calculateTotals(startOfMonth, endOfMonth);
  const prevMonthData = await calculateTotals(startOfPrevMonth, endOfPrevMonth);

  let growth = 0;
  if (prevMonthData.net > 0) {
    growth = ((currentMonthData.net - prevMonthData.net) / prevMonthData.net) * 100;
  }

  return {
    totalRevenue: currentMonthData.revenue,
    totalExpenses: currentMonthData.expense,
    netProfit: currentMonthData.net,
    growthPercentage: growth.toFixed(2),
  };
};

// 4. Add Revenue / Expense
export const addRevenue = async (data: { name: string; amount: number; date: Date; sourceType?: string }) => {
  return Revenue.create({ ...data, sourceType: data.sourceType || 'MANUAL' });
};

export const addExpense = async (data: { name: string; amount: number; date: Date }) => {
  return Expense.create(data);
};

// 5. Report Generation - Preview
export const previewReport = async (periodFrom: Date, periodTo: Date, sections: string[]) => {
  const result: any = {};

  if (sections.includes('Revenue') || sections.includes('Net Profit')) {
    const ordersRev = await Order.aggregate([
      { $match: { createdAt: { $gte: periodFrom, $lte: periodTo }, status: ORDER_STATUS.DELIVERED } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } }
    ]);
    const manualRev = await Revenue.aggregate([
      { $match: { date: { $gte: periodFrom, $lte: periodTo } } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);
    result.revenueTotal = (ordersRev[0]?.total || 0) + (manualRev[0]?.total || 0);
  }

  if (sections.includes('Expenses') || sections.includes('Net Profit')) {
    const expenses = await Expense.aggregate([
      { $match: { date: { $gte: periodFrom, $lte: periodTo } } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);
    result.expenseTotal = expenses[0]?.total || 0;
  }

  if (sections.includes('Net Profit')) {
    result.netProfitTotal = result.revenueTotal - result.expenseTotal;
  }

  return result;
};

// 5. Report Generation - Save (Step 3)
export const saveReport = async (periodFrom: Date, periodTo: Date, reportType: string, generatedBy: string) => {
  return Report.create({ periodFrom, periodTo, reportType, generatedBy });
};

export const getReports = async () => {
  return Report.find().sort({ createdAt: -1 }).populate('generatedBy', 'name');
};

// 5. Report Generation - Download PDF (Step 4)
export const downloadReport = async (reportId: string, res: Response) => {
  const report = await Report.findById(reportId);
  if (!report) throw new Error('Report not found');

  const preview = await previewReport(report.periodFrom, report.periodTo, ['Revenue', 'Expenses', 'Net Profit']);

  // Create real PDF
  const doc = new PDFDocument({ margin: 50 });

  res.setHeader('Content-disposition', `attachment; filename=Report_${reportId}.pdf`);
  res.setHeader('Content-type', 'application/pdf');

  doc.pipe(res);

  doc.fontSize(25).text('Smart Laundry Financial Report', { align: 'center' });
  doc.moveDown();

  doc.fontSize(12).text(`Type: ${report.reportType}`);
  doc.text(`Period: ${new Date(report.periodFrom).toLocaleDateString()} to ${new Date(report.periodTo).toLocaleDateString()}`);
  doc.text(`Generated: ${new Date().toLocaleDateString()}`);

  doc.moveDown();
  doc.fontSize(16).text('Summary');
  doc.moveDown(0.5);

  doc.fontSize(12).text(`Total Revenue: LKR ${preview.revenueTotal.toFixed(2)}`);
  doc.text(`Total Expenses: LKR ${preview.expenseTotal.toFixed(2)}`);
  doc.moveDown();

  doc.fontSize(14).text(`Net Profit: LKR ${preview.netProfitTotal.toFixed(2)}`, { stroke: true });

  doc.end();
};
