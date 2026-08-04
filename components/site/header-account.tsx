"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { customerLinks } from "@/data/navigation";
import { cn } from "@/lib/cn";

import { Icon } from "./icons";

/**
 * Signed-in account menu.
 *
 * Preserves the original sign-out behaviour (POST /api/auth/logout followed by
 * router.refresh) and additionally surfaces the account routes, plus an admin
 * shortcut for privileged roles.
 */
export function HeaderAccount({
  user,
  inverted,
}: {
  user: { name: string; role?: string };
  inverted: boolean;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  // Dismiss on outside click and on Escape.
  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: PointerEvent) => {
      if (
        event.target instanceof Node &&
        !wrapRef.current?.contains(event.target)
      ) {
        setOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  async function logout() {
    setLoading(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setOpen(false);
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  const isAdmin = user.role === "admin" || user.role === "super_admin";

  return (
    <div ref={wrapRef} className="relative ml-1 hidden sm:block">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-haspopup="menu"
        className={cn(
          "flex max-w-40 items-center gap-2 rounded-full border px-4 py-2.5 text-[11px] font-medium uppercase tracking-[0.16em] transition-colors",
          inverted
            ? "border-on-dark-soft/40 text-on-dark hover:bg-on-dark/10"
            : "border-line-strong text-ink hover:border-brass hover:bg-brass-wash",
        )}
      >
        <span className="truncate">{user.name}</span>
        <Icon
          name="chevron-down"
          className={cn(
            "h-3 w-3 shrink-0 transition-transform duration-300",
            open && "rotate-180",
          )}
        />
      </button>

      {open ? (
        <div
          role="menu"
          className="absolute right-0 top-full mt-2 w-60 overflow-hidden rounded-2xl border border-line bg-canvas shadow-lift animate-[mega-in_260ms_var(--ease-out-expo)]"
        >
          <ul className="py-2">
            {customerLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  role="menuitem"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-5 py-2.5 text-sm text-ink transition-colors hover:bg-brass-wash"
                >
                  <Icon name={link.icon} className="h-4 w-4 text-brass" />
                  {link.label}
                </Link>
              </li>
            ))}

            {isAdmin ? (
              <li>
                <Link
                  href="/admin"
                  role="menuitem"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-5 py-2.5 text-sm text-ink transition-colors hover:bg-brass-wash"
                >
                  <Icon name="sliders" className="h-4 w-4 text-brass" />
                  Admin Dashboard
                </Link>
              </li>
            ) : null}
          </ul>

          <div className="border-t border-line p-2">
            <button
              type="button"
              role="menuitem"
              onClick={logout}
              disabled={loading}
              className="w-full rounded-xl px-3 py-2.5 text-left text-sm text-ink-soft transition-colors hover:bg-brass-wash hover:text-ink disabled:opacity-60"
            >
              {loading ? "Signing out…" : "Sign out"}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
