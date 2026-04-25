import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles, BrainCircuit, Activity } from "lucide-react";
import { apiFetch } from "../../../services/http/client";

interface SummaryData {
  summary: string;
  sentiment: string;
  count: number;
}

export default function AISummary() {
  const [data, setData] = useState<SummaryData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await apiFetch<{ data: SummaryData }>("/feedback/public/summary");
        const summaryData = (response as any).data || response;
        if (summaryData && summaryData.summary) {
          setData(summaryData);
        }
      } catch (err) {
        console.error("Failed to fetch AI summary", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, []);

  if (loading) return (
    <div className="max-w-3xl mx-auto mb-16 h-24 glass rounded-3xl animate-pulse flex items-center justify-center">
      <div className="flex items-center gap-3 text-blue-400">
        <BrainCircuit className="animate-bounce" size={24} />
        <span className="font-medium tracking-wide">AI is analyzing the community pulse...</span>
      </div>
    </div>
  );

  if (!data || !data.summary) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="max-w-4xl mx-auto mb-20 relative group"
    >
      {/* Glow Effect */}
      <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[40px] blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>

      <div className="relative glass p-8 md:p-10 rounded-[36px] border-white/50 overflow-hidden">
        {/* Animated Background Line */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-30">
          <motion.div
            className="w-full h-full bg-blue-400"
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          />
        </div>

        <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
          <div className="flex-shrink-0">
            <div className="relative">
              <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-blue-500/40 transform -rotate-6">
                <Sparkles size={40} />
              </div>
              <motion.div
                className="absolute -bottom-2 -right-2 w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white border-4 border-white"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Activity size={14} />
              </motion.div>
            </div>
          </div>

          <div className="flex-grow text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-3">
              <span className="px-3 py-1 bg-blue-100 text-blue-700 text-[10px] font-black uppercase tracking-[0.2em] rounded-full">
                Smart Insights
              </span>
              <span className="text-slate-400 text-xs font-medium">
                Based on {data.count} recent reviews
              </span>
            </div>
            <h3 className="text-2xl md:text-3xl font-black text-slate-900 leading-tight mb-4 italic">
              " {data.summary} "
            </h3>
            <div className="flex items-center justify-center md:justify-start gap-2 text-blue-600 font-bold text-sm">
              <BrainCircuit size={16} />
              <span>Community Sentiment: Highly Positive</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
