import { Star } from "lucide-react";

type Review = {
  id: string;
  name: string;
  rating: number;
  comment: string;
};

type ReviewsProps = {
  reviews: Review[];
};

function Stars({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, idx) => {
        const active = idx < value;
        return <Star key={idx} className={`h-4 w-4 ${active ? "fill-amber-400 text-amber-400" : "text-slate-300"}`} />;
      })}
    </div>
  );
}

export default function Reviews({ reviews }: ReviewsProps) {
  return (
    <section id="reviews" className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-600">Customer Reviews</p>
      <h3 className="mt-3 text-3xl font-extrabold text-slate-900 sm:text-4xl">What our customers say</h3>

      <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {reviews.map((review) => (
          <article
            key={review.id}
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-md shadow-slate-900/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="flex items-center justify-between gap-4">
              <h4 className="text-lg font-bold text-slate-900">{review.name}</h4>
              <Stars value={review.rating} />
            </div>
            <p className="mt-4 text-sm leading-relaxed text-slate-600">&quot;{review.comment}&quot;</p>
          </article>
        ))}
      </div>
    </section>
  );
}
