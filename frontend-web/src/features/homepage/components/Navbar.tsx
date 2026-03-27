type NavItem = {
  label: string;
  href: string;
};

type NavbarProps = {
  links: NavItem[];
};

export default function Navbar({ links }: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-sky-100/70 bg-white/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <a href="#home" className="group inline-flex items-center gap-2">
          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-sky-500 to-cyan-400" />
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-600">Laundry Service</p>
            <h1 className="text-lg font-extrabold text-slate-900 transition-colors group-hover:text-sky-700">
              B&W Laundry
            </h1>
          </div>
        </a>

        <nav className="hidden items-center gap-7 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-semibold text-slate-600 transition-colors duration-300 hover:text-sky-600"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
