import { type InputHTMLAttributes, type ReactNode, forwardRef } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: ReactNode;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, icon, error, className = "", ...props }, ref) => {
    return (
      <div className="flex flex-col gap-2 w-full">
        {label && (
          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              {icon}
            </span>
          )}
          <input
            ref={ref}
            className={`
              w-full py-2.5 bg-[#f8fafc] border rounded-lg text-sm text-slate-700 
              placeholder:text-slate-400 focus:outline-none focus:ring-2 
              focus:ring-blue-500/20 focus:border-blue-500 transition-all
              ${icon ? "pl-9 pr-4" : "px-4"}
              ${error ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : "border-slate-200"}
              ${className}
            `}
            {...props}
          />
        </div>
        {error && <span className="text-xs text-red-500 mt-1">{error}</span>}
      </div>
    );
  }
);

Input.displayName = "Input";