export type JobStatus = "PENDING" | "STARTED" | "COMPLETED" | "CANCELLED";

export interface StaffJob {
  _id: string;
  orderId: string;
  jobType: string;
  assignedStaffId: string;
  jobStatus: JobStatus;
  startedAt?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export type Tab = "All Jobs" | "Scheduled" | "In Progress" | "Completed";
