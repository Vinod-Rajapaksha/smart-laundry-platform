import LoginForm from "../features/auth/components/LoginForm";
import { Lock, WashingMachine } from "lucide-react";
import logo from "../assets/logo/logo.png";

export default function LoginPage() {
  return (
    <div className="relative flex min-h-screen w-full items-center justify-center bg-[#F6F7F8] px-4 py-10">
      <div className="w-full max-w-[440px]">
        
        <div className="mb-8 flex flex-col items-center">
          <div className="pb-4">
            <div className="relative rounded-xl bg-slate-900 p-3 shadow-[0px_4px_6px_-4px_#0000001a,0px_10px_15px_-3px_#0000001a]">
              <div className="absolute inset-0 rounded-xl bg-white/[0.01]" />
              <div className="relative flex items-center justify-center">
                <WashingMachine className="h-6 w-5 text-white" />
              </div>
            </div>
          </div>

          <h1 className="text-center text-2xl font-bold tracking-[-0.6px] text-slate-900">
            B &amp; W Laundry
          </h1>

          <p className="pt-1 text-center text-sm text-slate-500">
            Internal Administration Portal
          </p>
        </div>

        {/* Login Card */}
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0px_8px_10px_-6px_#0000001a,0px_20px_25px_-5px_#0000001a]">
            <div className="relative flex h-28 items-center justify-center overflow-hidden bg-slate-100">
              <img
                src={logo}
                alt="B & W Laundry Logo"
                className="h-28 w-28 object-contain"
              />
            </div>

          <div className="px-8 pb-12 pt-8">
            <LoginForm />
          </div>

          <div className="border-t border-slate-100 bg-slate-50 px-8 py-4">
            <div className="flex items-center justify-center gap-2">
              <Lock className="h-3.5 w-3.5 text-slate-500" />
              <p className="text-center text-[11px] font-medium uppercase tracking-[0.55px] text-slate-500">
                Access restricted to authorized staff only
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm leading-5 text-slate-500">
            Having trouble logging in?
            <br />
            Contact the{" "}
            <span className="font-semibold text-slate-900">IT Support Team</span>
          </p>
        </div>
      </div>
    </div>
  );
}