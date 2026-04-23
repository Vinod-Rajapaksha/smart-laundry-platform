export interface Report {
  _id: string;
  reportType: string;
  periodFrom: string;
  periodTo: string;
  generatedBy: string;
  createdAt: string;
  updatedAt: string;
}

export type Tab = "All Reports" | "Sales" | "Inventory" | "Staff";
