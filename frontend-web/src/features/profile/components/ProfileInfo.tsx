import { useState, useRef } from "react";
import { User, Mail, Phone, Save, CloudUpload } from "lucide-react";
import type { UserProfile } from "../types";
import { Button } from "../../../components/ui/Button";

interface ProfileInfoProps {
  profile: UserProfile;
  onSave: (data: Partial<UserProfile>) => Promise<void>;
  onAvatarUpload: (file: File) => Promise<void>;
  loading: boolean;
}

export const ProfileInfo = ({ profile, onSave, onAvatarUpload, loading }: ProfileInfoProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    name: profile.name,
    email: profile.email,
    phone: profile.phone || "",
    avatar: profile.avatar || "",
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await onAvatarUpload(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row gap-10 items-start">
        {/* Avatar Section */}
        <div className="relative group self-center md:self-start">
          <input
            type="file"
            className="hidden"
            ref={fileInputRef}
            accept="image/*"
            onChange={handleFileChange}
          />
          <div
            onClick={() => fileInputRef.current?.click()}
            className="w-32 h-32 rounded-[2.5rem] overflow-hidden border-4 border-white shadow-2xl relative cursor-pointer"
          >
            {formData.avatar ? (
              <img src={formData.avatar} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-slate-50 flex items-center justify-center text-slate-300">
                <User size={40} />
              </div>
            )}
            <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <CloudUpload className="text-white" size={24} />
            </div>
          </div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center mt-4">Identity Visualization</p>
        </div>

        {/* Info Grid */}
        <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                className="w-full pl-12 pr-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500/20 transition-all font-bold text-slate-700"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                disabled
                className="w-full pl-12 pr-5 py-4 bg-slate-100 border border-slate-100 rounded-2xl text-slate-400 font-bold cursor-not-allowed"
                value={formData.email}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                className="w-full pl-12 pr-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500/20 transition-all font-bold text-slate-700"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Account Role</label>
            <div className="px-5 py-4 bg-blue-50 border border-blue-100 rounded-2xl text-blue-600 font-black text-xs uppercase tracking-widest h-[58px] flex items-center">
              {profile.role} Protocol Access
            </div>
          </div>
        </div>
      </div>

      <div className="pt-6 border-t border-slate-50 flex justify-end">
        <Button
          type="submit"
          isLoading={loading}
          className="bg-slate-900 text-white px-8 py-6 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-slate-900/20 flex items-center gap-3 transition-all hover:-translate-y-1"
        >
          <Save size={18} />
          Persist Profile Changes
        </Button>
      </div>
    </form>
  );
};
