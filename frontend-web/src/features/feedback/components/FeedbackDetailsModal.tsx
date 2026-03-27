import { Hash, MessageSquareMore, NotebookText, Tag, X } from "lucide-react";
import type { FeedbackItem } from "../types";

type FeedbackDetailsModalProps = {
  open: boolean;
  feedback: FeedbackItem | null;
  loading?: boolean;
  onClose: () => void;
};

function DetailBlock({
  label,
  value,
  icon,
}: {
  label: string;
  value: React.ReactNode;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
        <span className="text-blue-600">{icon}</span>
        {label}
      </div>
      <div className="text-sm leading-6 text-slate-600">{value}</div>
    </div>
  );
}

export default function FeedbackDetailsModal({
  open,
  feedback,
  loading = false,
  onClose,
}: FeedbackDetailsModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative z-10 w-full max-w-2xl rounded-2xl border border-slate-200 
                      bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Feedback Details</h2>
            <p className="text-sm text-slate-500">
              View complete feedback information
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <X size={18} />
          </button>
        </div>

        <div className="max-h-[75vh] overflow-y-auto p-6">
          {loading ? (
            <div className="py-16 text-center text-sm text-slate-500">
              Loading feedback details...
            </div>
          ) : !feedback ? (
            <div className="py-16 text-center text-sm text-slate-500">
              Feedback details not found.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              <DetailBlock
                label="Feedback ID"
                icon={<Hash size={16} />}
                value={feedback._id}
              />

              <DetailBlock
                label="Feedback Comment"
                icon={<MessageSquareMore size={16} />}
                value={feedback.comment?.trim() || "No comment provided"}
              />

              <DetailBlock
                label="Suggestions"
                icon={<NotebookText size={16} />}
                value={feedback.suggestions?.trim() || "No suggestions provided"}
              />

              <DetailBlock
                label="Feedback Key Tags"
                icon={<Tag size={16} />}
                value={
                  feedback.tags.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {feedback.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  ) : (
                    "No tags available"
                  )
                }
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}