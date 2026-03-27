import { ChevronLeft, ChevronRight, Eye, Loader2 } from "lucide-react";
import { FEEDBACK_STATUS, type FeedbackStatus } from "../../../types/enums";
import type { FeedbackItem, FeedbackPagination } from "../types";

type FeedbackTableProps = {
  feedbacks: FeedbackItem[];
  pagination: FeedbackPagination;
  page: number;
  loading?: boolean;
  updatingStatusId?: string | null;
  onView: (feedbackId: string) => void;
  onPageChange: (page: number) => void;
  onStatusChange: (feedbackId: string, status: FeedbackStatus) => void;
};

function getStatusClass(status: string): string {
  if (status === FEEDBACK_STATUS.APPROVED) {
    return "bg-emerald-50 text-emerald-700 border-emerald-200";
  }

  if (status === FEEDBACK_STATUS.REJECTED) {
    return "bg-rose-50 text-rose-700 border-rose-200";
  }

  return "bg-amber-50 text-amber-700 border-amber-200";
}

function formatDate(date: string): string {
  const parsed = new Date(date);

  return parsed.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function hasSuggestions(feedback: FeedbackItem): boolean {
  return Boolean(feedback.suggestions && feedback.suggestions.trim());
}

export default function FeedbackTable({
  feedbacks,
  pagination,
  page,
  loading = false,
  updatingStatusId = null,
  onView,
  onPageChange,
  onStatusChange,
}: FeedbackTableProps) {
  const canGoPrev = page > 1;
  const canGoNext = page < pagination.totalPages;

  const start =
    pagination.total === 0 ? 0 : (page - 1) * pagination.limit + 1;
  const end = Math.min(page * pagination.limit, pagination.total);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full border-separate border-spacing-0">
          <thead>
            <tr>
              <th className="border-b border-slate-200 px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                Order ID
              </th>
              <th className="border-b border-slate-200 px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                Date
              </th>
              <th className="border-b border-slate-200 px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                Customer
              </th>
              <th className="border-b border-slate-200 px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                Rating
              </th>
              <th className="border-b border-slate-200 px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                Status
              </th>
              <th className="border-b border-slate-200 px-6 py-4 text-center text-xs font-semibold uppercase tracking-wide text-slate-400">
                More
              </th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="px-6 py-16 text-center text-sm text-slate-500">
                  Loading feedbacks...
                </td>
              </tr>
            ) : feedbacks.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-16 text-center text-sm text-slate-500">
                  No feedbacks found.
                </td>
              </tr>
            ) : (
              feedbacks.map((feedback) => (
                <tr
                  key={feedback._id}
                  className={hasSuggestions(feedback) ? "bg-green-100/30" : "bg-white"}
                >
                  <td className="border-b border-slate-100 px-6 py-5 text-sm font-semibold text-blue-600">
                    {feedback.orderId?.orderNo ?? "-"}
                  </td>

                  <td className="border-b border-slate-100 px-6 py-5 text-sm text-slate-700">
                    {formatDate(feedback.createdAt)}
                  </td>

                  <td className="border-b border-slate-100 px-6 py-5 text-sm text-slate-700">
                    {feedback.userId?.name ?? "-"}
                  </td>

                  <td className="border-b border-slate-100 px-6 py-5 text-sm font-semibold text-slate-900">
                    {feedback.rating}
                  </td>

                  <td className="border-b border-slate-100 px-6 py-5">
                    <div className="flex flex-wrap items-center gap-3">
                      <span
                        className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold capitalize ${getStatusClass(
                          feedback.status
                        )}`}
                      >
                        {feedback.status}
                      </span>

                      <select
                        value={feedback.status}
                        onChange={(e) =>
                          onStatusChange(
                            feedback._id,
                            e.target.value as FeedbackStatus
                          )
                        }
                        disabled={updatingStatusId === feedback._id}
                        className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 outline-none transition focus:border-blue-400"
                      >
                        <option value={FEEDBACK_STATUS.PENDING}>pending</option>
                        <option value={FEEDBACK_STATUS.APPROVED}>approved</option>
                        <option value={FEEDBACK_STATUS.REJECTED}>rejected</option>
                      </select>

                      {updatingStatusId === feedback._id && (
                        <Loader2 size={16} className="animate-spin text-blue-500" />
                      )}
                    </div>
                  </td>

                  <td className="border-b border-slate-100 px-6 py-5 text-center">
                    <button
                      type="button"
                      onClick={() => onView(feedback._id)}
                      className="inline-flex items-center justify-center rounded-xl border border-slate-200 
                      bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
                    >
                      <Eye size={16} className="mr-2" />
                      View Details
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col items-center justify-between gap-4 border-t border-slate-200 px-6 py-4 text-sm text-slate-500 md:flex-row">
        <p>
          Showing {start} to {end} of {pagination.total} results
        </p>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onPageChange(page - 1)}
            disabled={!canGoPrev}
            className="inline-flex items-center rounded-md border border-slate-200 px-3 py-1.5 text-slate-600 
                        transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ChevronLeft size={16} className="mr-1" />
            Previous
          </button>

          <span className="inline-flex min-w-8 items-center justify-center rounded-md bg-blue-500 px-3 py-1.5 text-white">
            {page}
          </span>

          <button
            type="button"
            onClick={() => onPageChange(page + 1)}
            disabled={!canGoNext}
            className="inline-flex items-center rounded-md border border-slate-200 px-3 py-1.5 
                        text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next
            <ChevronRight size={16} className="ml-1" />
          </button>
        </div>
      </div>
    </section>
  );
}