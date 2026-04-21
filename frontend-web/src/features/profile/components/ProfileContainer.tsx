import { useState, useEffect } from "react";
import { ProfileInfo } from "./ProfileInfo";
import { SecuritySettings } from "./SecuritySettings";
import type { UserProfile, ProfileTab } from "../types";
import { getProfile, updateProfile, updatePassword, uploadAvatar } from "../api/profile.api";
import { toast } from "react-hot-toast";
import { User, Shield, Activity, Calendar, Award } from "lucide-react";
import { format } from "date-fns";

export default function ProfileContainer() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<ProfileTab>("General");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const data = await getProfile();
        setProfile(Array.isArray(data) ? data[0] : (data as any).data || data);
      } catch (error) {
        toast.error("Failed to load profile synchronization");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleUpdateProfile = async (data: Partial<UserProfile>) => {
    try {
      setActionLoading(true);
      await updateProfile(data);
      toast.success("Profile updated");
      // Update local state
      setProfile(prev => prev ? { ...prev, ...data } : null);
    } catch (error) {
      toast.error("Profile sync failed");
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdatePassword = async (data: any) => {
    if (data.newPassword !== data.confirmPassword) {
      toast.error("Passcodes mismatch");
      return;
    }
    try {
      setActionLoading(true);
      await updatePassword(data);
      toast.success("Security protocol hardened");
    } catch (error) {
      toast.error("Security hard-sync failed");
    } finally {
      setActionLoading(false);
    }
  };

  const handleAvatarUpload = async (file: File) => {
    try {
      setActionLoading(true);
      const res = await uploadAvatar(file);
      const updatedUser = res.data;
      
      setProfile(updatedUser);
      toast.success("Identity visualization synchronized");
    } catch (error) {
      toast.error("Avatar upload protocol failed");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto animate-pulse py-10 space-y-10">
        <div className="h-64 bg-white rounded-[3rem] border border-slate-100 shadow-sm" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="h-40 bg-white rounded-3xl border border-slate-100" />
          <div className="h-40 bg-white rounded-3xl border border-slate-100" />
          <div className="h-40 bg-white rounded-3xl border border-slate-100" />
        </div>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="max-w-6xl mx-auto space-y-8 py-4 animate-in fade-in duration-700 pb-20 font-poppins">

      {/* PROFILE HEADER OVERLAY */}
      <div className="bg-slate-900 rounded-[3rem] p-10 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full translate-x-1/2 -translate-y-1/2 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full -translate-x-1/2 translate-y-1/2 blur-3xl" />

        <div className="relative z-10 flex flex-col md:flex-row gap-10 items-center">
          <div className="w-40 h-40 rounded-[2.5rem] border-4 border-slate-800 p-1 bg-slate-900 shadow-2xl overflow-hidden relative">
            {profile.avatar ? (
              <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover rounded-[2rem]" />
            ) : (
              <div className="w-full h-full bg-slate-800 flex items-center justify-center text-slate-600 rounded-[2rem]">
                <User size={48} />
              </div>
            )}
          </div>

          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-4">
              <h1 className="text-4xl font-black text-white tracking-tight">{profile.name}</h1>
              <span className="px-5 py-1.5 bg-blue-500 text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-500/20">
                {profile.role}
              </span>
            </div>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-10">
              <div className="flex items-center gap-3 text-slate-400">
                <Calendar size={18} className="text-blue-400" />
                <div className="flex flex-col">
                  <span className="text-[9px] font-black uppercase tracking-widest leading-none mb-1 opacity-50">Join Orbit</span>
                  <span className="text-sm font-bold text-slate-100">{format(new Date(profile.createdAt), "MMMM yyyy")}</span>
                </div>
              </div>
              <div className="flex items-center gap-3 text-slate-400">
                <Award size={18} className="text-amber-400" />
                <div className="flex flex-col">
                  <span className="text-[9px] font-black uppercase tracking-widest leading-none mb-1 opacity-50">Logistics Points</span>
                  <span className="text-sm font-bold text-slate-100">{profile.loyaltyPoints || 0}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* TABS ENGINE */}
      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/40 p-10 overflow-hidden">
        <div className="flex items-center gap-2 mb-12 p-1.5 bg-slate-50 rounded-3xl w-fit border border-slate-100">
          {(["General", "Security", "Activity"] as ProfileTab[]).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-8 py-3.5 rounded-[1.25rem] text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-2 ${activeTab === tab ? "bg-white shadow-xl text-blue-600 scale-[1.02]" : "text-slate-400 hover:text-slate-600"}`}
            >
              {tab === "General" && <User size={14} />}
              {tab === "Security" && <Shield size={14} />}
              {tab === "Activity" && <Activity size={14} />}
              {tab}
            </button>
          ))}
        </div>

        <div className="relative">
          {activeTab === "General" && (
            <ProfileInfo
              profile={profile}
              onSave={handleUpdateProfile}
              onAvatarUpload={handleAvatarUpload}
              loading={actionLoading}
            />
          )}

          {activeTab === "Security" && (
            <SecuritySettings
              onUpdate={handleUpdatePassword}
              loading={actionLoading}
            />
          )}

          {activeTab === "Activity" && (
            <div className="py-20 text-center bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-100">
              <Activity size={48} className="mx-auto text-slate-200 mb-4" />
              <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Administrative Audit Logs Pending</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
