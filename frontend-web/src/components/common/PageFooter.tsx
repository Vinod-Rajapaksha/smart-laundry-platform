import { type JSX } from "react";

type PageFooterProps = {
  className?: string;
  companyName?: string;
  year?: number;
};

export default function PageFooter({
  className = "",
  companyName = "EcoShine Services",
  year = new Date().getFullYear(),
}: PageFooterProps): JSX.Element {
  return (
    <footer
      className={`w-full border-t border-slate-200 bg-white/80 p-4 flex items-center justify-center h-full ${className}`}
    >
      <p className="text-xs text-slate-400 text-center">
        © {year} {companyName}. All rights reserved.
      </p>
    </footer>
  );
}