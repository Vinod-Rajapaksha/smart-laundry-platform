import { useState, useCallback, useEffect } from "react";
import { toast } from "react-hot-toast";
import { feedbackApi } from "../api/feedback.api";
import { type Feedback, type FeedbackStats, type Tab, FEEDBACK_STATUS } from "../types";

export const useFeedback = () => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [stats, setStats] = useState<FeedbackStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("All Feedbacks");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [feedbacksRes, statsRes] = await Promise.all([
        feedbackApi.getFeedbacks(),
        feedbackApi.getFeedbackStats(),
      ]);

      setFeedbacks(feedbacksRes.feedbacks || feedbacksRes);
      setStats(statsRes);
    } catch (error) {
      toast.error("Failed to load feedback data");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleUpdateStatus = async (id: string, status: any) => {
    try {
      setActionLoading(true);
      await feedbackApi.updateFeedbackStatus(id, status);
      toast.success(`Feedback ${status}`);
      
      // Update local state
      setFeedbacks(prev => prev.map(f => f._id === id ? { ...f, status } : f));
      
      // Refresh stats
      const newStats = await feedbackApi.getFeedbackStats();
      setStats(newStats);
    } catch (error) {
      toast.error("Status update failed");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteFeedback = async (id: string) => {
    try {
      setActionLoading(true);
      await feedbackApi.deleteFeedback(id);
      toast.success("Feedback permanently deleted");
      
      setFeedbacks(prev => prev.filter(f => f._id !== id));
      const newStats = await feedbackApi.getFeedbackStats();
      setStats(newStats);
    } catch (error) {
      toast.error("Deletion failed");
    } finally {
      setActionLoading(false);
    }
  };

  const filteredFeedbacks = feedbacks.filter((f) => {
    const matchesSearch = 
      f.comment?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.userId?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.orderId?.orderNo?.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    switch (activeTab) {
      case "Pending Moderation": return f.status === FEEDBACK_STATUS.PENDING;
      case "High Rating": return f.rating >= 4;
      case "Low Rating": return f.rating <= 2;
      case "Rejected": return f.status === FEEDBACK_STATUS.REJECTED;
      default: return true;
    }
  });

  return {
    feedbacks: filteredFeedbacks,
    stats,
    loading,
    actionLoading,
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    handleUpdateStatus,
    handleDeleteFeedback,
    refresh: fetchData,
  };
};
