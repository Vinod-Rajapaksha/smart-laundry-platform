export default function Hero() {
  return (
    <section id="home" className="relative overflow-hidden px-4 pb-20 pt-16 sm:px-6 lg:px-8">
      <div className="absolute -left-16 top-10 h-44 w-44 rounded-full bg-cyan-200/45 blur-3xl" />
      <div className="absolute -right-14 bottom-0 h-56 w-56 rounded-full bg-sky-200/45 blur-3xl" />

      <div className="mx-auto grid w-full max-w-6xl items-center gap-12 lg:grid-cols-2">
        <div>
          <p className="mb-3 inline-flex rounded-full border border-sky-200 bg-white px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-sky-600">
            Same-day Pickup Available
          </p>
          <h2 className="text-balance text-4xl font-black leading-tight text-slate-900 sm:text-5xl lg:text-6xl">
            Fresh Clothes, Delivered to Your Door
          </h2>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg">
            Let us handle the laundry while you enjoy your day. From daily wash to premium dry cleaning, we keep every
            fabric spotless, soft, and ready to wear.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href="#contact"
              className="inline-flex items-center rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/15 transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.03] hover:bg-slate-800"
            >
              Book Now
            </a>
            <a
              href="#services"
              className="inline-flex items-center rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition-all duration-300 hover:-translate-y-0.5 hover:border-sky-500 hover:text-sky-700"
            >
              Explore Services
            </a>
          </div>
        </div>

        <div className="relative mx-auto h-[320px] w-full max-w-md rounded-[2rem] border border-sky-100 bg-white p-6 shadow-2xl shadow-sky-900/10 sm:h-[360px]">
          <div className="absolute -right-5 top-8 rounded-2xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-lg">
            30 min pickup slots
          </div>
          <div className="absolute -left-5 bottom-9 rounded-2xl bg-cyan-500 px-4 py-2 text-xs font-semibold text-white shadow-lg">
            4.9 star customer rating
          </div>

          <div className="flex h-full flex-col rounded-3xl bg-gradient-to-br from-cyan-50 via-white to-sky-50 p-6">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">Today&apos;s Queue</h3>
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">On Time</span>
            </div>

            <div className="space-y-4">
              {["Washing", "Dry Cleaning", "Ironing"].map((item) => (
                <div key={item} className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white px-4 py-3 shadow-sm">
                  <p className="text-sm font-semibold text-slate-700">{item}</p>
                  <span className="h-2.5 w-2.5 rounded-full bg-cyan-500" />
                </div>
              ))}
            </div>

            <p className="mt-auto text-xs font-medium text-slate-500">Trusted by 2,500+ households every month</p>
          </div>
        </div>
      </div>
    </section>
  );
}
