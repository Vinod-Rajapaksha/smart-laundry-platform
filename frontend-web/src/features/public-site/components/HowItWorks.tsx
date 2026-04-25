import { motion } from "framer-motion";
import { ShoppingCart, Truck, Scissors, PackageCheck } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      id: "01",
      title: "Place Your Order",
      desc: "Use our intuitive mobile app to select services and schedule a pickup time.",
      icon: <ShoppingCart size={32} />,
    },
    {
      id: "02",
      title: "We Pick Up",
      desc: "Our friendly agent arrives at your doorstep to collect your laundry.",
      icon: <Truck size={32} />,
    },
    {
      id: "03",
      title: "Cleaning Process",
      desc: "Your clothes are treated with eco-friendly solvents and expert care.",
      icon: <Scissors size={32} />,
    },
    {
      id: "04",
      title: "Doorstep Delivery",
      desc: "Fresh, clean, and folded laundry is delivered back to you in record time.",
      icon: <PackageCheck size={32} />,
    },
  ];

  return (
    <section id="how-it-works" className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-5xl font-extrabold text-slate-900 mb-6">How It Works</h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Our seamless process ensures your laundry experience is effortless from start to finish.
          </p>
        </div>

        <div className="relative">
          {/* Connecting Line */}
          <div className="hidden lg:block absolute top-1/2 left-0 w-full h-1 bg-slate-100 -translate-y-1/2 z-0" />

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 relative z-10">
            {steps.map((step, idx) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.2 }}
                className="flex flex-col items-center text-center"
              >
                <div className="relative mb-10 group">
                  {/* Step Number Badge */}
                  <div className="absolute -top-4 -right-4 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-lg border-4 border-white z-20">
                    {step.id}
                  </div>

                  {/* Icon Container */}
                  <div className="w-32 h-32 rounded-[40px] bg-white shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100 flex items-center justify-center text-blue-600 group-hover:scale-110 group-hover:shadow-blue-200 transition-all duration-500 neumorph">
                    {step.icon}
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-slate-900 mb-4">{step.title}</h3>
                <p className="text-slate-600 leading-relaxed max-w-[250px]">
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="mt-24 text-center">
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="inline-block p-4 rounded-full bg-blue-50 text-blue-600 mb-6"
          >
            <PackageCheck size={24} />
          </motion.div>
          <p className="text-slate-500 font-semibold tracking-widest uppercase">Experience the ease</p>
        </div>
      </div>
    </section>
  );
}
