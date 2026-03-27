import {
  BadgeCheck,
  CheckCircle2,
  Clock3,
  MessageSquareText,
  Star,
  XCircle,
} from "lucide-react";
import type { FeedbackStats } from "../types";

type FeedbackStatsCardsProps = {
  stats: FeedbackStats | null;
  loading?: boolean;
};

function getStatusCount(stats: FeedbackStats | null, status: string): number {
  if (!stats) return 0;
  return stats.statusBreakdown.find((item) => item._id === status)?.count ?? 0;
}

function StatCard({
  label,
  value,
  icon,
  tooltip,
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  tooltip: string;
}) {
  return (
    <div className="group relative rounded-2xl border border-blue-300 
                      bg-white px-5 py-4 shadow-sm transition-all duration-200 hover:shadow-md">
      <div className="flex items-center justify-between gap-3">
        <div className="flex h-10 w-10 items-center justify-center 
                      rounded-full bg-blue-50 text-blue-600">
          {icon}
        </div>

        <div className="text-right">
          <p className="text-lg font-bold text-slate-900">{value}</p>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            {label}
          </p>
        </div>
      </div>

      <div className="pointer-events-none absolute left-1/2 top-full z-20 mt-2 
                      hidden w-72 -translate-x-1/2 rounded-xl border border-blue-300 
                      bg-blue-500/50 px-4 py-3 text-sm text-slate-900 shadow-lg backdrop-blur-sm group-hover:block">
        {tooltip}
      </div>
    </div>
  );
}

export default function FeedbackStatsCards({
  stats,
  loading = false,
}: FeedbackStatsCardsProps) {
  const totalReviews = stats?.totalReviews ?? 0;
  const averageRating = stats?.averageRating ?? 0;
  const totalApproved = stats?.totalApproved ?? 0;
  const approvedAverageRating = stats?.approvedAverageRating ?? 0;
  const pendingCount = getStatusCount(stats, "pending");
  const rejectedCount = getStatusCount(stats, "rejected");

  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      <StatCard
        label="Total Reviews"
        value={loading ? "..." : totalReviews}
        icon={<MessageSquareText size={18} />}
        tooltip="Shows the total number of feedbacks submitted by customers."
      />
      <StatCard
        label="Average Rating"
        value={loading ? "..." : averageRating}
        icon={<Star size={18} />}
        tooltip="Shows the average rating from all submitted feedbacks, including pending, approved, and rejected."
      />
      <StatCard
        label="Total Approved"
        value={loading ? "..." : totalApproved}
        icon={<BadgeCheck size={18} />}
        tooltip="Shows how many feedbacks have been approved by admin."
      />
      <StatCard
        label="Approved Avg Rating"
        value={loading ? "..." : approvedAverageRating}
        icon={<CheckCircle2 size={18} />}
        tooltip="Shows the average rating based only on approved feedbacks."
      />
      <StatCard
        label="Pending"
        value={loading ? "..." : pendingCount}
        icon={<Clock3 size={18} />}
        tooltip="Shows how many feedbacks are still waiting for admin review."
      />
      <StatCard
        label="Rejected"
        value={loading ? "..." : rejectedCount}
        icon={<XCircle size={18} />}
        tooltip="Shows how many feedbacks were rejected by admin."
      />
    </section>
  );
}