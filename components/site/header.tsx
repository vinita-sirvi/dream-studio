import { announcement, navItems } from "@/data/home";

import { Icon } from "./icons";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full">
      <div className="bg-[#2a1b10] px-4 py-2 text-center text-[11px] font-medium uppercase tracking-[0.24em] text-[#f6eadf] md:text-xs">
        {announcement}
      </div>

      <div className="border-b border-[#eadccc] bg-[#fbf4eb]/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1440px] items-center gap-4 px-4 py-4 md:px-8 lg:px-10">
          <a href="#home" className="flex items-center gap-3 shrink-0">
            <div className="grid h-14 w-14 place-items-center rounded-full border border-[#ccb399] text-[#8d6236]">
              <span className="text-3xl font-semibold leading-none">DD</span>
            </div>
            <div className="leading-tight">
              <div
                className="text-[17px] font-medium uppercase tracking-[0.24em] text-[#3a2617]"
                style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
              >
                Divya & Design
              </div>
              <div className="text-[10px] uppercase tracking-[0.48em] text-[#8d7261]">
                Custom Made Fashion
              </div>
            </div>
          </a>

          <nav className="hidden flex-1 items-center justify-center gap-6 xl:flex">
            {navItems.map((item, index) => (
              <a
                key={item}
                href="#home"
                className={`text-[13px] font-medium uppercase tracking-[0.12em] text-[#2f2319] transition hover:text-[#7f5534] ${
                  index === 1 ? "flex items-center gap-1" : ""
                }`}
              >
                <span>{item}</span>
                {index === 1 ? (
                  <span className="translate-y-px text-[11px]">▾</span>
                ) : null}
              </a>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-3 text-[#2f2319]">
            <button
              type="button"
              className="grid h-10 w-10 place-items-center rounded-full border border-transparent transition hover:border-[#d9c6b3] hover:bg-white/70"
              aria-label="Search"
            >
              <Icon name="search" className="h-5 w-5" />
            </button>
            <button
              type="button"
              className="grid h-10 w-10 place-items-center rounded-full border border-transparent transition hover:border-[#d9c6b3] hover:bg-white/70"
              aria-label="Account"
            >
              <Icon name="user" className="h-5 w-5" />
            </button>
            <button
              type="button"
              className="relative grid h-10 w-10 place-items-center rounded-full border border-transparent transition hover:border-[#d9c6b3] hover:bg-white/70"
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
          {navItems.map((item, index) => (
            <a
              key={item}
              href="#home"
              className="whitespace-nowrap rounded-full border border-[#eadccc] bg-white/60 px-4 py-2 text-[12px] font-medium uppercase tracking-[0.1em] text-[#2f2319]"
            >
              {item}
              {index === 1 ? " ▾" : ""}
            </a>
          ))}
        </div>
      </div>
    </header>
  );
}
