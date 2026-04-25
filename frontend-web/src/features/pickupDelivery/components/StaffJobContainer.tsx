import { useState, useEffect } from "react";
import StaffJobFilters from "./StaffJobFilters";
import StaffJobTable from "./StaffJobTable";
import StaffJobDrawer from "./StaffJobDrawer";
import type { StaffJob, Tab, JobStatus } from "../types";
import { getStaffJobs, updateJobStatus } from "../api/pickupDelivery.api";
import { toast } from "react-hot-toast";
import { PickupDeliveryHeader } from "./PickupDeliveryHeader";

export default function StaffJobContainer() {
  const [jobs, setJobs] = useState<StaffJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("All Jobs");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedJob, setSelectedJob] = useState<StaffJob | null>(null);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const statusMap: Record<string, string> = {
        "Scheduled": "PENDING",
        "In Progress": "STARTED",
        "Completed": "COMPLETED"
      };
      const status = statusMap[activeTab];
      const data = await getStaffJobs(status);
      setJobs(data);
    } catch (error) {
      toast.error("Failed to fetch logistics jobs");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [activeTab]);

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      setActionLoading(true);
      await updateJobStatus(id, status);
      toast.success(`Job status updated to ${status}`);
      setJobs(prev => prev.map(j => j._id === id ? { ...j, jobStatus: status as JobStatus } : j));

      if (selectedJob?._id === id) {
        setSelectedJob(prev => prev ? { ...prev, jobStatus: status as JobStatus } : null);
      }
    } catch (error) {
      toast.error("Failed to update job status");
    } finally {
      setActionLoading(false);
    }
  };

  const filteredJobs = jobs.filter((j) => {
    const searchLower = searchQuery.toLowerCase();

    const orderNo = typeof j.orderId === 'object' ? (j.orderId as any).orderNo : j.orderId;
    const orderMatch = String(orderNo || '').toLowerCase().includes(searchLower);

    const staffName = typeof j.assignedStaffId === 'object' ? (j.assignedStaffId as any).name : '';
    const staffMatch = String(staffName || j.assignedStaffId || '').toLowerCase().includes(searchLower);

    return orderMatch || staffMatch;
  });

  return (
    <div className="w-full max-w-[1256px] mx-auto space-y-6 animate-in fade-in zoom-in duration-700 font-poppins pb-20">
      <PickupDeliveryHeader />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 text-white p-7 rounded-[2rem] shadow-2xl relative overflow-hidden group cursor-default">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full translate-x-1/2 -translate-y-1/2 group-hover:scale-150 transition-transform duration-700" />
          <p className="text-amber-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Active Pickups</p>
          <p className="text-4xl font-black">
            {jobs.filter(j => j.jobType.includes("PICKUP") && j.jobStatus !== "COMPLETED").length}
          </p>
        </div>
        <div className="bg-white p-7 rounded-[2rem] border border-slate-100 shadow-xl relative group cursor-default">
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Pending Deliveries</p>
          <p className="text-4xl font-black text-blue-600">
            {jobs.filter(j => j.jobType.includes("DELIVERY") && j.jobStatus !== "COMPLETED").length}
          </p>
        </div>
        <div className="bg-emerald-600 text-white p-7 rounded-[2rem] shadow-xl relative group cursor-default">
          <p className="text-emerald-100 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Fleet Efficiency</p>
          <p className="text-4xl font-black uppercase">Optimized</p>
        </div>
      </div>

      <StaffJobFilters
        activeTab={activeTab}
        onTabChange={setActiveTab}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <StaffJobTable
        jobs={filteredJobs}
        onViewDetails={setSelectedJob}
        loading={loading}
      />

      <StaffJobDrawer
        isOpen={!!selectedJob}
        job={selectedJob}
        onClose={() => setSelectedJob(null)}
        onUpdateStatus={handleUpdateStatus}
        loading={actionLoading}
      />
    </div>
  );
}
