import { Facebook, Twitter, Instagram, Linkedin, Apple, Play } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 py-20 relative overflow-hidden">
      {/* Decorative Blur */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-16 mb-16">

          {/* Brand Info */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-white">
              <img src="/logo.png" alt="EcoShine Logo" className="w-12 h-12 object-contain" />
              <span className="text-2xl font-extrabold tracking-tight">
                EcoShine <span className="text-blue-500">Laundry</span>
              </span>
            </div>
            <p className="leading-relaxed">
              The smartest way to handle your laundry. Premium care, digital tracking, and eco-friendly cleaning delivered right to your doorstep.
            </p>
            <div className="flex gap-4">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, idx) => (
                <a key={idx} href="#" className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all">
                  <Icon size={20} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold text-lg mb-8 uppercase tracking-widest">Quick Links</h4>
            <ul className="space-y-4">
              {["Home", "About Us", "Services", "How It Works", "Reviews"].map((item) => (
                <li key={item}>
                  <a href={`#${item.toLowerCase().replace(/ /g, "-")}`} className="hover:text-blue-500 transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-bold text-lg mb-8 uppercase tracking-widest">Our Services</h4>
            <ul className="space-y-4">
              {["Wash & Fold", "Dry Cleaning", "Ironing Service", "Pickup & Delivery", "Corporate Laundry"].map((item) => (
                <li key={item}>
                  <a href="#" className="hover:text-blue-500 transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* App Download */}
          <div>
            <h4 className="text-white font-bold text-lg mb-8 uppercase tracking-widest">Download App</h4>
            <p className="mb-8">Available on all major platforms. Scan QR or click below.</p>
            <div className="space-y-4">
              <button className="w-full flex items-center gap-4 bg-slate-900 border border-slate-800 p-4 rounded-2xl hover:border-blue-500 transition-all group">
                <div className="text-white group-hover:text-blue-500 transition-colors">
                  <Apple size={32} />
                </div>
                <div className="text-left">
                  <p className="text-[10px] font-bold uppercase opacity-50 leading-none mb-1">Download on</p>
                  <p className="text-lg font-bold text-white leading-none">App Store</p>
                </div>
              </button>
              <button className="w-full flex items-center gap-4 bg-slate-900 border border-slate-800 p-4 rounded-2xl hover:border-blue-500 transition-all group">
                <div className="text-white group-hover:text-blue-500 transition-colors">
                  <Play size={32} />
                </div>
                <div className="text-left">
                  <p className="text-[10px] font-bold uppercase opacity-50 leading-none mb-1">Get it on</p>
                  <p className="text-lg font-bold text-white leading-none">Google Play</p>
                </div>
              </button>
            </div>
          </div>
        </div>

        <div className="pt-10 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-6">
          <p>© 2026 EcoShine. All rights reserved.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-blue-500 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-blue-500 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
