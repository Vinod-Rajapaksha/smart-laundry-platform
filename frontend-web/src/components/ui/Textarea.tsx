import { type TextareaHTMLAttributes, forwardRef } from "react";

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className = "", ...props }, ref) => {
    return (
      <div className="flex flex-col gap-2 w-full">
        {label && (
          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={`
            w-full py-2.5 px-4 bg-[#f8fafc] border rounded-lg text-sm text-slate-700 
            placeholder:text-slate-400 focus:outline-none focus:ring-2 
            focus:ring-blue-500/20 focus:border-blue-500 transition-all min-h-[100px] resize-y
            ${error ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : "border-slate-200"}
            ${className}
          `}
          {...props}
        />
        {error && <span className="text-xs text-red-500 mt-1">{error}</span>}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
