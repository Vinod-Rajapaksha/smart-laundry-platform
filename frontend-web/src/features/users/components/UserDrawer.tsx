import { useState } from "react";
import type { User } from "../types";
import { X, User as UserIcon, Shield, Mail, Phone, Calendar, Power, Edit3, Key, Lock, Check } from "lucide-react";
import { format } from "date-fns";
import UserForm from "./UserForm";
import ConfirmDialog from "../../../components/common/ConfirmDialog";
import { AlertTriangle } from "lucide-react";
import { toast } from "react-hot-toast";

interface UserDrawerProps {
  user: User | null;
  onClose: () => void;
  onUpdateStatus: (id: string, isActive: boolean) => void;
  onUpdateUser: (id: string, data: any) => Promise<void>;
  onDeleteUser: (id: string) => Promise<void>;
  loading?: boolean;
}

export default function UserDrawer({
  user,
  onClose,
  onUpdateStatus,
  onUpdateUser,
  onDeleteUser,
  loading
}: UserDrawerProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [resetLoading, setResetLoading] = useState(false);

  if (!user) return null;

  const handleEditSubmit = async (data: any) => {
    await onUpdateUser(user._id, data);
    setIsEditing(false);
  };

  const handleResetPassword = async () => {
    if (!newPassword || newPassword.length < 6) {
      return toast.error("Password must be at least 6 characters");
    }

    try {
      setResetLoading(true);
      await onUpdateUser(user._id, { password: newPassword });
      toast.success("Password reset successfully");
      setIsResettingPassword(false);
      setNewPassword("");
    } catch (error) {
      toast.error("Failed to reset password");
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 transition-opacity"
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
            {isEditing ? (
              <div className="animate-in fade-in zoom-in-95 duration-200">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Edit User Details</h3>
                <UserForm
                  initialData={user}
                  onSubmit={handleEditSubmit}
                  onCancel={() => setIsEditing(false)}
                  isLoading={loading}
                />
              </div>
            ) : (
              <>
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
                      title={user.isActive ? "Suspend Account" : "Activate Account"}
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

                {/* RESET PASSWORD SECTION */}
                {isResettingPassword && (
                  <section className="p-6 bg-amber-50 rounded-[2rem] border border-amber-100 animate-in slide-in-from-top-4 duration-300">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-white rounded-xl text-amber-600 shadow-sm">
                        <Lock size={18} />
                      </div>
                      <h4 className="text-sm font-bold text-slate-900">Set New Password</h4>
                    </div>
                    <div className="relative">
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Enter secure password"
                        className="w-full px-5 py-4 bg-white border border-amber-200 rounded-2xl text-sm font-medium focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all outline-none pr-12"
                        autoFocus
                      />
                      <button
                        onClick={handleResetPassword}
                        disabled={resetLoading || !newPassword}
                        className="absolute right-2 top-2 p-3 bg-amber-600 text-white rounded-xl hover:bg-amber-700 transition shadow-lg active:scale-90 disabled:opacity-50"
                      >
                        {resetLoading ? (
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <Check size={18} />
                        )}
                      </button>
                    </div>
                    <button
                      onClick={() => {
                        setIsResettingPassword(false);
                        setNewPassword("");
                      }}
                      className="mt-3 text-[10px] font-black text-amber-700 uppercase tracking-widest hover:underline px-2"
                    >
                      Cancel Reset
                    </button>
                  </section>
                )}

                <div className="pt-4">
                  <button
                    onClick={() => setShowConfirm(true)}
                    className="w-full py-4 text-rose-600 font-bold text-sm hover:bg-rose-50 rounded-2xl transition border border-transparent hover:border-rose-100"
                  >
                    Deactivate Account
                  </button>
                </div>
              </>
            )}
          </div>

          {/* FOOTER - Only show in view mode */}
          {!isEditing && (
            <div className="p-6 border-t border-slate-100 bg-slate-50/30 flex gap-4">
              {!isResettingPassword && (
                <button
                  onClick={() => setIsResettingPassword(true)}
                  className="flex-1 py-4 bg-white border border-slate-200 text-slate-700 font-bold rounded-2xl hover:bg-slate-100 transition shadow-sm flex items-center justify-center gap-2"
                >
                  <Key size={18} className="text-slate-400" />
                  Reset Password
                </button>
              )}
              <button
                onClick={() => setIsEditing(true)}
                className="flex-1 py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition shadow-lg flex items-center justify-center gap-2"
              >
                <Edit3 size={18} />
                Edit Profile
              </button>
            </div>
          )}
        </div>
      </div>
      <ConfirmDialog
        open={showConfirm}
        title="Deactivate Account"
        description={`Are you sure you want to deactivate ${user.name}? This user will no longer be able to log in to the platform.`}
        confirmText="Deactivate"
        onConfirm={() => {
          onDeleteUser(user._id);
          setShowConfirm(false);
        }}
        onCancel={() => setShowConfirm(false)}
        icon={<AlertTriangle size={32} />}
      />
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
