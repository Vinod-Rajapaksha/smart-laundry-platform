import { motion } from "framer-motion";
import { Download, QrCode, Smartphone, Sparkles, Wind } from "lucide-react";

export default function Hero() {
  return (
    <section id="home" className="relative min-h-screen pt-32 pb-20 overflow-hidden bg-slate-50">
      {/* Background Orbs */}
      <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[600px] h-[600px] bg-blue-100 rounded-full blur-[120px] opacity-60 animate-pulse-soft" />
      <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-[500px] h-[500px] bg-sky-100 rounded-full blur-[100px] opacity-60 animate-pulse-soft" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-600 font-semibold text-sm mb-6 border border-blue-100">
              <Sparkles size={16} />
              <span>Smartest Laundry in Town</span>
            </div>

            <h1 className="text-6xl sm:text-7xl font-extrabold text-slate-900 leading-[1.1] mb-6">
              Smart Laundry. <br />
              <span className="text-blue-600">Delivered Fresh.</span>
            </h1>

            <p className="text-xl text-slate-600 leading-relaxed mb-10 max-w-lg">
              Experience the future of laundry service. We pick up, clean, and deliver your clothes with professional care, all managed from our smart mobile app.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-6 mb-10">
              <button className="w-full sm:w-auto bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-2xl shadow-blue-500/40 hover:bg-blue-700 hover:-translate-y-1 transition-all flex items-center justify-center gap-3 active:scale-95">
                <Download size={22} />
                Download Mobile App
              </button>

              <div className="flex items-center gap-4 p-3 bg-white rounded-2xl border border-slate-100 shadow-xl">
                <div className="w-16 h-16 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100">
                  <QrCode size={32} className="text-slate-900" />
                </div>
                <div className="text-sm">
                  <p className="font-bold text-slate-900 leading-tight">Scan to <br />Download</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-8 py-6 border-t border-slate-200">
              <div>
                <p className="text-3xl font-bold text-slate-900">10k+</p>
                <p className="text-sm text-slate-500 font-medium uppercase tracking-wider">Happy Customers</p>
              </div>
              <div className="w-px h-10 bg-slate-200" />
              <div>
                <p className="text-3xl font-bold text-slate-900">4.9/5</p>
                <p className="text-sm text-slate-500 font-medium uppercase tracking-wider">App Rating</p>
              </div>
            </div>
          </motion.div>

          {/* Right Visuals */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="relative"
          >
            {/* Animated Washing Machine Concept */}
            <div className="relative w-full aspect-square max-w-md mx-auto">
              <div className="absolute inset-0 bg-white rounded-[60px] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] border-8 border-slate-50 overflow-hidden neumorph">
                {/* Front Loading Glass */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4/5 h-4/5 rounded-full border-[15px] border-slate-100 bg-slate-50/50 flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 bg-blue-400/20 animate-spin-slow opacity-30" />
                  <div className="relative w-3/4 h-3/4 rounded-full border-4 border-white/40 glass flex items-center justify-center">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                      className="text-blue-500 opacity-60"
                    >
                      <Waves size={100} strokeWidth={1} />
                    </motion.div>
                  </div>
                </div>

                {/* Control Panel */}
                <div className="absolute top-10 left-1/2 -translate-x-1/2 w-3/4 h-12 glass rounded-2xl border border-white/50 flex items-center justify-around px-4">
                  <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse" />
                  <div className="h-1 w-1/2 bg-slate-200 rounded-full overflow-hidden">
                    <motion.div
                      animate={{ x: ["-100%", "100%"] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                      className="h-full w-full bg-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <motion.div
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute -top-10 -right-10 w-24 h-24 glass rounded-3xl flex items-center justify-center text-blue-500 shadow-2xl border border-white/50"
              >
                <Sparkles size={40} />
              </motion.div>

              <motion.div
                animate={{ y: [0, 20, 0] }}
                transition={{ duration: 5, repeat: Infinity }}
                className="absolute -bottom-10 -left-10 w-28 h-28 glass rounded-3xl flex items-center justify-center text-sky-500 shadow-2xl border border-white/50"
              >
                <Wind size={48} />
              </motion.div>

              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute top-1/2 -right-12 w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-2xl"
              >
                <Smartphone size={32} />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Waves({ size, strokeWidth }: { size: number; strokeWidth: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 6c.6.5 1.2 1 2.5 1C5.8 7 7 6 7 6s1.2-1 2.5-1c1.3 0 2.5 1 2.5 1s1.2 1 2.5 1c1.3 0 2.5-1 2.5-1s1.2-1 2.5-1c1.3 0 2.5 1 2.5 1" />
      <path d="M2 12c.6.5 1.2 1 2.5 1 1.3 0 2.5-1 2.5-1s1.2-1 2.5-1c1.3 0 2.5 1 2.5 1s1.2 1 2.5 1c1.3 0 2.5-1 2.5-1s1.2-1 2.5-1c1.3 0 2.5 1 2.5 1" />
      <path d="M2 18c.6.5 1.2 1 2.5 1 1.3 0 2.5-1 2.5-1s1.2-1 2.5-1c1.3 0 2.5 1 2.5 1s1.2 1 2.5 1c1.3 0 2.5-1 2.5-1s1.2-1 2.5-1c1.3 0 2.5 1 2.5 1" />
    </svg>
  );
}
