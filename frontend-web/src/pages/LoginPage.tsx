import { useState } from "react";
import LoginForm from "../features/auth/components/LoginForm";
import { Droplets, ShieldCheck, Sparkles } from "lucide-react";

export default function LoginPage() {
  const [hover, setHover] = useState(false);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#070A12]">
      {/* Background gradients */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-52 -right-52 h-[520px] w-[520px] rounded-full bg-teal-400/10 blur-3xl" />
        <div className="absolute -bottom-56 -left-56 h-[560px] w-[560px] rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-500/10 blur-3xl" />
      </div>

      {/* Subtle grid */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.08]">
        <div
          className="h-full w-full"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(255,255,255,0.35) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.35) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      {/* Floating bubbles */}
      <div className="pointer-events-none absolute inset-0">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-gradient-to-br from-white/15 to-white/0 blur-[1px]"
            style={{
              width: `${10 + i * 6}px`,
              height: `${10 + i * 6}px`,
              top: `${(i * 9 + 10) % 90}%`,
              left: `${(i * 13 + 12) % 90}%`,
              animation: `float ${4 + (i % 5)}s ease-in-out infinite`,
              opacity: 0.25,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Brand Header */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex w-fit items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-teal-400 to-sky-500 blur-xl opacity-70" />
                <div className="relative rounded-2xl border border-white/10 bg-white/[0.04] p-3 backdrop-blur">
                  <Droplets className="h-8 w-8 text-teal-300" />
                </div>
              </div>

              <div className="text-left">
                <h1 className="text-4xl font-black tracking-tight text-white">
                  B<span className="text-teal-300">&</span>W Laundry
                </h1>
                <p className="text-sm text-white/55">Admin Management Portal</p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 text-xs text-white/45">
              <Sparkles className="h-4 w-4 text-sky-300" />
              <span>Modern secure access • Internal use only</span>
            </div>
          </div>

          {/* Card */}
          <div
            className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] shadow-2xl backdrop-blur-xl"
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
          >
            {/* Top glow bar */}
            <div
              className={`h-[3px] bg-gradient-to-r from-teal-400 via-sky-500 to-indigo-500 transition-all duration-700 ${
                hover ? "opacity-100" : "opacity-70"
              }`}
            />

            {/* Inner shine */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/10 via-white/0 to-white/0 opacity-30" />

            <div className="p-7 sm:p-8">
              <div className="mb-6 flex items-center gap-3">
                <div className="rounded-2xl border border-teal-400/20 bg-teal-400/10 p-3">
                  <ShieldCheck className="h-6 w-6 text-teal-300" />
                </div>
                <div>
                  <h2 className="text-2xl font-extrabold text-white">Admin Sign In</h2>
                  <p className="text-sm text-white/55">Restricted access</p>
                </div>
              </div>

              <LoginForm />

              <div className="mt-6 border-t border-white/10 pt-4 text-center">
                <p className="text-xs text-white/45">
                  All admin actions are logged & monitored for security.
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center text-sm">
            <p className="text-white/45">
              Need help?{" "}
              <a
                href="mailto:blackwhitesl2025@gmail.com"
                className="font-semibold text-teal-300 hover:text-teal-200 transition"
              >
                blackwhitesl2025@gmail.com
              </a>
            </p>
            <p className="mt-2 text-xs text-white/35">© 2026 B & W Laundry • Admin Portal</p>
          </div>
        </div>
      </div>
    </div>
  );
}