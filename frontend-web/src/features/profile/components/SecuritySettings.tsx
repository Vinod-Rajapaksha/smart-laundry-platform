import { useState } from "react";
import { Lock, ShieldCheck, KeyRound } from "lucide-react";
import { Button } from "../../../components/ui/Button";

interface SecuritySettingsProps {
  onUpdate: (data: any) => Promise<void>;
  loading: boolean;
}

export const SecuritySettings = ({ onUpdate, loading }: SecuritySettingsProps) => {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onUpdate(formData);
    setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8 sm:mb-10">
        <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-500 shadow-sm border border-amber-100 shrink-0">
          <Lock size={24} />
        </div>
        <div>
          <h3 className="text-lg font-black text-slate-900 tracking-tight">Security Credentials</h3>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-0.5">Manage your administrative access protocol</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Current Access Key</label>
          <div className="relative">
            <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="password"
              required
              className="w-full pl-12 pr-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-amber-500/5 focus:border-amber-500/20 transition-all font-bold text-slate-700"
              placeholder="••••••••"
              value={formData.currentPassword}
              onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 sm:pt-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">New Security String</label>
            <div className="relative">
              <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="password"
                required
                className="w-full pl-12 pr-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500/20 transition-all font-bold text-slate-700"
                placeholder="••••••••"
                value={formData.newPassword}
                onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Validate Protocol</label>
            <div className="relative">
              <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="password"
                required
                className="w-full pl-12 pr-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500/20 transition-all font-bold text-slate-700"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              />
            </div>
          </div>
        </div>

        <div className="pt-8 sm:pt-10 flex flex-col sm:flex-row justify-end">
          <Button
            type="submit"
            isLoading={loading}
            className="w-full sm:w-auto bg-slate-900 border-none text-white px-8 py-6 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-slate-900/10 transition-all hover:-translate-y-1"
          >
            Update Security Protocol
          </Button>
        </div>
      </form>
    </div>
  );
};
