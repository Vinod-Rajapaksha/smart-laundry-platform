import { X, CheckCircle, Navigation, Truck, Clock, Package, Calendar } from 'lucide-react';
import type { StaffJob, JobStatus } from '../types';
import { format } from 'date-fns';

interface StaffJobDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  job: StaffJob | null;
  onUpdateStatus: (id: string, status: string) => void;
  loading: boolean;
}

export default function StaffJobDrawer({ isOpen, onClose, job, onUpdateStatus, loading }: StaffJobDrawerProps) {
  if (!isOpen || !job) return null;

  const formattedDate = format(new Date(job.createdAt), "MMMM dd, yyyy");
  const formattedTime = format(new Date(job.createdAt), "HH:mm");

  const getStatusInfo = (status: JobStatus) => {
    switch (status) {
      case "PENDING":
        return { color: "text-amber-600", bg: "bg-amber-50", icon: <Clock size={18} /> };
      case "STARTED":
        return { color: "text-blue-600", bg: "bg-blue-50", icon: <Navigation size={18} /> };
      case "COMPLETED":
        return { color: "text-emerald-600", bg: "bg-emerald-50", icon: <CheckCircle size={18} /> };
      default:
        return { color: "text-slate-600", bg: "bg-slate-50", icon: <Package size={18} /> };
    }
  };

  const statusInfo = getStatusInfo(job.jobStatus);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className={`fixed inset-y-0 right-0 w-full max-w-[500px] bg-white shadow-[-20px_0_50px_rgba(0,0,0,0.1)] z-50 transform transition-transform duration-500 ease-out flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>

        {/* Header */}
        <div className="flex items-center px-8 py-6 border-b border-slate-100 bg-white">
          <div className={`w-10 h-10 ${job.jobType.includes("PICKUP") ? "bg-amber-500 shadow-amber-100" : "bg-purple-500 shadow-purple-100"} rounded-lg flex items-center justify-center text-white mr-4 shadow-lg`}>
            {job.jobType.includes("PICKUP") ? <Navigation size={24} /> : <Truck size={24} />}
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-[#1e293b]">{job.jobType}</h2>
            <p className="text-[12px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
              Logistics Task Detail
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-900 transition-all active:scale-95"
          >
            <X size={22} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto bg-slate-50/50">
          <div className="p-8 space-y-8">

            {/* Status Section */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[13px] font-extrabold text-slate-400 uppercase tracking-widest">Current Status</h3>
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${statusInfo.bg} ${statusInfo.color}`}>
                  {job.jobStatus}
                </span>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl ${statusInfo.bg} ${statusInfo.color} flex items-center justify-center`}>
                  {statusInfo.icon}
                </div>
                <div>
                  <p className="font-bold text-slate-900 text-base">Job is {job.jobStatus.toLowerCase()}</p>
                  <p className="text-sm text-slate-500">Synced on {formattedDate} at {formattedTime}</p>
                </div>
              </div>
            </section>

            {/* Order & Staff Context */}
            <section className="grid grid-cols-2 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Order ID</p>
                <p className="text-lg font-black text-[#1e293b]">ORD-{job.orderId.substring(0, 8).toUpperCase()}</p>
              </div>
              <div className="bg-white p-5 rounded-2xl border-l-[4px] border-indigo-500 shadow-sm">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Assigned Staff</p>
                <p className="text-lg font-black text-indigo-600">ID-{job.assignedStaffId.substring(0, 6).toUpperCase()}</p>
              </div>
            </section>

            {/* Details Table-like sections */}
            <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden divide-y divide-slate-100">
              <div className="flex justify-between p-4 text-[14px]">
                <span className="text-slate-500 font-medium">Operation Type</span>
                <span className="font-bold text-[#1e293b]">{job.jobType}</span>
              </div>
              <div className="flex justify-between p-4 text-[14px]">
                <span className="text-slate-500 font-medium">Creation Date</span>
                <span className="font-bold text-[#1e293b] flex items-center gap-2">
                  <Calendar size={16} className="text-slate-400" />
                  {formattedDate}
                </span>
              </div>
              <div className="flex justify-between p-4 text-[14px]">
                <span className="text-slate-500 font-medium">Sync Time</span>
                <span className="font-bold text-[#1e293b] flex items-center gap-2">
                  <Clock size={16} className="text-slate-400" />
                  {formattedTime}
                </span>
              </div>
              {job.startedAt && (
                <div className="flex justify-between p-4 text-[14px]">
                  <span className="text-slate-500 font-medium">Started At</span>
                  <span className="font-bold text-blue-600">
                    {format(new Date(job.startedAt), "HH:mm, MMM dd")}
                  </span>
                </div>
              )}
              {job.completedAt && (
                <div className="flex justify-between p-4 text-[14px]">
                  <span className="text-slate-500 font-medium">Completed At</span>
                  <span className="font-bold text-emerald-600">
                    {format(new Date(job.completedAt), "HH:mm, MMM dd")}
                  </span>
                </div>
              )}
            </section>

            {/* Actions Section */}
            <section className="space-y-4">
              <h3 className="text-[13px] font-extrabold text-slate-400 uppercase tracking-widest">Update Job Progress</h3>

              <div className="flex gap-4">
                {job.jobStatus === "PENDING" && (
                  <button
                    disabled={loading}
                    onClick={() => onUpdateStatus(job._id, "STARTED")}
                    className="flex-1 h-14 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black transition-all shadow-lg shadow-blue-100 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                  >
                    <Navigation size={20} /> Start Logistics
                  </button>
                )}

                {job.jobStatus === "STARTED" && (
                  <button
                    disabled={loading}
                    onClick={() => onUpdateStatus(job._id, "COMPLETED")}
                    className="flex-1 h-14 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black transition-all shadow-lg shadow-emerald-100 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                  >
                    <CheckCircle size={20} /> Mark as Completed
                  </button>
                )}

                {job.jobStatus === "COMPLETED" && (
                  <div className="flex-1 h-14 rounded-2xl bg-emerald-50 text-emerald-600 font-black flex items-center justify-center gap-2 border border-emerald-100">
                    <CheckCircle size={20} /> Task Successfully Finished
                  </div>
                )}
              </div>
            </section>

          </div>
        </div>

        {/* Footer info */}
        <div className="p-8 border-t border-slate-100 bg-white">
          <div className="px-6 py-4 bg-slate-50 rounded-2xl flex items-center justify-center gap-3">
            <Package className="text-slate-400" size={18} />
            <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest text-center">
              Logistics tasks are automated based on order lifecycle. Manual overrides are restricted.
            </p>
          </div>
        </div>

      </div>
    </>
  );
}
