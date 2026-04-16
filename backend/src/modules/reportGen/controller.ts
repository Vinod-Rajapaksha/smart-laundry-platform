


import { Request, Response } from 'express';
import * as reportGenService from './service.js';
import asyncHandler from '../../utils/asyncHandler.js';
import { ApiResponse } from '../../core/apiResponse.js';


export const generateReport = asyncHandler(async (req: Request, res: Response) => {
  const { dateRange, filters } = req.body;
  const generatedByName = req.user?.id || req.user?.email || 'Admin';
  const { data, savedReport } = await reportGenService.generateAndSaveReport({ dateRange, filters, generatedByName });
  return ApiResponse(res, 200, 'Report generated successfully', {
    data,
    report: {
      id: savedReport._id,
      reportCode: savedReport.reportCode,
      generatedByName: savedReport.generatedByName,
      generatedDate: savedReport.createdAt,
    },
  });
});

export const listGeneratedReports = asyncHandler(async (_req: Request, res: Response) => {
  const reports = await reportGenService.getGeneratedReports();
  return ApiResponse(res, 200, 'Generated reports fetched successfully', reports);
});

export const downloadGeneratedReport = asyncHandler(async (req: Request, res: Response) => {
  const reportId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const report = await reportGenService.getGeneratedReportById(reportId);

  if (!report) {
    return ApiResponse(res, 404, 'Report not found');
  }

  const pdfBuffer = await reportGenService.buildReportPdfBuffer(report);
  const fileName = `${report.reportCode || 'report'}.pdf`;
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);

  return res.status(200).send(pdfBuffer);
});
