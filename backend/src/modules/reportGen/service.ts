// Maps human-readable section names to internal field keys
const fieldMap: Record<string, string> = {
  'Total Revenue': 'totalRevenue',
  'Total Expenses': 'totalExpense',
  'Net Profit': 'netProfit',
  'Revenue by Month': 'revenueByMonth',
  'Expense Category Breakdown': 'expenseCategoryBreakdown',
  'Profit Trend': 'profitTrend',
  'Staff Salary Summary': 'staffSalarySummary',
  'AI Insights Summary': 'aiInsightsSummary',
};

export const generateAndSaveReport = async (options: {
  dateRange: { from: string; to: string };
  filters?: { sections?: string[] };
  generatedByName?: string;
}) => {
  const { dateRange, filters, generatedByName } = options;
  const from = dateRange?.from;
  const to = dateRange?.to;
  const selectedSections: string[] = filters?.sections || [];
  const fields = selectedSections.map((label: string) => fieldMap[label] || label);
  const data = await getReportData({ from, to, fields });

  const savedReport = await saveGeneratedReport({
    from,
    to,
    selectedSections,
    reportData: data,
    generatedByName,
  });

  return { data, savedReport };
};
import RevenueModel from '../../database/models/Revenue.js';
import ExpenseModel from '../../database/models/Expense.js';
import ReportModel from '../../database/models/Report.js';
import PDFDocument from 'pdfkit';

export const getReportData = async (options: {
  from: string;
  to: string;
  fields: string[];
}) => {
  const { from, to, fields } = options;
  const fromDate = new Date(from);
  const toDate = new Date(to);
  if (Number.isNaN(fromDate.getTime()) || Number.isNaN(toDate.getTime())) {
    throw new Error('Invalid date range');
  }
  toDate.setHours(23, 59, 59, 999);
  const result: any = {};
  const needsRevenue = fields.includes('totalRevenue') || fields.includes('netProfit');
  const needsExpense = fields.includes('totalExpense') || fields.includes('netProfit');

  let totalRevenue = 0;
  let totalExpense = 0;

  if (needsRevenue) {
    const revenues = await RevenueModel.find({
      $or: [{ type: 'revenue' }, { sourceType: 'revenue' }],
      date: { $gte: fromDate, $lte: toDate },
    }).sort({ date: -1 });
    totalRevenue = revenues.reduce((sum, r) => sum + (r.amount || 0), 0);
    if (fields.includes('totalRevenue')) {
      result.totalRevenue = totalRevenue;
      result.revenueList = revenues.map(r => ({ name: r.name, amount: r.amount, date: r.date }));
    }
  }

  if (needsExpense) {
    const expenses = await ExpenseModel.find({
      type: 'expense',
      date: { $gte: fromDate, $lte: toDate },
    }).sort({ date: -1 });
    totalExpense = expenses.reduce((sum, e) => sum + (e.amount || 0), 0);
    if (fields.includes('totalExpense')) {
      result.totalExpense = totalExpense;
      result.expenseList = expenses.map(e => ({ name: e.name, amount: e.amount, date: e.date }));
    }
  }

  if (fields.includes('netProfit')) {
    result.netProfit = totalRevenue - totalExpense;
  }


  return result;
};

const buildReportCode = async (): Promise<string> => {
  const count = await ReportModel.countDocuments();
  const next = count + 1;
  return `RI-${String(next).padStart(4, '0')}`;
};

export const saveGeneratedReport = async (options: {
  from: string;
  to: string;
  selectedSections: string[];
  reportData: Record<string, unknown>;
  generatedByName?: string;
}) => {
  const { from, to, selectedSections, reportData, generatedByName } = options;
  const reportCode = await buildReportCode();

  const created = await ReportModel.create({
    reportCode,
    reportType: 'financial',
    periodFrom: new Date(from),
    periodTo: new Date(to),
    generatedByName: generatedByName || 'Admin',
    selectedSections,
    reportData,
  });

  return created;
};

export const getGeneratedReports = async () => {
  return ReportModel.find({ reportType: 'financial' })
    .sort({ createdAt: -1 })
    .select('_id reportCode generatedByName createdAt periodFrom periodTo selectedSections');
};

export const getGeneratedReportById = async (id: string) => {
  return ReportModel.findById(id);
};

const money = (value: unknown): string => {
  if (typeof value !== 'number') return '0';
  return value.toLocaleString();
};

const formatDate = (value: unknown): string => {
  const date = value instanceof Date ? value : new Date(String(value));
  if (Number.isNaN(date.getTime())) return '-';
  return date.toISOString().slice(0, 10);
};

export const buildReportPdfBuffer = async (report: any): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 48, size: 'A4' });
    const chunks: Buffer[] = [];

    doc.on('data', (chunk: Buffer) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', (err) => reject(err));

    const data = report.reportData || {};
    const totalRevenue = typeof data.totalRevenue === 'number' ? data.totalRevenue : 0;
    const totalExpense = typeof data.totalExpense === 'number' ? data.totalExpense : 0;
    const netProfit = typeof data.netProfit === 'number' ? data.netProfit : totalRevenue - totalExpense;

    doc.fontSize(24).text('Financial Report', { align: 'left' });
    doc.moveDown(0.4);
    doc.fontSize(11).fillColor('#555')
      .text(`Report ID: ${report.reportCode || '-'}`)
      .text(`Generated By: ${report.generatedByName || 'Admin'}`)
      .text(`Generated Date: ${formatDate(report.createdAt)}`)
      .text(`Period: ${formatDate(report.periodFrom)} to ${formatDate(report.periodTo)}`);

    doc.moveDown(1);
    doc.fillColor('#111').fontSize(14).text('Summary');
    doc.moveDown(0.3);
    doc.fontSize(12)
      .text(`Total Revenue: LKR ${money(totalRevenue)}`)
      .text(`Total Expenses: LKR ${money(totalExpense)}`)
      .text(`Net Profit: LKR ${money(netProfit)}`);

    const sections = Array.isArray(report.selectedSections) ? report.selectedSections : [];
    if (sections.length > 0) {
      doc.moveDown(0.8);
      doc.fontSize(14).text('Selected Sections');
      doc.moveDown(0.3);
      doc.fontSize(11).text(sections.join(', '));
    }

    const revenueList = Array.isArray(data.revenueList) ? data.revenueList : [];
    if (revenueList.length > 0) {
      doc.moveDown(0.8);
      doc.fontSize(14).text('Revenue Items');
      doc.moveDown(0.3);
      revenueList.slice(0, 15).forEach((item: any, index: number) => {
        const name = item?.name || 'Unnamed';
        const amount = money(item?.amount);
        const date = formatDate(item?.date);
        doc.fontSize(10).text(`${index + 1}. ${name} | ${date} | LKR ${amount}`);
      });
    }

    const expenseList = Array.isArray(data.expenseList) ? data.expenseList : [];
    if (expenseList.length > 0) {
      doc.moveDown(0.8);
      doc.fontSize(14).text('Expense Items');
      doc.moveDown(0.3);
      expenseList.slice(0, 15).forEach((item: any, index: number) => {
        const name = item?.name || 'Unnamed';
        const amount = money(item?.amount);
        const date = formatDate(item?.date);
        doc.fontSize(10).text(`${index + 1}. ${name} | ${date} | LKR ${amount}`);
      });
    }

    doc.end();
  });
};
