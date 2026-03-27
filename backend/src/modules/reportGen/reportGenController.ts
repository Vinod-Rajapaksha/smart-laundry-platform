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
    const selectedSections: string[] = filters?.sections || [];
    const fields = selectedSections.map((label: string) => fieldMap[label] || label);
    const data = await reportGenService.getReportData({ from, to, fields });

    const savedReport = await reportGenService.saveGeneratedReport({
      from,
      to,
      selectedSections,
      reportData: data,
      generatedByName: req.user?.id || req.user?.email || 'Admin',
    });

    res.status(200).json({
      success: true,
      data,
      report: {
        id: savedReport._id,
        reportCode: savedReport.reportCode,
        generatedByName: savedReport.generatedByName,
        generatedDate: savedReport.createdAt,
      },
    });
  } catch (error: any) {
    console.error('Report generation error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const listGeneratedReports = async (_req: Request, res: Response) => {
  try {
    const reports = await reportGenService.getGeneratedReports();
    res.status(200).json({ success: true, data: reports });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Failed to list reports' });
  }
};

export const downloadGeneratedReport = async (req: Request, res: Response) => {
  try {
    const reportId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const report = await reportGenService.getGeneratedReportById(reportId);

    if (!report) {
      return res.status(404).json({ success: false, message: 'Report not found' });
    }

    const pdfBuffer = await reportGenService.buildReportPdfBuffer(report);
    const fileName = `${report.reportCode || 'report'}.pdf`;
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);

    return res.status(200).send(pdfBuffer);
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || 'Failed to download report' });
  }
};
