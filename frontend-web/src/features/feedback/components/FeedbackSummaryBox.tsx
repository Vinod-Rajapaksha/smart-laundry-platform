import { Brain, Power } from "lucide-react";

type FeedbackSummaryBoxProps = {
  enabled: boolean;
  onToggle: () => void;
};

export default function FeedbackSummaryBox({
  enabled,
  onToggle,
}: FeedbackSummaryBoxProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mx-auto max-w-3xl text-center">
        <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-blue-600">
          <Brain size={26} />
        </div>

        <h2 className="text-2xl font-bold text-slate-900">AI FEEDBACKS</h2>
        <p className="mt-1 text-sm text-slate-500">
          all feedbacks , ratings and approve options .
        </p>

        <p className="mx-auto mt-5 max-w-2xl rounded-2xl bg-blue-50 px-5 py-4 text-sm leading-7 text-slate-700">
          Overall feedback is positive for both the laundry factory and the
          mobile app. Users appreciate the quality of cleaning, timely service,
          and the easy use of the platform. Some minor delays and tracking
          issues were noted during peak times, but overall satisfaction remains
          high.
        </p>

        <div className="mt-5 flex flex-col items-center gap-3">
          <div className="rounded-full bg-slate-100 px-5 py-2 text-sm font-medium text-slate-500">
            AI model is showing our feedback summaries
          </div>

          <button
            type="button"
            onClick={onToggle}
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
              enabled
                ? "bg-blue-500 text-white hover:bg-blue-600"
                : "bg-slate-200 text-slate-700 hover:bg-slate-300"
            }`}
          >
            <Power size={16} />
            {enabled ? "turn off" : "turn on"}
          </button>
        </div>
      </div>
    </section>
  );
}