import PDFDocument from 'pdfkit';
import User from '../../database/models/User.js';
import Order from '../../database/models/Order.js';
import Revenue from '../../database/models/Revenue.js';
import Expense from '../../database/models/Expense.js';
import Report from '../../database/models/Report.js';
import Feedback from '../../database/models/Feedback.js';
import Inventory from '../../database/models/Inventory.js';
import Service from '../../database/models/Service.js';
import Voucher from '../../database/models/Voucher.js';
import { ORDER_STATUS, ROLES, ANALYTICS_DATE_RANGES, PAYMENT_METHODS } from '../../core/constants.js';
import { Response } from 'express';

export const getDashboardKPIs = async (range: string = 'today') => {
  const now = new Date();
  const startDate = new Date();
  startDate.setHours(0, 0, 0, 0);

  if (range === ANALYTICS_DATE_RANGES.YESTERDAY) {
    startDate.setDate(startDate.getDate() - 1);
    now.setHours(0, 0, 0, 0);
  } else if (range === ANALYTICS_DATE_RANGES.WEEK) {
    startDate.setDate(startDate.getDate() - 7);
  } else if (range === ANALYTICS_DATE_RANGES.MONTH) {
    startDate.setMonth(startDate.getMonth() - 1);
  } else if (range === ANALYTICS_DATE_RANGES.YEAR) {
    startDate.setFullYear(startDate.getFullYear() - 1);
  } else if (range === ANALYTICS_DATE_RANGES.OVERALL) {
    startDate.setFullYear(2020);
  }

  const dateFilter = { $gte: startDate, $lte: now };

  const [
    orderRevenueRes,
    manualRevenueRes,
    newOrders,
    activeStaff,
    pendingDeliveries,
    revenueTrendRaw,
    statusDistributionRaw,
    averageRatingRes,
    lowStockItems,
    activeServices,
    activeVouchers,
    totalCustomers
  ] = await Promise.all([
    Order.aggregate([
      { $match: { paidAt: dateFilter } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } }
    ]),
    Revenue.aggregate([
      { $match: { date: dateFilter } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]),
    Order.countDocuments({ createdAt: dateFilter }),
    User.countDocuments({ role: ROLES.STAFF, isActive: true }),
    Order.countDocuments({
      status: {
        $in: [
          ORDER_STATUS.READY,
          ORDER_STATUS.DELIVERY_ASSIGNED,
          ORDER_STATUS.DELIVERY_ON_THE_WAY
        ]
      }
    }),
    Order.aggregate([
      { $match: { paidAt: dateFilter } },
      {
        $group: {
          _id: {
            $dateToString: {
              format: range === 'year' || range === 'overall' ? "%Y-%m" : "%Y-%m-%d",
              date: "$paidAt"
            }
          },
          amount: { $sum: "$totalAmount" }
        }
      },
      { $sort: { _id: 1 } },
      { $limit: 30 }
    ]),
    Order.aggregate([
      { $match: { createdAt: dateFilter } },
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]),
    Feedback.aggregate([
      { $match: { status: 'approved' } },
      { $group: { _id: null, avg: { $avg: "$rating" } } }
    ]),
    Inventory.countDocuments({ $expr: { $lte: ["$qtyInStock", "$reorderLevel"] } }),
    Service.countDocuments({ isActive: true }),
    Voucher.countDocuments({ isActive: true }),
    User.countDocuments({ role: ROLES.CUSTOMER })
  ]);

  const orderRevenue = orderRevenueRes[0]?.total || 0;
  const manualRevenue = manualRevenueRes[0]?.total || 0;
  const todayRevenue = orderRevenue + manualRevenue;

  const revenueTrend = revenueTrendRaw.map(item => ({
    date: item._id,
    amount: item.amount
  }));

  const orderStatusDistribution = statusDistributionRaw.map(item => ({
    status: item._id,
    count: item.count
  }));

  const averageRating = averageRatingRes[0]?.avg || 0;

  return {
    todayRevenue,
    newOrders,
    activeStaff,
    pendingDeliveries,
    revenueTrend,
    orderStatusDistribution,
    averageRating,
    lowStockItems,
    activeServices,
    activeVouchers,
    totalCustomers
  };
};

