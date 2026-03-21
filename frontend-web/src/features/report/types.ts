// Report-related TypeScript types

export interface ReportData {
  title: string;
  dateRange: { from: string; to: string };
  filters?: Record<string, any>;
  [key: string]: any;
}

export interface ReportRequestPayload {
  dateRange: { from: string; to: string };
  filters?: Record<string, any>;
  userId?: string;
}

export interface ReportResponse {
  pdfUrl?: string;
  pdfBlob?: Blob;
  error?: string;
}

export interface ReportPreviewParams {
  reportId?: string;
  payload?: ReportRequestPayload;
}
