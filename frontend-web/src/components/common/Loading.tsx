import { type ReactNode } from "react";

/* Loading Spinner */
export function LoadingSpinner({
  size = "md",
  className = "",
}: {
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const sizes = {
    sm: "w-4 h-4 border-2",
    md: "w-8 h-8 border-[3px]",
    lg: "w-12 h-12 border-4",
  };

  return (
    <div
      role="status"
      aria-label="Loading"
      className={`
        animate-spin rounded-full border-slate-200 border-t-blue-600 
        ${sizes[size]} 
        ${className}
      `}
    />
  );
}

/* Full Loading Screen */
export function LoadingScreen({
  label = "Loading contents...",
}: {
  label?: string;
}) {
  return (
    <div
      aria-live="polite"
      className="flex flex-col items-center justify-center min-h-[400px] w-full gap-4 animate-in fade-in duration-700"
    >
      <div className="relative">
        <LoadingSpinner size="lg" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-ping" />
        </div>
      </div>

      <p className="text-slate-500 font-medium tracking-wide animate-pulse">
        {label}
      </p>
    </div>
  );
}

/* Skeleton Loader */
export function Skeleton({
  className = "",
}: {
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={`animate-pulse bg-slate-200 rounded-md ${className}`}
    />
  );
}

/* Loading Overlay */
export function LoadingOverlay({
  children,
  isLoading,
}: {
  children: ReactNode;
  isLoading: boolean;
}) {
  return (
    <div className="relative">
      {children}

      {isLoading && (
        <div
          className="absolute inset-0 z-10 bg-white/60 backdrop-blur-[1px] flex items-center justify-center rounded-xl animate-in fade-in duration-300"
          aria-busy="true"
        >
          <LoadingSpinner />
        </div>
      )}
    </div>
  );
}