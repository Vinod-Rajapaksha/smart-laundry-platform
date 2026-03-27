import { useEffect, useState } from "react";
import { MessageSquareText, RotateCcw } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import FeedbackDetailsModal from "../components/FeedbackDetailsModal";
import FeedbackStatsCards from "../components/FeedbackStatsCards";
import FeedbackSummaryBox from "../components/FeedbackSummaryBox";
import FeedbackTable from "../components/FeedbackTable";
import {
  clearSelectedFeedback,
  FEEDBACK_STATUS_OPTIONS,
  fetchFeedbackById,
  fetchFeedbackStats,
  fetchFeedbacks,
  patchFeedbackStatus,
  resetFeedbackFilters,
  setFeedbackPage,
  setFeedbackStatusFilter,
  setFeedbackSuggestionsFilter,
} from "../../../store/slices/feedback.slice";
import {
  selectFeedbackFilters,
  selectFeedbackItems,
  selectFeedbackLoadingDetails,
  selectFeedbackLoadingList,
  selectFeedbackLoadingStats,
  selectFeedbackPagination,
  selectFeedbackSelected,
  selectFeedbackStats,
  selectFeedbackUpdatingStatusId,
} from "../../../store/selectors/feedback.selector";



import type { FeedbackStatus } from "../../../types/enums";

export default function FeedbackPage() {
  const dispatch = useAppDispatch();

  const items = useAppSelector(selectFeedbackItems);
  const pagination = useAppSelector(selectFeedbackPagination);
  const stats = useAppSelector(selectFeedbackStats);
  const filters = useAppSelector(selectFeedbackFilters);
  const selectedFeedback = useAppSelector(selectFeedbackSelected);
  const loadingList = useAppSelector(selectFeedbackLoadingList);
  const loadingStats = useAppSelector(selectFeedbackLoadingStats);
  const loadingDetails = useAppSelector(selectFeedbackLoadingDetails);
  const updatingStatusId = useAppSelector(selectFeedbackUpdatingStatusId);

  const [aiEnabled, setAiEnabled] = useState(true);
  const [detailsOpen, setDetailsOpen] = useState(false);

  useEffect(() => {
    void dispatch(fetchFeedbacks(filters));
  }, [dispatch, filters]);

  useEffect(() => {
    void dispatch(fetchFeedbackStats());
  }, [dispatch]);

  const handleViewDetails = async (feedbackId: string) => {
    setDetailsOpen(true);
    await dispatch(fetchFeedbackById(feedbackId));
  };

  const handleCloseModal = () => {
    setDetailsOpen(false);
    dispatch(clearSelectedFeedback());
  };

  const handleStatusChange = async (
    feedbackId: string,
    status: FeedbackStatus
  ) => {
    await dispatch(patchFeedbackStatus({ id: feedbackId, status }));
    await dispatch(fetchFeedbacks(filters));
    await dispatch(fetchFeedbackStats());
  };

  const handlePageChange = (page: number) => {
    if (page < 1 || page > pagination.totalPages) return;
    dispatch(setFeedbackPage(page));
  };

  return (
    <div className="space-y-6 feedback-feature">
      <div className="rounded-2xl border border-slate-200 bg-white px-6 py-5 shadow-sm">
        <div className="flex flex-col gap-2">
          <h2 className="flex items-center gap-2 text-2xl font-bold text-slate-900">
            <MessageSquareText size={24} className="text-blue-500" />
            All Feedbacks
          </h2>
          <p className="text-sm text-slate-500">
            Manage your all feedbacks, ratings and approve options.
          </p>
        </div>
      </div>

      <FeedbackSummaryBox
        enabled={aiEnabled}
        onToggle={() => setAiEnabled((prev) => !prev)}
      />

      <FeedbackStatsCards stats={stats} loading={loadingStats} />

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Manage your all feedbacks here !
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-400">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) =>
                  dispatch(
                    setFeedbackStatusFilter(e.target.value as FeedbackStatus | "")
                  )
                }
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-400"
              >
                {FEEDBACK_STATUS_OPTIONS.map((option) => (
                  <option key={option.label} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-400">
                Suggestions
              </label>
              <div className="flex h-[50px] items-center rounded-xl border border-slate-200 bg-white px-4">
                <input
                  id="hasSuggestions"
                  type="checkbox"
                  checked={filters.hasSuggestions}
                  onChange={(e) =>
                    dispatch(setFeedbackSuggestionsFilter(e.target.checked))
                  }
                  className="h-4 w-4 rounded border-slate-300 text-blue-500"
                />
                <label
                  htmlFor="hasSuggestions"
                  className="ml-3 text-sm text-slate-700"
                >
                  Show only feedbacks with suggestions
                </label>
              </div>
            </div>

            <div className="flex items-end">
              <button
                type="button"
                onClick={() => dispatch(resetFeedbackFilters())}
                className="inline-flex h-[50px] items-center justify-center rounded-xl 
                            bg-blue-500 px-5 text-sm font-semibold text-white transition hover:bg-blue-600"
              >
                <RotateCcw size={16} className="mr-2" />
                Reset
              </button>
            </div>
          </div>
        </div>

        <FeedbackTable
          feedbacks={items}
          pagination={pagination}
          page={filters.page}
          loading={loadingList}
          updatingStatusId={updatingStatusId}
          onView={handleViewDetails}
          onPageChange={handlePageChange}
          onStatusChange={handleStatusChange}
        />
      </section>

      <FeedbackDetailsModal
        open={detailsOpen}
        feedback={selectedFeedback}
        loading={loadingDetails}
        onClose={handleCloseModal}
      />
    </div>
  );
}
