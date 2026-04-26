import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Star, Quote, ChevronLeft, ChevronRight, MessageSquare } from "lucide-react";
import { apiFetch } from "../../../services/http/client";
import AISummary from "./AISummary";

interface Feedback {
  _id: string;
  rating: number;
  comment: string;
  userId: {
    name: string;
  };
  createdAt: string;
}

export default function Reviews() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const autoPlayRef = useRef<number | null>(null);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const response = await apiFetch<{ data: Feedback[] }>("/feedback/public?limit=10");
        const rawData = (response as any).data || response;
        if (Array.isArray(rawData)) {
          const uniqueById = Array.from(new Map(rawData.map(item => [item._id, item])).values());
          const uniqueByComment = Array.from(new Map(uniqueById.map(item => [item.comment, item])).values());
          setFeedbacks(uniqueByComment);
        } else {
          setFeedbacks([]);
        }
      } catch (err) {
        console.error("Failed to fetch feedbacks", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeedbacks();
  }, []);

  useEffect(() => {
    startAutoPlay();
    return () => stopAutoPlay();
  }, [feedbacks, currentIndex]);

  const startAutoPlay = () => {
    stopAutoPlay();
    autoPlayRef.current = window.setInterval(() => {
      nextSlide();
    }, 5000);
  };

  const stopAutoPlay = () => {
    if (autoPlayRef.current) clearInterval(autoPlayRef.current);
  };

  const nextSlide = () => {
    if (feedbacks.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % feedbacks.length);
  };

  const prevSlide = () => {
    if (feedbacks.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + feedbacks.length) % feedbacks.length);
  };

  const onDragEnd = (_: any, info: any) => {
    const threshold = 50;
    if (info.offset.x < -threshold) {
      nextSlide();
    } else if (info.offset.x > threshold) {
      prevSlide();
    }
  };

  if (loading) return (
    <div className="py-24 text-center">
      <div className="relative w-20 h-20 mx-auto">
        <div className="absolute inset-0 border-4 border-blue-100 rounded-full" />
        <div className="absolute inset-0 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
      <p className="mt-4 text-slate-500 font-medium animate-pulse">Loading real reviews...</p>
    </div>
  );

  if (feedbacks.length === 0) return null;

  return (
    <section id="reviews" className="py-10 bg-white relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-blue-50 rounded-full blur-[100px] opacity-50" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-indigo-50 rounded-full blur-[100px] opacity-50" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-8">
          <div className="text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-600 font-bold text-sm mb-4 border border-blue-100">
              <MessageSquare size={16} />
              <span>Customer Voice</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
              Real People. <br />
              <span className="text-blue-600">Real Reviews.</span>
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={prevSlide}
              className="w-12 h-12 rounded-xl bg-white shadow-lg flex items-center justify-center text-slate-900 hover:bg-blue-600 hover:text-white transition-all active:scale-90 border border-slate-100 group"
            >
              <ChevronLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
            </button>
            <button
              onClick={nextSlide}
              className="w-12 h-12 rounded-xl bg-white shadow-lg flex items-center justify-center text-slate-900 hover:bg-blue-600 hover:text-white transition-all active:scale-90 border border-slate-100 group"
            >
              <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        <AISummary />

        <div className="relative cursor-grab active:cursor-grabbing">
          <motion.div
            className="flex gap-6"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.15}
            onDragEnd={onDragEnd}
            animate={{ x: `calc(-${currentIndex * 100}% - ${currentIndex * 1.5}rem)` }}
            transition={{ type: "spring", stiffness: 250, damping: 25 }}
            whileTap={{ cursor: "grabbing" }}
          >
            {feedbacks.map((item) => (
              <div
                key={item._id}
                className="min-w-full md:min-w-[calc(50%-0.75rem)] lg:min-w-[calc(33.333%-1rem)]"
              >
                <div className="h-full glass p-8 rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border-white/80 flex flex-col justify-between relative overflow-hidden group min-h-[220px]">
                  <Quote className="absolute -bottom-4 -right-4 text-blue-500/5 group-hover:scale-110 transition-transform duration-700" size={150} />

                  <div>
                    <div className="flex gap-1 mb-6">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={18}
                          className={i < item.rating ? "text-amber-400 fill-amber-400" : "text-slate-200"}
                        />
                      ))}
                    </div>

                    <p className="text-lg text-slate-800 leading-relaxed font-medium italic relative z-10 line-clamp-5">
                      "{item.comment || "B&W Laundry provides the most professional and timely service I've ever used. My clothes are always fresh and perfectly folded."}"
                    </p>
                  </div>

                  <div className="flex items-center gap-4 mt-8 relative z-10">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white text-lg font-black shadow-lg">
                      {item.userId.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-slate-900 leading-none mb-1">{item.userId.name}</h4>
                      <p className="text-xs text-blue-600 font-bold uppercase tracking-wider">Verified User</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Indicators */}
        <div className="flex justify-center gap-2 mt-12">
          {feedbacks.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`h-1.5 rounded-full transition-all duration-500 ${i === currentIndex ? "w-8 bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.3)]" : "w-1.5 bg-slate-200 hover:bg-slate-300"
                }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
