import { Request, Response } from 'express';
import * as reportGenService from './reportGenService.js';

export const generateReport = async (req: Request, res: Response) => {
  try {
    const { dateRange, filters } = req.body;
    const from = dateRange?.from;
    const to = dateRange?.to;
    // Move fieldMap above the .map()!
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
    const fields = (filters?.sections || []).map((label: string) => fieldMap[label] || label);
    const data = await reportGenService.getReportData({ from, to, fields });
    res.status(200).json({ success: true, data });
  } catch (error: any) {
    console.error('Report generation error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
