import { type ReactNode } from "react";
import { ChevronRight, Home } from "lucide-react";
import { Link } from "react-router-dom";

interface Breadcrumb {
  label: string;
  path?: string;
  icon?: ReactNode;
}

interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: Breadcrumb[];
  actions?: ReactNode;
  homePath?: string;
  as?: "h1" | "h2" | "h3";
}

export function PageHeader({
  title,
  description,
  breadcrumbs,
  actions,
  homePath = "/admin",
  as: HeadingTag = "h1",
}: PageHeaderProps) {
  return (
    <div className="mb-8 space-y-4">
      
      {/* Breadcrumbs */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav
          aria-label="Breadcrumb"
          className="text-xs font-medium text-slate-400"
        >
          <ol className="flex items-center gap-2">
            <li>
              <Link
                to={homePath}
                className="hover:text-blue-600 transition-colors flex items-center gap-1"
              >
                <Home size={14} />
              </Link>
            </li>

            {breadcrumbs.map((crumb) => (
              <li key={crumb.path || crumb.label} className="flex items-center gap-2">
                <ChevronRight size={12} />

                {crumb.path ? (
                  <Link
                    to={crumb.path}
                    className="hover:text-blue-600 transition-colors flex items-center gap-1"
                  >
                    {crumb.icon}
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-slate-600 font-semibold flex items-center gap-1">
                    {crumb.icon}
                    {crumb.label}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </nav>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <HeadingTag className="text-2xl font-bold text-slate-900 tracking-tight leading-none">
            {title}
          </HeadingTag>

          {description && (
            <p className="text-sm text-slate-500 max-w-2xl leading-relaxed">
              {description}
            </p>
          )}
        </div>

        {actions && (
          <div className="flex items-center gap-3">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}