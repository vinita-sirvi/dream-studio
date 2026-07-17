"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { mainNav } from "@/data/navigation";

import { Icon } from "./icons";

export function MobileMenu() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="grid h-10 w-10 place-items-center rounded-full border border-[#d9c6b3] bg-white/80 text-[#2f2319] transition hover:bg-white lg:hidden"
        aria-label="Open menu"
      >
        <Icon name="menu" className="h-5 w-5" />
      </button>

      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close menu backdrop"
            className="absolute inset-0 bg-black/45"
            onClick={() => setOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 flex w-[88vw] max-w-sm flex-col overflow-y-auto bg-[#fbf4eb] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#8a6b56]">
                  Divya & Design
                </p>
                <p className="mt-1 text-xs text-[#6f5d50]">Custom Made Fashion</p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="grid h-10 w-10 place-items-center rounded-full border border-[#eadccc] bg-white text-[#2f2319]"
                aria-label="Close menu"
              >
                <Icon name="close" className="h-5 w-5" />
              </button>
            </div>

            <nav className="mt-8 grid gap-2">
              {mainNav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-2xl border border-[#eadccc] bg-white px-4 py-3 text-sm font-medium uppercase tracking-[0.12em] text-[#2f2319]"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="mt-8 grid gap-3">
              <Link
                href="/login"
                className="rounded-md bg-[#3b2417] px-5 py-3 text-center text-sm font-semibold uppercase tracking-[0.14em] text-white"
              >
                Sign In
              </Link>
              <Link
                href="/custom-order"
                className="rounded-md border border-[#d8c5b0] bg-white px-5 py-3 text-center text-sm font-semibold uppercase tracking-[0.14em] text-[#3b2417]"
              >
                Custom Order
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
