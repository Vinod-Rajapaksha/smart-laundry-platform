import { type ReactNode } from "react";
import { FolderOpen } from "lucide-react";
import { Button } from "../ui/Button";

interface EmptyStateProps {
  icon?: ReactNode;
  title?: string;
  description?: string;
  iconClassName?: string;
  action?: {
    label: string;
    onClick: () => void;
    icon?: ReactNode;
    variant?: "primary" | "secondary";
  };
}

export function EmptyState({
  icon = <FolderOpen size={48} />,
  title = "No data found",
  description = "There are no records to display at the moment.",
  iconClassName = "text-slate-300",
  action,
}: EmptyStateProps) {
  return (
    <section
      role="status"
      className="flex flex-col items-center justify-center p-12 text-center animate-in fade-in zoom-in-95 duration-500"
    >
      {/* Icon */}
      <div
        className={`w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mb-6 border border-slate-100 ring-8 ring-slate-50/50 ${iconClassName}`}
      >
        {icon}
      </div>

      {/* Title */}
      <h3 className="text-xl font-bold text-slate-900 tracking-tight mb-2">
        {title}
      </h3>

      {/* Description */}
      <p className="text-slate-500 max-w-sm mb-8 leading-relaxed">
        {description}
      </p>

      {/* Action */}
      {action && (
        <Button
          type="button"
          onClick={action.onClick}
          className="gap-2"
          variant={action.variant || "primary"}
        >
          {action.icon}
          {action.label}
        </Button>
      )}
    </section>
  );
}