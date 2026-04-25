import { useState, useEffect } from "react";
import { ProfileHeader } from "./ProfileHeader";
import { ProfileInfo } from "./ProfileInfo";
import { SecuritySettings } from "./SecuritySettings";
import type { UserProfile, ProfileTab } from "../types";
import { getProfile, updateProfile, updatePassword, uploadAvatar } from "../api/profile.api";
import { toast } from "react-hot-toast";
import { User, Shield } from "lucide-react";

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
      const updatedUser = (res as any).data || res;

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
    <div className="w-full max-w-[1256px] mx-auto space-y-8 animate-in fade-in zoom-in duration-700 font-poppins pb-20">

      {/* PROFILE HEADER MAIN */}
      <ProfileHeader />

      {/* TABS ENGINE */}
      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/40 p-10 overflow-hidden">
        <div className="flex items-center gap-2 mb-12 p-1.5 bg-slate-50 rounded-3xl w-fit mx-auto border border-slate-100">
          {(["General", "Security"] as ProfileTab[]).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-8 py-3.5 rounded-[1.25rem] text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-2 ${activeTab === tab ? "bg-white shadow-xl text-blue-600 scale-[1.02]" : "text-slate-400 hover:text-slate-600"}`}
            >
              {tab === "General" && <User size={14} />}
              {tab === "Security" && <Shield size={14} />}
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
        </div>
      </div>
    </div>
  );
}
