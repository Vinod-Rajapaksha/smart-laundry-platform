import { useState, useEffect } from "react";
import { Sparkles } from "lucide-react";
import { feedbackApi } from "../api/feedback.api";
import { toast } from "react-hot-toast";

export const FeedbackHeader = () => {
  const [aiEnabled, setAiEnabled] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await feedbackApi.getAISettings();
        setAiEnabled(data.aiSummaryEnabled);
      } catch (error) {
        console.error("Failed to fetch AI settings");
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleToggle = async () => {
    try {
      const newState = !aiEnabled;
      setAiEnabled(newState);
      await feedbackApi.updateAISummaryToggle(newState);
      toast.success(`AI Summary ${newState ? "Enabled" : "Disabled"}`);
    } catch (error) {
      setAiEnabled(!aiEnabled); // revert
      toast.error("Failed to update AI settings");
    }
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 w-full">
      <div className="flex flex-col items-start gap-2 max-w-[600px]">
        <h1 className="text-3xl font-black text-slate-900 tracking-[-0.75px] leading-9">
          Customer <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Voice</span>
        </h1>
        <p className="text-slate-500 text-base font-normal leading-normal">
          Monitor customer reviews, ratings, and feedback to maintain high service standards and satisfaction.
        </p>
      </div>

      {!loading && (
        <div className="flex items-center gap-4 bg-white p-3 px-5 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
              <Sparkles size={16} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">AI Summary</p>
              <p className="text-[10px] text-slate-500">Public Insights</p>
            </div>
          </div>

          <button
            onClick={handleToggle}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
              aiEnabled ? "bg-blue-600" : "bg-slate-200"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                aiEnabled ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>
      )}
    </div>
  );
};
