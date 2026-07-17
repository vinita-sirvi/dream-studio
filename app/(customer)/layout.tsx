import { customerLinks } from "@/data/navigation";

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto grid min-h-[72vh] w-full max-w-[1440px] gap-6 px-4 py-10 md:grid-cols-[280px_1fr] md:px-8">
      <aside className="rounded-[2rem] border border-[#eadccc] bg-white/80 p-6 shadow-[0_16px_36px_rgba(103,73,47,0.06)]">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#8a6b56]">
          My Account
        </p>
        <nav className="mt-6 space-y-2">
          {customerLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="block rounded-2xl border border-[#eadccc] px-4 py-3 text-sm text-[#3b2417] transition hover:bg-[#fbf6ef]"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </aside>
      <div>{children}</div>
    </div>
  );
}
