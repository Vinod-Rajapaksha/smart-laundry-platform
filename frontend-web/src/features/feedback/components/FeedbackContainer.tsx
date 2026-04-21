import { useState } from "react";
import { RefreshCcw, Search } from "lucide-react";
import { FeedbackTable } from "./FeedbackTable";
import { FeedbackDrawer } from "./FeedbackDrawer";
import { FeedbackStatsGrid } from "./FeedbackStats";
import { useFeedback } from "../hooks/useFeedback";
import type { Feedback } from "../types";

export default function FeedbackContainer() {
  const {
    feedbacks,
    stats,
    loading,
    actionLoading,
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    handleUpdateStatus,
    handleDeleteFeedback,
    refresh,
  } = useFeedback();

  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);

  const handleOpenDrawer = (feedback: Feedback) => {
    setSelectedFeedback(feedback);
  };

  const handleCloseDrawer = () => {
    setSelectedFeedback(null);
  };

  const onUpdateStatusAndClose = async (id: string, status: any) => {
    await handleUpdateStatus(id, status);
    // Find updated feedback in our list to sync drawer
    const updated = feedbacks.find(f => f._id === id);
    if(updated) {
       setSelectedFeedback({...updated, status});
    }
  };

  return (
    <div className="w-full max-w-[1256px] mx-auto space-y-6 animate-in fade-in duration-500 font-poppins pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-4 md:px-0">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Voice Hub</h1>
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-1">Unified Customer Sentiment & Moderation</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={refresh}
            className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-500 hover:text-blue-600 transition-colors shadow-sm"
          >
            <RefreshCcw size={18} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      <FeedbackStatsGrid stats={stats} loading={loading} />

      {/* FILTERS & SEARCH */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 px-4 md:px-0">
        <div className="md:col-span-8 flex bg-white p-1 rounded-2xl border border-slate-100 shadow-sm overflow-x-auto no-scrollbar">
          {["All Feedbacks", "Pending Moderation", "High Rating", "Low Rating", "Rejected"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`flex-1 py-2.5 px-6 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                activeTab === tab 
                  ? "bg-slate-900 text-white shadow-lg shadow-slate-900/20" 
                  : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        
        <div className="md:col-span-4 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={16} />
          <input 
            type="text"
            placeholder="Search reviews or customers..."
            className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500/10 transition shadow-sm font-bold text-xs"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {loading && feedbacks.length === 0 ? (
        <div className="flex items-center justify-center py-40">
           <div className="flex flex-col items-center gap-4">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-100 border-b-blue-600"></div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Compiling Customer Voices...</p>
           </div>
        </div>
      ) : (
        <FeedbackTable 
          feedbacks={feedbacks}
          onViewDetails={handleOpenDrawer}
        />
      )}

      <FeedbackDrawer
        isOpen={!!selectedFeedback}
        feedback={selectedFeedback}
        onClose={handleCloseDrawer}
        onUpdateStatus={onUpdateStatusAndClose}
        onDelete={async (id) => {
           await handleDeleteFeedback(id);
           handleCloseDrawer();
        }}
        loading={actionLoading}
      />
    </div>
  );
}
