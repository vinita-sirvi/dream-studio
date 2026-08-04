"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { brandContact, mainNav, socialLinks } from "@/data/navigation";
import { setScrollLocked } from "@/components/motion/smooth-scroll";
import { cn } from "@/lib/cn";

import { Icon } from "./icons";
import { Eyebrow } from "@/components/ui/section-heading";

const FOCUSABLE = 'a[href], button:not([disabled])';

/**
 * Fullscreen mobile navigation.
 *
 * Sections with children expand in place rather than pushing to a second screen,
 * which keeps the whole hierarchy reachable in one scroll and avoids a
 * back-navigation model that competes with the browser's own.
 */
export function MobileNav({
  open,
  onClose,
  user,
  onSearch,
}: {
  open: boolean;
  onClose: () => void;
  user: { name: string } | null;
  onSearch: () => void;
}) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const restoreRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;

    restoreRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    setScrollLocked(true);
    const raf = requestAnimationFrame(() =>
      panelRef.current
        ?.querySelector<HTMLElement>(FOCUSABLE)
        ?.focus({ preventScroll: true }),
    );

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (event.key !== "Tab") return;

      const nodes = panelRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE);
      if (!nodes?.length) return;
      const list = Array.from(nodes).filter((n) => n.offsetParent !== null);
      if (!list.length) return;

      const first = list[0];
      const last = list[list.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("keydown", onKeyDown);
      setScrollLocked(false);
      restoreRef.current?.focus({ preventScroll: true });
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-label="Site menu"
      className="fixed inset-0 z-[95] flex flex-col bg-canvas xl:hidden animate-[vt-fade-in_300ms_var(--ease-out-expo)]"
    >
      <div className="flex items-center justify-between border-b border-line px-5 py-4">
        <Eyebrow>Menu</Eyebrow>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onSearch}
            aria-label="Search"
            className="grid h-11 w-11 place-items-center rounded-full border border-line text-ink"
          >
            <Icon name="search" className="h-[18px] w-[18px]" />
          </button>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="grid h-11 w-11 place-items-center rounded-full border border-line text-ink"
          >
            <Icon name="close" className="h-4 w-4" />
          </button>
        </div>
      </div>

      <nav aria-label="Mobile" className="flex-1 overflow-y-auto px-5 py-6">
        <ul className="divide-y divide-line">
          {mainNav.map((item, index) => {
            const isExpanded = expanded === item.label;

            return (
              <li
                key={item.label}
                // Staggered entrance without needing GSAP on a transient surface.
                className="animate-[nav-item-in_500ms_var(--ease-out-expo)_both]"
                style={{ animationDelay: `${index * 45}ms` }}
              >
                <div className="flex items-center">
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className="flex-1 py-4 font-display text-2xl text-ink"
                  >
                    {item.label}
                  </Link>
                  {item.children ? (
                    <button
                      type="button"
                      onClick={() => setExpanded(isExpanded ? null : item.label)}
                      aria-expanded={isExpanded}
                      aria-label={`${isExpanded ? "Collapse" : "Expand"} ${item.label}`}
                      className="grid h-10 w-10 place-items-center rounded-full border border-line text-brass-ink"
                    >
                      <Icon
                        name="chevron-down"
                        className={cn(
                          "h-4 w-4 transition-transform duration-300",
                          isExpanded && "rotate-180",
                        )}
                      />
                    </button>
                  ) : null}
                </div>

                {item.children ? (
                  <div
                    className={cn(
                      "grid transition-[grid-template-rows] duration-400 ease-[var(--ease-out-expo)]",
                      isExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                    )}
                  >
                    <ul
                      className={cn(
                        "overflow-hidden",
                        isExpanded
                          ? "visible [transition:visibility_0s]"
                          : "invisible [transition:visibility_0s_linear_400ms]",
                      )}
                    >
                      {item.children.map((child) => (
                        <li key={child.href}>
                          <Link
                            href={child.href}
                            onClick={onClose}
                            className="flex items-center justify-between py-3 pl-4 text-sm text-ink-soft"
                          >
                            {child.label}
                            <Icon
                              name="arrow-right"
                              className="h-4 w-4 text-brass"
                            />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </li>
            );
          })}
        </ul>

        <div className="mt-8 grid gap-3">
          {user ? (
            <Link
              href="/account"
              onClick={onClose}
              className="rounded-full bg-espresso px-6 py-4 text-center text-[12px] font-medium uppercase tracking-[0.16em] text-on-dark"
            >
              {user.name}
            </Link>
          ) : (
            <Link
              href="/login"
              onClick={onClose}
              className="rounded-full bg-espresso px-6 py-4 text-center text-[12px] font-medium uppercase tracking-[0.16em] text-on-dark"
            >
              Sign In
            </Link>
          )}
          <Link
            href="/custom-order"
            onClick={onClose}
            className="rounded-full border border-line-strong px-6 py-4 text-center text-[12px] font-medium uppercase tracking-[0.16em] text-ink"
          >
            Bespoke Order
          </Link>
        </div>

        <div className="mt-10 border-t border-line pt-6">
          <p className="eyebrow text-ink-faint">Get in touch</p>
          <a
            href={`tel:${brandContact.phone.replace(/\s/g, "")}`}
            className="mt-3 block font-display text-xl text-ink"
          >
            {brandContact.phone}
          </a>
          <a
            href={`mailto:${brandContact.email}`}
            className="mt-1 block text-sm text-ink-soft"
          >
            {brandContact.email}
          </a>

          <ul className="mt-5 flex gap-2">
            {socialLinks.map((social) => (
              <li key={social.label}>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={social.label}
                  className="grid h-11 w-11 place-items-center rounded-full border border-line text-brass-ink"
                >
                  <Icon name={social.icon} className="h-[18px] w-[18px]" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </div>
  );
}