export const getMonthlyAnalysis = async (year: number, month: number) => {
  const startOfMonth = new Date(year, month - 1, 1);
  const endOfMonth = new Date(year, month, 0, 23, 59, 59);

  const startOfPrevMonth = new Date(year, month - 2, 1);
  const endOfPrevMonth = new Date(year, month - 1, 0, 23, 59, 59);

  const calculateTotals = async (start: Date, end: Date) => {
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

export const addRevenue = async (data: { name: string; amount: number; date: Date; sourceType?: string }) => {
  return Revenue.create({ ...data, sourceType: data.sourceType || 'MANUAL' });
};

export const addExpense = async (data: { name: string; amount: number; date: Date }) => {
  return Expense.create(data);
};

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

export const saveReport = async (periodFrom: Date, periodTo: Date, reportType: string, generatedBy: string) => {
  const count = await Report.countDocuments();
  const reportCode = `REP-${new Date().getFullYear()}-${(count + 1).toString().padStart(4, '0')}`;
  return Report.create({ reportCode, periodFrom, periodTo, reportType, generatedBy });
};

export const getReports = async () => {
  return Report.find().sort({ createdAt: -1 }).populate('generatedBy', 'name');
};

export const deleteReport = async (id: string) => {
  const report = await Report.findByIdAndDelete(id);
  if (!report) throw new Error('Report not found');
  return report;
};

export const downloadReport = async (reportId: string, res: Response) => {
  const report = await Report.findById(reportId);
  if (!report) throw new Error('Report not found');

  const periodFrom = new Date(report.periodFrom);
  const periodTo = new Date(report.periodTo);

  const preview = await previewReport(periodFrom, periodTo, ['Revenue', 'Expenses', 'Net Profit']);

  const [completedOrders, allOrders, newCustomers, lowStockItems] = await Promise.all([
    Order.countDocuments({ createdAt: { $gte: periodFrom, $lte: periodTo }, status: ORDER_STATUS.DELIVERED }),
    Order.countDocuments({ createdAt: { $gte: periodFrom, $lte: periodTo } }),
    User.countDocuments({ createdAt: { $gte: periodFrom, $lte: periodTo }, role: ROLES.CUSTOMER }),
    Inventory.find({ qtyInStock: { $lte: 5 } }).limit(5)
  ]);

  const successRate = allOrders > 0 ? ((completedOrders / allOrders) * 100).toFixed(1) : '100.0';

  const doc = new PDFDocument({ margin: 50, size: 'A4' });

  res.setHeader('Content-disposition', `attachment; filename=Report_${report.reportCode || reportId}.pdf`);
  res.setHeader('Content-type', 'application/pdf');

  doc.pipe(res);

  doc.rect(0, 0, 600, 100).fill('#1e293b');
  doc.fillColor('#ffffff').fontSize(28).font('Helvetica-Bold').text('B & W Laundry', 50, 35);
  doc.fontSize(10).font('Helvetica').text('Intelligent Operations Command Center', 50, 65);

  doc.moveDown(4);
  doc.fillColor('#0f172a').fontSize(20).font('Helvetica-Bold').text(`Administrative Report: ${report.reportType}`);
  doc.rect(50, 145, 500, 2).fill('#3b82f6');

  doc.moveDown(1.5);
  doc.fillColor('#475569').fontSize(11).font('Helvetica');
  doc.text(`Report ID:       ${report.reportCode || report._id}`);
  doc.text(`Period:            ${periodFrom.toLocaleDateString()}  to  ${periodTo.toLocaleDateString()}`);
  doc.text(`Generated:      ${new Date().toLocaleString()}`);

  doc.moveDown(2);
  doc.fillColor('#0f172a').fontSize(16).font('Helvetica-Bold').text('1. Financial Executive Summary');
  doc.rect(50, doc.y + 5, 500, 1).fill('#e2e8f0');
  doc.moveDown(1.5);

  doc.font('Helvetica').fontSize(12).fillColor('#334155');
  doc.text('Total System Revenue:', 50, doc.y, { continued: true }).text(`LKR ${preview.revenueTotal.toFixed(2)}`, { align: 'right' });
  doc.moveDown(0.5);
  doc.text('Total System Expenses:', 50, doc.y, { continued: true }).text(`LKR ${preview.expenseTotal.toFixed(2)}`, { align: 'right' });
  doc.moveDown(0.5);
  doc.font('Helvetica-Bold').fillColor('#10b981').text('Calculated Net Profit:', 50, doc.y, { continued: true }).text(`LKR ${preview.netProfitTotal.toFixed(2)}`, { align: 'right' });

  doc.moveDown(4);
  doc.fillColor('#0f172a').fontSize(16).font('Helvetica-Bold').text('2. Operational Efficiency Tracker', 50, doc.y);
  doc.rect(50, doc.y + 5, 500, 1).fill('#e2e8f0');
  doc.moveDown(1.5);

  doc.font('Helvetica').fontSize(12).fillColor('#334155');
  doc.text(`Total Orders Received: ${allOrders}`);
  doc.text(`Successfully Fulfilled: ${completedOrders}`);
  doc.text(`Operational Success Rate: ${successRate}%`);
  doc.text(`New Customer Acquisitions: ${newCustomers}`);

  if (lowStockItems.length > 0) {
    doc.moveDown(3);
    doc.fillColor('#ef4444').fontSize(16).font('Helvetica-Bold').text('3. Critical Inventory Action Required');
    doc.rect(50, doc.y + 5, 500, 1).fill('#fecaca');
    doc.moveDown(1.5);

    doc.font('Helvetica').fontSize(11).fillColor('#475569');
    lowStockItems.forEach((item, idx) => {
      doc.text(`${idx + 1}. ${item.name} (Stock Level: ${item.qtyInStock}) - Reorder Imminent`);
    });
  } else {
    doc.moveDown(3);
    doc.fillColor('#10b981').fontSize(16).font('Helvetica-Bold').text('3. Inventory Status');
    doc.rect(50, doc.y + 5, 500, 1).fill('#a7f3d0');
    doc.moveDown(1.5);
    doc.font('Helvetica').fontSize(11).fillColor('#475569').text('All critical stock levels are stable. No immediate logistics action required.');
  }

  const pageHeight = doc.page.height;
  doc.font('Helvetica').fontSize(9).fillColor('#94a3b8').text('CONFIDENTIAL - Smart Laundry Platform Automated Intelligence Report', 50, pageHeight - 50, { align: 'center' });

  doc.end();
};

export const getStaffDashboardStats = async () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [pickups, processing, deliveries, completedToday] = await Promise.all([
    Order.countDocuments({
      status: { $in: [ORDER_STATUS.ORDER_PLACED, ORDER_STATUS.PICKUP_ASSIGNED, ORDER_STATUS.PICKUP_ON_THE_WAY] },
      $or: [
        { paymentMethod: PAYMENT_METHODS.COD },
        { paymentStatus: 'PAID' }
      ],
      paymentMethod: { $ne: PAYMENT_METHODS.NONE }
    }),
    Order.countDocuments({
      status: { $in: [ORDER_STATUS.PICKED_UP, ORDER_STATUS.WASHING, ORDER_STATUS.DRYING, ORDER_STATUS.PROCESSING] }
    }),
    Order.countDocuments({
      status: { $in: [ORDER_STATUS.READY, ORDER_STATUS.DELIVERY_ASSIGNED, ORDER_STATUS.DELIVERY_ON_THE_WAY] },
      $or: [
        { paymentMethod: PAYMENT_METHODS.COD },
        { paymentStatus: 'PAID' }
      ],
      paymentMethod: { $ne: PAYMENT_METHODS.NONE }
    }),
    Order.countDocuments({
      status: ORDER_STATUS.DELIVERED,
      updatedAt: { $gte: today }
    })
  ]);

  return {
    pickups,
    processing,
    deliveries,
    completedToday
  };
};
