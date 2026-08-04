"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

import { cn } from "@/lib/cn";
import { Drawer } from "@/components/ui/overlay";
import { Icon } from "../icons";

type Option = { slug: string; name: string };

const SORTS = [
  { value: "newest", label: "Newest first" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "name-asc", label: "Alphabetical" },
] as const;

/**
 * Shop filter and sort controls.
 *
 * The server remains the source of truth: every control writes to the URL and
 * the page re-renders from `searchParams`. That keeps filtered views shareable,
 * indexable, and functional without JavaScript (the <noscript> form below).
 *
 * `useTransition` gives instant feedback — `isPending` drives the skeleton
 * overlay in the parent while the server round-trip completes.
 */
export function FilterBar({
  categories,
  collections,
  priceRange,
  resultCount,
  onPendingChange,
}: {
  categories: Option[];
  collections: Option[];
  priceRange: { min: number; max: number };
  resultCount: number;
  onPendingChange?: (pending: boolean) => void;
}) {
  const router = useRouter();
  const params = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    onPendingChange?.(isPending);
  }, [isPending, onPendingChange]);

  const activeCategory = params.get("category") ?? "";
  const activeCollection = params.get("collection") ?? "";
  const activeSort = params.get("sort") ?? "newest";
  const activeQuery = params.get("q") ?? "";
  const activeMax = params.get("maxPrice") ?? "";

  const activeFilterCount = [
    activeCategory,
    activeCollection,
    activeQuery,
    activeMax,
  ].filter(Boolean).length;

  /** Writes one param and resets to the first page of results. */
  function update(key: string, value: string) {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);

    startTransition(() => {
      // `scroll: false` — changing a filter should not yank you to the top.
      router.replace(next.toString() ? `/shop?${next}` : "/shop", {
        scroll: false,
      });
    });
  }

  function clearAll() {
    startTransition(() => router.replace("/shop", { scroll: false }));
  }

  const controls = (
    <div className="grid gap-7">
      <FilterGroup label="Category">
        <Pill
          active={!activeCategory}
          onClick={() => update("category", "")}
          label="All"
        />
        {categories.map((category) => (
          <Pill
            key={category.slug}
            active={activeCategory === category.slug}
            onClick={() => update("category", category.slug)}
            label={category.name}
          />
        ))}
      </FilterGroup>

      {collections.length ? (
        <FilterGroup label="Collection">
          <Pill
            active={!activeCollection}
            onClick={() => update("collection", "")}
            label="All"
          />
          {collections.map((collection) => (
            <Pill
              key={collection.slug}
              active={activeCollection === collection.slug}
              onClick={() => update("collection", collection.slug)}
              label={collection.name}
            />
          ))}
        </FilterGroup>
      ) : null}

      {priceRange.max > priceRange.min ? (
        <FilterGroup label="Maximum price">
          <div className="w-full">
            <input
              type="range"
              min={priceRange.min}
              max={priceRange.max}
              step={100}
              value={activeMax || priceRange.max}
              onChange={(event) => {
                const value = Number(event.target.value);
                update(
                  "maxPrice",
                  value >= priceRange.max ? "" : String(value),
                );
              }}
              aria-label="Maximum price"
              className="w-full accent-[var(--color-brass-ink)]"
            />
            <div className="mt-2 flex justify-between text-xs text-ink-soft">
              <span>₹{priceRange.min.toLocaleString("en-IN")}</span>
              <span className="text-ink">
                Up to ₹
                {Number(activeMax || priceRange.max).toLocaleString("en-IN")}
              </span>
            </div>
          </div>
        </FilterGroup>
      ) : null}
    </div>
  );

  return (
    <div>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-y border-line py-4">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="flex items-center gap-2 rounded-full border border-line-strong px-4 py-2.5 text-[11px] font-medium uppercase tracking-[0.16em] text-ink transition-colors hover:border-brass lg:hidden"
          >
            <Icon name="sliders" className="h-4 w-4 text-brass" />
            Filters
            {activeFilterCount ? (
              <span className="grid h-5 w-5 place-items-center rounded-full bg-espresso text-[10px] text-on-dark">
                {activeFilterCount}
              </span>
            ) : null}
          </button>

          <p
            aria-live="polite"
            className="text-xs text-ink-soft"
          >
            {isPending
              ? "Updating…"
              : `${resultCount} ${resultCount === 1 ? "piece" : "pieces"}`}
          </p>

          {activeFilterCount ? (
            <button
              type="button"
              onClick={clearAll}
              className="text-xs text-brass-ink underline decoration-line-strong underline-offset-4 transition-colors hover:decoration-brass"
            >
              Clear all
            </button>
          ) : null}
        </div>

        {/* Sort */}
        <div className="flex items-center gap-3">
          <label
            htmlFor="shop-sort"
            className="hidden text-[11px] uppercase tracking-[0.16em] text-ink-faint sm:block"
          >
            Sort
          </label>
          <select
            id="shop-sort"
            value={activeSort}
            onChange={(event) => update("sort", event.target.value)}
            className="cursor-pointer appearance-none rounded-full border border-line-strong bg-surface py-2.5 pl-4 pr-9 text-[11px] font-medium uppercase tracking-[0.14em] text-ink transition-colors hover:border-brass focus:border-brass focus:outline-none"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='none' stroke='%237A5730' stroke-width='1.5'><path d='M3 6l5 5 5-5'/></svg>\")",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 0.75rem center",
              backgroundSize: "0.85rem",
            }}
          >
            {SORTS.map((sort) => (
              <option key={sort.value} value={sort.value}>
                {sort.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Desktop filters */}
      <div className="hidden py-7 lg:block">{controls}</div>

      {/* Mobile filters */}
      <Drawer
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        title="Filters"
        description={`${resultCount} pieces match`}
        side="left"
      >
        {controls}
      </Drawer>
    </div>
  );
}

function FilterGroup({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset>
      <legend className="eyebrow mb-3 text-ink-faint">{label}</legend>
      <div className="flex flex-wrap items-center gap-2">{children}</div>
    </fieldset>
  );
}

function Pill({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "rounded-full border px-4 py-2 text-xs transition-colors duration-300",
        active
          ? "border-espresso bg-espresso text-on-dark"
          : "border-line bg-surface text-ink-soft hover:border-brass hover:text-ink",
      )}
    >
      {label}
    </button>
  );
}
