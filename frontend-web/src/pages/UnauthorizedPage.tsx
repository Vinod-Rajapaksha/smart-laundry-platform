import { ShieldAlert, ArrowLeft, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button";

export default function UnauthorizedPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 font-poppins relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-100/40 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-100/40 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl" />

      <div className="relative z-10 flex flex-col items-center text-center max-w-md">
        <div className="w-24 h-24 bg-rose-50 rounded-[2rem] flex items-center justify-center text-rose-500 mb-8 shadow-xl shadow-rose-500/10 border border-rose-100 animate-bounce group hover:animate-none transition-all">
          <ShieldAlert size={48} className="group-hover:scale-110 transition-transform" />
        </div>

        <h1 className="text-8xl font-black text-slate-900 tracking-tighter mb-4">403</h1>
        <h2 className="text-2xl font-black text-slate-900 uppercase tracking-[0.2em] mb-4">Access Denied</h2>
        <p className="text-slate-500 font-medium mb-12 leading-relaxed px-4">
          It seems you don't have the necessary administrative privileges to view this high-clearance zone.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full">
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            className="flex-1 h-14 rounded-2xl border-slate-200 bg-white text-slate-700 font-bold hover:bg-slate-50 flex items-center justify-center gap-2"
          >
            <ArrowLeft size={18} />
            Go Back
          </Button>
          <Button
            onClick={() => navigate("/admin")}
            className="flex-1 h-14 rounded-2xl bg-slate-900 text-white font-bold hover:bg-slate-800 shadow-xl shadow-slate-900/20 flex items-center justify-center gap-2"
          >
            <Home size={18} />
            Dashboard
          </Button>
        </div>
      </div>

      <p className="absolute bottom-8 text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">
        B & W Laundry Administrative Control
      </p>
    </div>
  );
}
