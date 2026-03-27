import { Facebook, Instagram, Twitter } from "lucide-react";

export default function Footer() {
  const socials = [
    { id: "facebook", label: "Facebook", href: "#", icon: Facebook },
    { id: "instagram", label: "Instagram", href: "#", icon: Instagram },
    { id: "twitter", label: "Twitter", href: "#", icon: Twitter },
  ];

  return (
    <footer className="border-t border-slate-200 bg-white/75">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-4 px-4 py-6 sm:flex-row sm:px-6 lg:px-8">
        <p className="text-sm text-slate-500">© {new Date().getFullYear()} B&W Laundry. All rights reserved.</p>

        <div className="flex items-center gap-3">
          {socials.map(({ id, href, label, icon: Icon }) => (
            <a
              key={id}
              href={href}
              aria-label={label}
              className="rounded-full border border-slate-200 p-2 text-slate-600 transition-all duration-300 hover:-translate-y-0.5 hover:border-cyan-400 hover:text-cyan-600"
            >
              <Icon className="h-4 w-4" />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
