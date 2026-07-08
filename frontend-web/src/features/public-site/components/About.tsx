import { motion } from "framer-motion";
import { CheckCircle2, ShieldCheck, Zap } from "lucide-react";

export default function About() {
  const features = [
    {
      title: "Fast Turnaround",
      desc: "Get your clean clothes back within 24 hours. Speed meets quality.",
      icon: <Zap className="text-amber-500" size={32} />,
    },
    {
      title: "Reliable Service",
      desc: "Trusted by thousands. We treat your clothes like they're our own.",
      icon: <ShieldCheck className="text-green-500" size={32} />,
    },
    {
      title: "Smart Tracking",
      desc: "Track every step of your laundry journey directly in the app.",
      icon: <CheckCircle2 className="text-blue-500" size={32} />,
    },
  ];

  return (
    <section id="about" className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl font-extrabold text-slate-900 mb-4"
          >
            The EcoShine Story
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-slate-600 max-w-3xl mx-auto"
          >
            Born from a simple idea: laundry shouldn't be a chore. We combine traditional care with futuristic technology to give you back your time.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-3 gap-12">
          {features.map((f, idx) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.2 }}
              className="p-10 rounded-[40px] bg-slate-50 border border-slate-100 hover:shadow-2xl hover:shadow-slate-200 transition-all group"
            >
              <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform mb-8">
                {f.icon}
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">{f.title}</h3>
              <p className="text-slate-600 leading-relaxed text-lg">
                {f.desc}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          className="mt-24 p-12 md:p-16 rounded-[60px] bg-blue-600 text-white relative overflow-hidden flex items-center justify-center text-center"
        >
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-400/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl" />

          <div className="relative z-10 max-w-3xl">
            <div className="inline-block px-4 py-1.5 rounded-full bg-blue-500/30 backdrop-blur-md text-blue-100 text-sm font-bold uppercase tracking-widest mb-6">
              Our Purpose
            </div>
            <h3 className="text-4xl md:text-5xl font-black mb-8 tracking-tight">Revolutionizing Laundry. <br className="hidden md:block" /> Providing Freedom.</h3>
            <p className="text-xl md:text-2xl text-blue-50 leading-relaxed font-medium">
              "To revolutionize the way the world handles laundry through innovation, reliability, and a customer-first approach. We're not just cleaning clothes; we're providing freedom."
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
