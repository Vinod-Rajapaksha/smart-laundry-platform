import { FileQuestion, Home, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 font-poppins relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-100/30 rounded-full translate-x-1/2 -translate-y-1/2 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-sky-100/30 rounded-full -translate-x-1/2 translate-y-1/2 blur-3xl" />

      <div className="relative z-10 flex flex-col items-center text-center max-w-md">
        <div className="w-24 h-24 bg-blue-50 rounded-[2rem] flex items-center justify-center text-blue-500 mb-8 shadow-xl shadow-blue-500/10 border border-blue-100 animate-in zoom-in duration-500 group">
          <FileQuestion size={48} className="group-hover:rotate-12 transition-transform duration-500" />
        </div>

        <h1 className="text-8xl font-black text-slate-900 tracking-tighter mb-4">404</h1>
        <h2 className="text-2xl font-black text-slate-900 uppercase tracking-[0.2em] mb-4">Lost in Transit</h2>
        <p className="text-slate-500 font-medium mb-12 leading-relaxed px-4">
          The page you are looking for has been misplaced or never existed. Perhaps it was lost in the wash?
        </p>

        <div className="flex flex-col gap-4 w-full">
          <Button
            onClick={() => navigate("/admin")}
            className="h-16 rounded-2xl bg-blue-600 text-white font-black text-xs uppercase tracking-[0.2em] hover:bg-blue-700 shadow-2xl shadow-blue-500/30 flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Home size={20} />
            Return to Dashboard
          </Button>
          
          <div className="flex items-center gap-2 text-slate-400 mt-4">
            <Search size={14} className="animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest">Double check the URL and try again</span>
          </div>
        </div>
      </div>

      <p className="absolute bottom-8 text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">
        Platform Integrity Services
      </p>
    </div>
  );
}
