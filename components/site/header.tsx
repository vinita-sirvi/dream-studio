import Link from "next/link";

import { announcement } from "@/data/home";
import { mainNav } from "@/data/navigation";

import { Icon } from "./icons";
import { MobileMenu } from "./mobile-menu";
import { HeaderAccount } from "./header-account";
import { getCurrentSession } from "@/lib/session";

export async function SiteHeader() {
  const session = await getCurrentSession();
  return (
    <header className="sticky top-0 z-40 w-full">
      <div className="bg-[#2a1b10] px-4 py-2 text-center text-[11px] font-medium uppercase tracking-[0.24em] text-[#f6eadf] md:text-xs">
        {announcement}
      </div>

      <div className="border-b border-[#eadccc] bg-[#fbf4eb]/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1440px] items-center gap-3 px-4 py-4 md:gap-4 md:px-8 lg:px-10">
          <MobileMenu user={session?.user ?? null} />
          <Link href="/" className="flex min-w-0 shrink-0 items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-full border border-[#ccb399] text-[#8d6236] md:h-14 md:w-14">
              <span className="text-2xl font-semibold leading-none md:text-3xl">DD</span>
            </div>
            <div className="min-w-0 leading-tight">
              <div
                className="hidden text-[17px] font-medium uppercase tracking-[0.24em] text-[#3a2617] md:block"
                style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
              >
                Divya & Design
              </div>
              <div className="hidden text-[10px] uppercase tracking-[0.48em] text-[#8d7261] md:block">
                Custom Made Fashion
              </div>
              <div
                className="text-[12px] font-medium uppercase tracking-[0.2em] text-[#3a2617] md:hidden"
                style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
              >
                Divya & Design
              </div>
            </div>
          </Link>

          <nav className="hidden flex-1 items-center justify-center gap-6 xl:flex">
            {mainNav.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`text-[13px] font-medium uppercase tracking-[0.12em] text-[#2f2319] transition hover:text-[#7f5534] ${
                  item.hasDropdown ? "flex items-center gap-1" : ""
                }`}
              >
                <span>{item.label}</span>
                {item.hasDropdown ? <span className="translate-y-px text-[11px]">v</span> : null}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2 text-[#2f2319] md:gap-3">
            <button
              type="button"
              className="grid h-9 w-9 place-items-center rounded-full border border-transparent transition hover:border-[#d9c6b3] hover:bg-white/70 md:h-10 md:w-10"
              aria-label="Search"
            >
              <Icon name="search" className="h-5 w-5" />
            </button>
            <HeaderAccount user={session?.user ?? null} />
            <button
              type="button"
              className="relative grid h-9 w-9 place-items-center rounded-full border border-transparent transition hover:border-[#d9c6b3] hover:bg-white/70 md:h-10 md:w-10"
              aria-label="Cart"
            >
              <Icon name="bag" className="h-5 w-5" />
              <span className="absolute right-1 top-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-[#2a1b10] px-1 text-[9px] font-semibold text-white">
                0
              </span>
            </button>
          </div>
        </div>

        <div className="mx-auto flex max-w-[1440px] gap-3 overflow-x-auto border-t border-[#f0e3d6] px-4 py-3 xl:hidden">
          {mainNav.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="whitespace-nowrap rounded-full border border-[#eadccc] bg-white/60 px-4 py-2 text-[12px] font-medium uppercase tracking-[0.1em] text-[#2f2319]"
            >
              {item.label}
              {item.hasDropdown ? " v" : ""}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
