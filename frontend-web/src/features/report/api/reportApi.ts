import axios from 'axios';
import type { ReportRequestPayload, ReportResponse, ReportPreviewParams } from '../types';

// Generate a new report (returns PDF URL or Blob)
export async function generateReport(payload: ReportRequestPayload): Promise<ReportResponse> {
  try {
    const response = await axios.post('/api/reports/generate', payload, { responseType: 'blob' });
    return { pdfBlob: response.data };
  } catch (error: any) {
    return { error: error?.message || 'Failed to generate report' };
  }
}

// Fetch report preview (returns PDF URL or Blob)
export async function getReportPreview(params: ReportPreviewParams): Promise<ReportResponse> {
  try {
    const response = await axios.post('/api/reports/preview', params, { responseType: 'blob' });
    return { pdfBlob: response.data };
  } catch (error: any) {
    return { error: error?.message || 'Failed to fetch preview' };
  }
}

// Download report by ID (returns Blob)
export async function downloadReport(reportId: string): Promise<ReportResponse> {
  try {
    const response = await axios.get(`/api/reports/download/${reportId}`, { responseType: 'blob' });
    return { pdfBlob: response.data };
  } catch (error: any) {
    return { error: error?.message || 'Failed to download report' };
  }
}
