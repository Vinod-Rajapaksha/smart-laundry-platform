import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";
import { loginSchema, type LoginFormValues } from "../schemas/loginSchema";
import { useLogin } from "../hooks/useLogin";

export default function LoginForm() {
  const { login, submitting, error } = useLogin();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onTouched",
  });

  const onSubmit = async (data: LoginFormValues) => {
    await login({
      email: data.email.trim(),
      password: data.password,
    });
  };

  const loading = submitting || isSubmitting;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full">
      <div className="flex flex-col items-start gap-6">
        {/* Title */}
        <div className="flex w-full flex-col items-start">
          <h2 className="text-xl font-semibold leading-7 text-slate-900">
            Staff Login
          </h2>
          <p className="text-sm leading-5 text-slate-500">
            Please enter your credentials to continue.
          </p>
        </div>

        {/* Global Error */}
        {error && (
          <div className="flex w-full items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
            <AlertCircle className="mt-0.5 h-5 w-5 text-red-500" />
            <div>
              <p className="text-sm font-medium text-red-700">Login failed</p>
              <p className="text-sm text-red-600">{error}</p>
            </div>
          </div>
        )}

        {/* Fields */}
        <div className="flex w-full flex-col items-start gap-5">
          {/* Email */}
          <div className="flex w-full flex-col items-start gap-1.5">
            <label
              htmlFor="email"
              className="text-sm font-medium leading-5 text-slate-700"
            >
              Email Address
            </label>

            <div
              className={`flex h-12 w-full items-center rounded-lg border bg-white px-4 transition ${
                errors.email
                  ? "border-red-300 focus-within:border-red-400"
                  : "border-slate-300 focus-within:border-[#2B9DEE]"
              }`}
            >
              <input
                id="email"
                type="email"
                placeholder="staff@bwlaundry.com"
                autoComplete="email"
                disabled={loading}
                className="w-full border-none bg-transparent text-base text-slate-900 placeholder:text-slate-400 outline-none"
                {...register("email")}
              />
            </div>

            {errors.email && (
              <p className="text-xs text-red-500">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="flex w-full flex-col items-start gap-1.5">
            <label
              htmlFor="password"
              className="text-sm font-medium leading-5 text-slate-700"
            >
              Password
            </label>

            <div className="w-full">
              <div
                className={`relative flex h-12 w-full items-center rounded-lg border bg-white transition ${
                  errors.password
                    ? "border-red-300 focus-within:border-red-400"
                    : "border-slate-300 focus-within:border-[#2B9DEE]"
                }`}
              >
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  disabled={loading}
                  className="h-full w-full rounded-lg border-none bg-transparent pl-4 pr-12 text-base text-slate-900 placeholder:text-slate-400 outline-none"
                  {...register("password")}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  disabled={loading}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>

              {errors.password && (
                <p className="mt-1.5 text-xs text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="flex w-full items-start justify-end">
              <a
                href="#"
                className="text-xs font-medium leading-4 text-[#2B9DEE] transition hover:text-[#1f87d1]"
              >
                Forgot password?
              </a>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="relative flex h-12 w-full items-center justify-center rounded-lg bg-slate-900 text-white shadow-[0px_2px_4px_-2px_#0000001a,0px_4px_6px_-1px_#0000001a] transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
          >
            <span className="absolute inset-0 rounded-lg bg-white/[0.01]" />
            <span className="relative flex items-center justify-center gap-2 text-base font-semibold leading-6">
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Login to Dashboard"
              )}
            </span>
          </button>
        </div>
      </div>
    </form>
  );
}