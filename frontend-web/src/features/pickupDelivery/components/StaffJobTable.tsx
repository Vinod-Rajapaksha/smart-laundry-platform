import { Table, type TableColumn } from "../../../components/ui/Table";
import type { StaffJob } from "../types";
import { format } from "date-fns";
import { Truck, Navigation } from "lucide-react";

interface StaffJobTableProps {
  jobs: StaffJob[];
  onViewDetails: (job: StaffJob) => void;
  loading?: boolean;
}

export default function StaffJobTable({ jobs, onViewDetails, loading }: StaffJobTableProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED": return "bg-green-100 text-green-700 border-green-200";
      case "STARTED": return "bg-blue-100 text-blue-700 border-blue-200";
      case "PENDING": return "bg-amber-100 text-amber-700 border-amber-200";
      default: return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  const columns: TableColumn<StaffJob>[] = [
    {
      header: "Operation",
      cell: (job) => (
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-2xl ${job.jobType.includes("PICKUP") ? "bg-amber-100 text-amber-600" : "bg-purple-100 text-purple-600"} shadow-sm`}>
            {job.jobType.includes("PICKUP") ? <Navigation size={18} /> : <Truck size={18} />}
          </div>
          <div>
            <p className="font-black text-slate-900 text-sm tracking-tight leading-none mb-1">{job.jobType}</p>
            <span className={`px-2 py-0.5 rounded text-[8px] font-black border uppercase ${getStatusColor(job.jobStatus)}`}>
              {job.jobStatus}
            </span>
          </div>
        </div>
      ),
    },
    {
      header: "Order",
      cell: (job) => {
        const orderNo = typeof job.orderId === 'object' ? (job.orderId as any).orderNo : `ORD-${String(job.orderId).substring(0, 6)}`;
        return (
          <div>
            <p className="font-mono text-xs text-slate-900 font-black tracking-tight uppercase">{orderNo}</p>
            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">Synced {format(new Date(job.createdAt), "HH:mm, MMM dd")}</p>
          </div>
        );
      },
    },
    {
      header: "Assigned Staff",
      cell: (job) => {
        const staff = typeof job.assignedStaffId === 'object' ? (job.assignedStaffId as any) : null;
        const displayName = staff?.name || String(job.assignedStaffId).substring(0, 6);
        const displayInitials = (staff?.name ? staff.name.substring(0, 2) : String(job.assignedStaffId).substring(0, 2)).toUpperCase();
        
        return (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-slate-900 border border-slate-700 text-white flex items-center justify-center text-[10px] font-black shadow-lg">
              {displayInitials}
            </div>
            <div className="flex flex-col">
               <span className="text-[10px] font-black text-slate-900 uppercase tracking-tight">{displayName}</span>
               <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">Field Agent</span>
            </div>
          </div>
        );
      },
    },
    {
      header: "Action",
      className: "text-right",
      cell: (job) => (
        <button
          onClick={() => onViewDetails(job)}
          className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 text-[13px] font-semibold hover:bg-slate-50 hover:text-slate-900 transition-colors"
        >
          View Details
        </button>
      ),
    },
  ];

  if (loading && jobs.length === 0) {
    return (
      <div className="w-full bg-white rounded-xl p-8 flex justify-center border border-slate-200 shadow-sm">
        <span className="text-slate-500 font-semibold italic">Loading logistics jobs...</span>
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="w-full bg-white rounded-xl border border-slate-200 shadow-sm p-12 flex flex-col items-center justify-center">
        <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mb-4">
          {/* Placeholder for an icon */}
          <Truck size={24} className="text-slate-300" />
        </div>
        <span className="text-slate-500 font-semibold text-lg">No active logistics jobs found</span>
        <p className="text-slate-400 text-sm">Try adjusting your filters or search query.</p>
      </div>
    );
  }

  return (
    <Table
      columns={columns}
      data={jobs}
    />
  );
}
