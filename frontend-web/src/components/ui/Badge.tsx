import { type ReactNode } from "react";

export type BadgeVariant = "default" | "primary" | "secondary" | "success" | "warning" | "danger" | "info" | "outline";

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

export function Badge({ 
  children, 
  variant = "default", 
  className = "" 
}: BadgeProps) {
  const variants = {
    default: "bg-slate-100 text-slate-600 border-slate-200",
    primary: "bg-blue-50 text-blue-600 border-blue-100",
    secondary: "bg-purple-50 text-purple-600 border-purple-100",
    success: "bg-emerald-50 text-emerald-600 border-emerald-100",
    warning: "bg-amber-50 text-amber-600 border-amber-100",
    danger: "bg-rose-50 text-rose-600 border-rose-100",
    info: "bg-sky-50 text-sky-600 border-sky-100",
    outline: "bg-transparent border-slate-200 text-slate-600",
  };

  return (
    <span
      className={`
        inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border
        ${variants[variant]}
        ${className}
      `}
    >
      {children}
    </span>
  );
}
