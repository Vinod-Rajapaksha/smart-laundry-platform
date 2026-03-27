import { ShieldCheck, BadgeDollarSign, Sparkles } from "lucide-react";

const highlights = [
  {
    title: "Reliable",
    description: "Scheduled pickups and on-time delivery so your routine never slows down.",
    icon: ShieldCheck,
  },
  {
    title: "Affordable",
    description: "Transparent pricing with value bundles for families, students, and businesses.",
    icon: BadgeDollarSign,
  },
  {
    title: "High Quality",
    description: "Fabric-safe detergents, expert handling, and detail-focused finishing.",
    icon: Sparkles,
  },
];

export default function About() {
  return (
    <section id="about" className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="rounded-3xl border border-slate-200/80 bg-white p-8 shadow-lg shadow-slate-900/5 sm:p-10">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-600">About Us</p>
        <h3 className="mt-3 text-3xl font-extrabold text-slate-900 sm:text-4xl">Laundry care built for modern living</h3>
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-slate-600 sm:text-lg">
          B&W Laundry combines professional garment care with doorstep convenience. Our team handles every order with
          consistency and precision so you always receive clean, fresh, and neatly finished clothes.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {highlights.map(({ title, description, icon: Icon }) => (
            <article
              key={title}
              className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5 transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-lg"
            >
              <Icon className="h-8 w-8 text-cyan-600" />
              <h4 className="mt-4 text-lg font-bold text-slate-900">{title}</h4>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
