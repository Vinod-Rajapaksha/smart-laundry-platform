import type { LucideIcon } from "lucide-react";

type Service = {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
};

type ServicesProps = {
  services: Service[];
};

export default function Services({ services }: ServicesProps) {
  return (
    <section id="services" className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-600">Our Services</p>
          <h3 className="mt-3 text-3xl font-extrabold text-slate-900 sm:text-4xl">Everything your wardrobe needs</h3>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {services.map(({ id, title, description, icon: Icon }) => (
          <article
            key={id}
            className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="inline-flex rounded-2xl bg-cyan-50 p-3 text-cyan-700 transition-transform duration-300 group-hover:scale-110">
              <Icon className="h-6 w-6" />
            </div>
            <h4 className="mt-5 text-xl font-bold text-slate-900">{title}</h4>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
