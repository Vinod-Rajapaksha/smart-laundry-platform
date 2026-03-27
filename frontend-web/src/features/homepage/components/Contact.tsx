import { Mail, MapPin, Phone } from "lucide-react";

export default function Contact() {
  return (
    <section id="contact" className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="grid gap-8 rounded-3xl bg-slate-900 p-8 text-white shadow-2xl shadow-slate-900/25 lg:grid-cols-2 lg:p-10">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-300">Contact</p>
          <h3 className="mt-3 text-3xl font-extrabold">Let&apos;s schedule your next pickup</h3>
          <p className="mt-4 max-w-lg text-sm leading-relaxed text-slate-200">
            Reach out for recurring plans, custom orders, or quick support. Our team is ready to help every day.
          </p>

          <ul className="mt-6 space-y-4 text-sm">
            <li className="flex items-start gap-3">
              <Phone className="mt-0.5 h-5 w-5 text-cyan-300" />
              <span>+1 (555) 238-9801</span>
            </li>
            <li className="flex items-start gap-3">
              <Mail className="mt-0.5 h-5 w-5 text-cyan-300" />
              <span>support@bwlaundry.com</span>
            </li>
            <li className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-5 w-5 text-cyan-300" />
              <span>24 Riverfront Avenue, Springfield, USA</span>
            </li>
          </ul>
        </div>

        <form className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
          <h4 className="text-lg font-bold">Quick Message</h4>
          <div className="mt-4 grid gap-3">
            <input
              type="text"
              placeholder="Your name"
              className="rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm placeholder:text-slate-300 focus:border-cyan-300 focus:outline-none"
            />
            <input
              type="email"
              placeholder="Email address"
              className="rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm placeholder:text-slate-300 focus:border-cyan-300 focus:outline-none"
            />
            <textarea
              rows={4}
              placeholder="How can we help?"
              className="rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm placeholder:text-slate-300 focus:border-cyan-300 focus:outline-none"
            />
            <button
              type="button"
              className="mt-2 rounded-xl bg-cyan-400 px-4 py-3 text-sm font-semibold text-slate-900 transition-all duration-300 hover:scale-[1.02] hover:bg-cyan-300"
            >
              Send Message
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
