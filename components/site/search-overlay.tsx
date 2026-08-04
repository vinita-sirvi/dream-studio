"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { Icon } from "./icons";
import { setScrollLocked } from "@/components/motion/smooth-scroll";
import { Eyebrow } from "@/components/ui/section-heading";

const SUGGESTIONS = [
  "Chikankari kurti",
  "Bridal lehenga",
  "Silk blouse",
  "Co-ord set",
  "Occasion dress",
] as const;

/**
 * Full-bleed search overlay.
 *
 * Submits to /shop?q=… — the existing server-side catalogue filter. No new API,
 * no client-side index: the results page is already SEO-friendly and works
 * without JavaScript.
 */
export function SearchOverlay({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState("");

  useEffect(() => {
    if (!open) return;

    setScrollLocked(true);
    // Delay focus by a frame so the entrance animation doesn't fight it.
    const raf = requestAnimationFrame(() =>
      inputRef.current?.focus({ preventScroll: true }),
    );

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("keydown", onKeyDown);
      setScrollLocked(false);
    };
  }, [open, onClose]);

  function submit(query: string) {
    const trimmed = query.trim();
    onClose();
    setValue("");
    router.push(trimmed ? `/shop?q=${encodeURIComponent(trimmed)}` : "/shop");
  }

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Search the catalogue"
      className="fixed inset-0 z-[95] flex flex-col glass animate-[vt-fade-in_320ms_var(--ease-out-expo)]"
    >
      <div className="shell flex items-center justify-between py-6">
        <Eyebrow>Search</Eyebrow>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close search"
          className="grid h-11 w-11 place-items-center rounded-full border border-line text-ink transition-colors hover:border-brass hover:bg-brass-wash"
        >
          <Icon name="close" className="h-4 w-4" />
        </button>
      </div>

      <div className="shell flex flex-1 flex-col justify-center pb-24">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            submit(value);
          }}
          role="search"
          className="border-b border-line-strong pb-4"
        >
          <label htmlFor="site-search" className="sr-only">
            Search for a garment
          </label>
          <div className="flex items-center gap-4">
            <Icon name="search" className="h-6 w-6 shrink-0 text-brass" />
            <input
              ref={inputRef}
              id="site-search"
              name="q"
              type="search"
              autoComplete="off"
              value={value}
              onChange={(event) => setValue(event.target.value)}
              placeholder="Search kurtis, lehengas, fabrics…"
              className="min-w-0 flex-1 bg-transparent font-display text-2xl text-ink outline-none placeholder:text-ink-faint md:text-4xl"
            />
            <button
              type="submit"
              className="eyebrow shrink-0 text-brass-ink transition-opacity hover:opacity-70"
            >
              Search
            </button>
          </div>
        </form>

        <div className="mt-8">
          <p className="eyebrow text-ink-faint">Popular searches</p>
          <ul className="mt-4 flex flex-wrap gap-2.5">
            {SUGGESTIONS.map((term) => (
              <li key={term}>
                <button
                  type="button"
                  onClick={() => submit(term)}
                  className="rounded-full border border-line bg-surface/70 px-4 py-2.5 text-sm text-ink transition-colors hover:border-brass hover:bg-brass-wash"
                >
                  {term}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
