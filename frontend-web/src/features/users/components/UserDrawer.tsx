import type { User } from "../types";
import { X, User as UserIcon, Shield, Mail, Phone, Calendar, Power, Edit3 } from "lucide-react";
import { format } from "date-fns";

interface UserDrawerProps {
  user: User | null;
  onClose: () => void;
  onUpdateStatus: (id: string, isActive: boolean) => void;
  loading?: boolean;
}

export default function UserDrawer({ user, onClose, onUpdateStatus, loading }: UserDrawerProps) {
  if (!user) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 transition-opacity"
        onClick={onClose}
      />
      <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-50 overflow-y-auto font-poppins animate-in slide-in-from-right duration-300">
        <div className="flex flex-col h-full">
          {/* HEADER */}
          <div className="p-8 border-b border-slate-100 flex flex-col items-center text-center relative">
            <button onClick={onClose} className="absolute top-6 right-6 p-2 hover:bg-slate-100 rounded-xl transition text-slate-400">
              <X size={20} />
            </button>

            <div className="w-20 h-20 rounded-3xl bg-slate-100 flex items-center justify-center text-slate-500 mb-4 shadow-inner ring-4 ring-slate-50">
              {user.role === "ADMIN" ? <Shield size={32} /> : <UserIcon size={32} />}
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-1">{user.name}</h2>
            <p className="text-xs font-bold text-blue-600 uppercase tracking-widest">{user.role}</p>
          </div>

          <div className="flex-1 p-8 space-y-8">
            {/* ACCOUNT STATUS */}
            <section>
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${user.isActive ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" : "bg-slate-300"}`} />
                  <span className="text-sm font-bold text-slate-700">{user.isActive ? "Active Account" : "Account Suspended"}</span>
                </div>
                <button
                  disabled={loading}
                  onClick={() => onUpdateStatus(user._id, !user.isActive)}
                  className={`p-2 rounded-xl transition-all active:scale-90 ${user.isActive ? "text-rose-500 hover:bg-rose-50" : "text-emerald-500 hover:bg-emerald-50"}`}
                >
                  <Power size={20} />
                </button>
              </div>
            </section>

            {/* CONTACT DETAILS */}
            <section className="space-y-4">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Contact Information</h3>
              <div className="grid gap-4">
                <ContactItem icon={<Mail size={16} />} label="Email Address" value={user.email} />
                <ContactItem icon={<Phone size={16} />} label="Telephone" value={user.telephone} />
                <ContactItem icon={<Calendar size={16} />} label="Joined Date" value={format(new Date(user.createdAt), "MMMM dd, yyyy")} />
              </div>
            </section>

            {/* AUDIT INFO */}
            <section className="p-6 bg-indigo-50/50 rounded-3xl border border-indigo-100">
              <div className="flex items-center gap-2 text-indigo-600 mb-4">
                <Shield size={16} />
                <span className="text-xs font-black uppercase tracking-widest">Platform Metadata</span>
              </div>
              <div className="space-y-4 text-xs font-semibold text-slate-600">
                <div className="flex justify-between">
                  <span>System ID</span>
                  <span className="font-mono text-slate-400">{user._id.substring(0, 12)}...</span>
                </div>
                <div className="flex justify-between">
                  <span>Account Type</span>
                  <span>{user.staffType || 'N/A'}</span>
                </div>
              </div>
            </section>
          </div>

          {/* FOOTER */}
          <div className="p-6 border-t border-slate-100 bg-slate-50/30 flex gap-4">
            <button className="flex-1 py-4 bg-white border border-slate-200 text-slate-700 font-bold rounded-2xl hover:bg-slate-100 transition shadow-sm">Reset Password</button>
            <button className="flex-1 py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition shadow-lg flex items-center justify-center gap-2">
              <Edit3 size={18} />
              Edit Profile
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

function ContactItem({ icon, label, value }: any) {
  return (
    <div className="flex items-start gap-4 p-2">
      <div className="text-slate-400 mt-0.5">{icon}</div>
      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{label}</p>
        <p className="text-sm font-semibold text-slate-800">{value}</p>
      </div>
    </div>
  );
}
