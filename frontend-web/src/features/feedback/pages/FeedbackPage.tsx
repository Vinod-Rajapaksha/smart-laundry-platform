import FeedbackContainer from "../components/FeedbackContainer";

export default function FeedbackPage() {
  return (
    <div className="p-1 md:p-6 font-poppins text-slate-900">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Customer Feedbacks</h1>
        <p className="text-slate-500 text-sm md:text-base">Monitor customer reviews and service satisfaction metrics</p>
      </div>

      <FeedbackContainer />
    </div>
  );
}
