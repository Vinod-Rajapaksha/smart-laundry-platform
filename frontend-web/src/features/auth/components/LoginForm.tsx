import React, { useMemo, useState } from "react";
import { useLogin } from "../hooks/useLogin";
import {
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  Shield,
} from "lucide-react";
import toast from "react-hot-toast";

type LoginPayload = { email: string; password: string };

export default function LoginForm() {
  const { login, submitting, error } = useLogin();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [shakeKey, setShakeKey] = useState(0);

  const locked = attempts >= 5;

  const security = useMemo(() => {
    if (attempts === 0) return { label: "Normal", ring: "ring-emerald-500/20", text: "text-emerald-300" };
    if (attempts <= 2) return { label: "Elevated", ring: "ring-amber-500/20", text: "text-amber-300" };
    if (attempts <= 4) return { label: "High", ring: "ring-orange-500/20", text: "text-orange-300" };
    return { label: "Locked", ring: "ring-rose-500/20", text: "text-rose-300" };
  }, [attempts]);

  const strength = useMemo(() => {
    if (!password) return { label: "", pct: 0, bar: "" };
    if (password.length >= 12) return { label: "Strong", pct: 100, bar: "from-emerald-500 to-teal-400" };
    if (password.length >= 8) return { label: "Moderate", pct: 70, bar: "from-amber-500 to-orange-400" };
    return { label: "Weak", pct: 35, bar: "from-rose-500 to-pink-500" };
  }, [password]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (locked) {
      toast.error("Too many attempts. Access locked.");
      return;
    }

    const payload: LoginPayload = { email: email.trim(), password };
    const ok = await login(payload);

    if (ok) {
      toast.success("Welcome back");
      setAttempts(0);
      return;
    }

    toast.error("Login failed");
    setAttempts((p) => p + 1);
    setShakeKey((p) => p + 1);
  };

  return (
    <form
      key={shakeKey}
      onSubmit={onSubmit}
      className={`space-y-5 ${error ? "animate-[shake_0.35s_ease-in-out]" : ""}`}
    >
      {/* Header */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-teal-300" />
            <div>
              <p className="text-sm font-semibold text-white">Admin Authentication</p>
              <p className="text-xs text-white/60">Use your B & W Laundry admin credentials</p>
            </div>
          </div>

          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${security.text} bg-black/30 ring-1 ${security.ring}`}
            title="Security level increases with failed attempts"
          >
            {security.label}
          </span>
        </div>
      </div>

      {/* Email */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-white/80 flex items-center gap-2">
          <Mail className="h-4 w-4 text-teal-300" />
          Admin Email
        </label>

        <div className="relative">
          <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-white/10" />
          <input
            className="w-full rounded-xl bg-black/30 px-4 py-3 pl-11 text-white placeholder:text-white/40 outline-none
                       ring-1 ring-transparent focus:ring-teal-400/40 focus:bg-black/40 transition"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@bw.com"
            required
            autoComplete="username"
            disabled={submitting || locked}
          />
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
        </div>
      </div>

      {/* Password */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-white/80 flex items-center gap-2">
          <Lock className="h-4 w-4 text-teal-300" />
          Password
        </label>

        <div className="relative">
          <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-white/10" />
          <input
            className="w-full rounded-xl bg-black/30 px-4 py-3 pl-11 pr-11 text-white placeholder:text-white/40 outline-none
                       ring-1 ring-transparent focus:ring-teal-400/40 focus:bg-black/40 transition"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your admin password"
            required
            minLength={8}
            autoComplete="current-password"
            disabled={submitting || locked}
          />
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />

          <button
            type="button"
            onClick={() => setShowPassword((s) => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition"
            aria-label={showPassword ? "Hide password" : "Show password"}
            disabled={submitting || locked}
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>

        {/* Password strength */}
        {password.length > 0 && (
          <div className="pt-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-white/50">Password strength</span>
              <span className="font-semibold text-white/70">{strength.label}</span>
            </div>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
              <div
                className={`h-full rounded-full bg-gradient-to-r ${strength.bar} transition-all duration-500`}
                style={{ width: `${strength.pct}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 p-4">
          <div className="flex gap-3">
            <AlertCircle className="h-5 w-5 text-rose-300 mt-0.5" />
            <div>
              <p className="font-semibold text-rose-200">
                {locked ? "Access Locked" : "Authentication Failed"}
              </p>
              <p className="text-sm text-rose-200/80 mt-1">{error}</p>
              {attempts > 0 && !locked && (
                <p className="text-xs text-rose-200/60 mt-2">
                  Attempts: {attempts}/5 — please double-check your credentials.
                </p>
              )}
              {locked && (
                <p className="text-xs text-rose-200/60 mt-2">
                  Too many failed attempts. Contact your system administrator.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={submitting || locked}
        className="group relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-teal-400 via-sky-500 to-indigo-500 p-[1px]
                   disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <div className="relative rounded-2xl bg-black/40 px-6 py-4 backdrop-blur-md transition group-hover:bg-black/35">
          <div className="flex items-center justify-center gap-3">
            {submitting ? (
              <>
                <Loader2 className="h-5 w-5 text-white animate-spin" />
                <span className="font-semibold text-white">Signing in...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="h-5 w-5 text-white/90" />
                <span className="font-semibold text-white">
                  {locked ? "Access Locked" : "Access Admin Portal"}
                </span>
              </>
            )}
          </div>

          <div className="pointer-events-none absolute inset-0 translate-x-[-120%] bg-gradient-to-r from-white/0 via-white/10 to-white/0
                          transition-transform duration-1000 group-hover:translate-x-[120%]" />
        </div>
      </button>

      {/* Footer */}
      <div className="grid grid-cols-2 gap-3 pt-1">
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3 text-center">
          <p className="text-xs font-semibold text-white/70">Audit Logs</p>
          <p className="text-[11px] text-white/45">Enabled</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3 text-center">
          <p className="text-xs font-semibold text-white/70">RBAC</p>
          <p className="text-[11px] text-white/45">Active</p>
        </div>
      </div>
    </form>
  );
}