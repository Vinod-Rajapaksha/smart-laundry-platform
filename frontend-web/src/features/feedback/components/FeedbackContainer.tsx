import { useState, useEffect } from "react";
import FeedbackFilters from "./FeedbackFilters";
import { FeedbackTable } from "./FeedbackTable";
import { FeedbackDrawer } from "./FeedbackDrawer";
import { FeedbackStatsGrid } from "./FeedbackStats";
import { FeedbackHeader } from "./FeedbackHeader";
import type { Feedback, Tab, FeedbackStatus, FeedbackStats } from "../types";
import { feedbackApi } from "../api/feedback.api";
import { toast } from "react-hot-toast";

export default function FeedbackContainer() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [stats, setStats] = useState<FeedbackStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("All Feedbacks");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);

  const fetchFeedback = async () => {
    try {
      setLoading(true);
      const statusMap: Record<string, string> = {
        "Pending Moderation": "pending",
        "Rejected": "rejected",
        "High Rating": "approved", // or handle filtering locally
        "Low Rating": "approved"   // or handle filtering locally
      };

      const status = statusMap[activeTab];
      const responseData = await feedbackApi.getFeedbacks(status);
      const feedbackList = Array.isArray(responseData) ? responseData : (responseData as any)?.feedbacks || [];
      setFeedbacks(feedbackList);

      const statsData = await feedbackApi.getFeedbackStats();
      setStats(statsData);
    } catch (error) {
      toast.error("Failed to fetch feedback");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedback();
  }, [activeTab]);

  const handleUpdateStatus = async (id: string, status: FeedbackStatus) => {
    try {
      setActionLoading(true);
      await feedbackApi.updateFeedbackStatus(id, status);
      toast.success(`Feedback ${status}`);

      setFeedbacks(prev => prev.map(f => f._id === id ? { ...f, status } : f));
      if (selectedFeedback?._id === id) {
        setSelectedFeedback(prev => prev ? { ...prev, status } : null);
      }
    } catch (error) {
      toast.error("Action failed");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("This will permanently remove this feedback. Continue?")) return;
    try {
      setActionLoading(true);
      await feedbackApi.deleteFeedback(id);
      toast.success("Feedback removed");
      setFeedbacks(prev => prev.filter(f => f._id !== id));
      setSelectedFeedback(null);
    } catch (error) {
      toast.error("Delete failed");
    } finally {
      setActionLoading(false);
    }
  };

  const filteredFeedbacks = feedbacks.filter((f) => {
    const matchesSearch =
      f.comment.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (f.orderId?.orderNo || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (f.userId?.name || "").toLowerCase().includes(searchQuery.toLowerCase());

    if (activeTab === "High Rating") return matchesSearch && f.rating >= 4;
    if (activeTab === "Low Rating") return matchesSearch && f.rating <= 2;
    return matchesSearch;
  });

  return (
    <div className="w-full max-w-[1256px] mx-auto space-y-6 animate-in fade-in zoom-in duration-700 font-poppins pb-20">
      <FeedbackHeader />

      <FeedbackStatsGrid
        stats={stats}
        loading={loading}
      />

      <FeedbackFilters
        activeTab={activeTab}
        onTabChange={setActiveTab}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {loading && feedbacks.length === 0 ? (
        <div className="flex items-center justify-center py-20 text-blue-500">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <FeedbackTable
          feedbacks={filteredFeedbacks}
          onViewDetails={setSelectedFeedback}
        />
      )}

      <FeedbackDrawer
        isOpen={!!selectedFeedback}
        feedback={selectedFeedback}
        onClose={() => setSelectedFeedback(null)}
        onUpdateStatus={handleUpdateStatus}
        onDelete={handleDelete}
        loading={actionLoading}
      />
    </div>
  );
}
