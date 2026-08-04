"use client";

import { useId, useRef, useState } from "react";

import { cn } from "@/lib/cn";

export type AccordionItem = {
  question: string;
  answer: string;
};

/**
 * Accessible accordion built on native <button> + aria-expanded / aria-controls.
 *
 * The height animation uses `grid-template-rows: 0fr -> 1fr`, which transitions
 * smoothly without needing to measure content in JS, and collapses correctly
 * when the answer text reflows.
 */
export function Accordion({
  items,
  /** Index open on first render, or null for all-closed. */
  defaultOpen = null,
  className,
}: {
  items: AccordionItem[];
  defaultOpen?: number | null;
  className?: string;
}) {
  const [open, setOpen] = useState<number | null>(defaultOpen);
  const baseId = useId();
  const buttonsRef = useRef<(HTMLButtonElement | null)[]>([]);

  // Arrow keys move between headers, matching the ARIA accordion pattern.
  function onKeyDown(event: React.KeyboardEvent, index: number) {
    const keys = ["ArrowDown", "ArrowUp", "Home", "End"];
    if (!keys.includes(event.key)) return;
    event.preventDefault();

    const last = items.length - 1;
    const next =
      event.key === "ArrowDown"
        ? index === last
          ? 0
          : index + 1
        : event.key === "ArrowUp"
          ? index === 0
            ? last
            : index - 1
          : event.key === "Home"
            ? 0
            : last;

    buttonsRef.current[next]?.focus();
  }

  return (
    <div className={cn("divide-y divide-line border-y border-line", className)}>
      {items.map((item, index) => {
        const isOpen = open === index;
        const panelId = `${baseId}-panel-${index}`;
        const headerId = `${baseId}-header-${index}`;

        return (
          <div key={item.question}>
            <h3>
              <button
                ref={(node) => {
                  buttonsRef.current[index] = node;
                }}
                id={headerId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : index)}
                onKeyDown={(event) => onKeyDown(event, index)}
                className="group flex w-full items-center justify-between gap-6 py-6 text-left transition-colors hover:text-brass-ink"
              >
                <span className="font-display text-lg leading-snug text-ink md:text-xl">
                  {item.question}
                </span>
                {/* Plus that rotates into a minus. */}
                <span
                  aria-hidden="true"
                  className="relative grid h-9 w-9 shrink-0 place-items-center rounded-full border border-line transition-colors duration-300 group-hover:border-brass"
                >
                  <span className="absolute h-px w-3.5 bg-current" />
                  <span
                    className={cn(
                      "absolute h-3.5 w-px bg-current transition-transform duration-400 ease-[var(--ease-out-expo)]",
                      isOpen && "rotate-90",
                    )}
                  />
                </span>
              </button>
            </h3>
            {/* Height animates via grid-template-rows 0fr -> 1fr, which needs no
                JS measurement. `visibility: hidden` (not `display: none`) is what
                keeps the collapsed answer out of the a11y tree and tab order
                while still permitting the transition — the visibility flip is
                delayed on close so the collapse is actually seen. */}
            <div
              id={panelId}
              role="region"
              aria-labelledby={headerId}
              className={cn(
                "grid transition-[grid-template-rows] duration-400 ease-[var(--ease-out-expo)]",
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
              )}
            >
              <div
                className={cn(
                  "overflow-hidden",
                  isOpen
                    ? "visible [transition:visibility_0s]"
                    : "invisible [transition:visibility_0s_linear_400ms]",
                )}
              >
                <p className="max-w-2xl pb-7 text-[15px] leading-7 text-ink-soft">
                  {item.answer}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
