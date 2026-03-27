import axios from 'axios';
import type { ReportRequestPayload, ReportResponse, ReportPreviewParams } from '../types';
import { env } from '../../../app/config/env';

// Generate a new report (returns PDF URL or Blob)
export async function generateReport(payload: ReportRequestPayload): Promise<ReportResponse> {
  try {
    const response = await axios.post(`${env.API_URL}/reportGen/generate`, payload, { responseType: 'blob' });
    return { pdfBlob: response.data };
  } catch (error: any) {
    return { error: error?.message || 'Failed to generate report' };
  }
}

// Fetch report preview (returns PDF URL or Blob)
export async function getReportPreview(params: ReportPreviewParams): Promise<ReportResponse> {
  try {
    const response = await axios.post(`${env.API_URL}/reports/preview`, params, { responseType: 'blob' });
    return { pdfBlob: response.data };
  } catch (error: any) {
    return { error: error?.message || 'Failed to fetch preview' };
  }
}

// Download report by ID (returns Blob)
export async function downloadReport(reportId: string): Promise<ReportResponse> {
  try {
    const response = await axios.get(`${env.API_URL}/reportGen/reports/${reportId}/download`, { responseType: 'blob' });
    return { pdfBlob: response.data };
  } catch (error: any) {
    return { error: error?.message || 'Failed to download report' };
  }
}
