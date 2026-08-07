"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { adminLinks } from "@/data/navigation";

import { Icon } from "@/components/site/icons";

export function AdminShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const activeLabel = useMemo(
    () => adminLinks.find((link) => pathname === link.href || pathname.startsWith(`${link.href}/`))?.label ?? "Dashboard",
    [pathname],
  );

  return (
    <div className="mx-auto w-full max-w-[1440px] px-4 py-4 md:px-8 md:py-10">
      <div className="mb-4 flex items-center justify-between gap-3 rounded-[1.4rem] border border-[#dce4e3] bg-white/85 px-4 py-3 shadow-[0_12px_30px_rgba(15,30,30,0.06)] lg:hidden">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#b23a17]">
            Admin Panel
          </p>
          <p className="mt-1 text-sm font-medium text-[#0f1e1e]">{activeLabel}</p>
        </div>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="grid h-10 w-10 place-items-center rounded-full border border-[#c3cfce] bg-white text-[#0f1e1e]"
          aria-label="Open admin menu"
        >
          <Icon name="menu" className="h-5 w-5" />
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <aside className="hidden rounded-[2rem] border border-[#dce4e3] bg-[#0b1717] p-6 text-[#f5f9f8] shadow-[0_16px_36px_rgba(15,30,30,0.1)] lg:block lg:sticky lg:top-6 lg:h-[calc(100vh-3rem)]">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#ffb199]">
            Admin Panel
          </p>
          <nav className="mt-6 space-y-2">
            {adminLinks.map((link) => {
              const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`block rounded-2xl border px-4 py-3 text-sm transition ${
                    active
                      ? "border-white/25 bg-white/10"
                      : "border-white/10 hover:bg-white/5"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        <div>{children}</div>
      </div>

      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close admin menu backdrop"
            className="absolute inset-0 bg-black/45"
            onClick={() => setOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 flex w-[88vw] max-w-sm flex-col overflow-y-auto bg-[#0b1717] p-5 text-[#f5f9f8] shadow-[0_20px_60px_rgba(0,0,0,0.28)]">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#ffb199]">
                  Admin Panel
                </p>
                <p className="mt-1 text-sm font-medium">Navigation</p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-white/5"
                aria-label="Close admin menu"
              >
                <Icon name="close" className="h-5 w-5" />
              </button>
            </div>

            <nav className="mt-8 space-y-2">
              {adminLinks.map((link) => {
                const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`block rounded-2xl border px-4 py-3 text-sm transition ${
                      active
                        ? "border-white/25 bg-white/10"
                        : "border-white/10 hover:bg-white/5"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      ) : null}
    </div>
  );
}
