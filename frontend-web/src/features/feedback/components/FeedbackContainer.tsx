import { useState, useEffect } from "react";
import FeedbackFilters from "./FeedbackFilters";
import FeedbackTable from "./FeedbackTable";
import FeedbackDrawer from "./FeedbackDrawer";
import type { Feedback, Tab } from "../types";
import { getFeedbacks, updateFeedbackStatus } from "../api/feedback.api";
import { toast } from "react-hot-toast";

export default function FeedbackContainer() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("All Feedbacks");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);

  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      const data = await getFeedbacks();
      setFeedbacks(data);
    } catch (error) {
      toast.error("Failed to fetch feedback");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const handleToggleStatus = async (id: string, current: boolean) => {
    try {
      setActionLoading(true);
      const newStatus = !current;
      await updateFeedbackStatus(id, newStatus);
      toast.success(newStatus ? "Review published" : "Review hidden");
      setFeedbacks(prev => prev.map(f => f._id === id ? { ...f, isActive: newStatus } : f));
      
      if (selectedFeedback?._id === id) {
        setSelectedFeedback(prev => prev ? { ...prev, isActive: newStatus } : null);
      }
    } catch (error) {
      toast.error("Moderation failed");
    } finally {
      setActionLoading(false);
    }
  };

  const filteredFeedbacks = feedbacks.filter((f) => {
    const matchesSearch = f.comment.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.userId.toLowerCase().includes(searchQuery.toLowerCase());

    if (activeTab === "High Rating") return matchesSearch && f.rating >= 4;
    if (activeTab === "Low Rating") return matchesSearch && f.rating <= 2;
    if (activeTab === "Inactive") return matchesSearch && !f.isActive;
    return matchesSearch;
  });

  const avgRating = feedbacks.length
    ? (feedbacks.reduce((s, f) => s + f.rating, 0) / feedbacks.length).toFixed(1)
    : "0.0";

  return (
    <div className="space-y-6 font-poppins">
      {/* FEEDBACK OVERVIEW */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-xl flex items-center justify-between group overflow-hidden relative">
          <div className="absolute inset-0 bg-blue-500/10 scale-150 blur-3xl -translate-y-1/2 -translate-x-1/2 group-hover:bg-blue-500/20 transition-colors duration-700" />
          <div className="relative z-10">
            <p className="text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Satisfaction Score</p>
            <p className="text-4xl font-black">{avgRating} <span className="text-sm font-normal text-slate-500">/ 5.0</span></p>
          </div>
          <div className="h-12 w-12 bg-white/10 rounded-2xl flex items-center justify-center text-amber-400 relative z-10">
            <span className="text-2xl font-bold">★</span>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Total Voices</p>
          <p className="text-3xl font-black text-slate-900">{feedbacks.length}</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Critical Alerts</p>
          <p className="text-3xl font-black text-rose-600">{feedbacks.filter(f => f.rating <= 2).length}</p>
        </div>
      </div>

      <FeedbackFilters
        activeTab={activeTab}
        onTabChange={setActiveTab}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <FeedbackTable
        feedbacks={filteredFeedbacks}
        onViewDetails={setSelectedFeedback}
        loading={loading}
      />

      <FeedbackDrawer
        isOpen={!!selectedFeedback}
        feedback={selectedFeedback}
        onClose={() => setSelectedFeedback(null)}
        onToggleStatus={handleToggleStatus}
        loading={actionLoading}
      />
    </div>
  );
}
