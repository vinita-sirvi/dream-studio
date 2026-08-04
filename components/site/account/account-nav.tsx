"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { customerLinks } from "@/data/navigation";
import { cn } from "@/lib/cn";

import { Icon } from "../icons";

/**
 * Account sidebar. Client-side only so the active route can be highlighted and
 * sign-out handled; the session itself is resolved on the server by the layout.
 */
export function AccountNav({
  userName,
  userEmail,
}: {
  userName: string;
  userEmail: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);

  async function logout() {
    setSigningOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/");
      router.refresh();
    } finally {
      setSigningOut(false);
    }
  }

  return (
    <aside className="lg:sticky lg:top-32 lg:self-start">
      {/* Identity */}
      <div className="flex items-center gap-4 rounded-card border border-line bg-canvas-warm p-5">
        <span
          aria-hidden="true"
          className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-brass/40 font-display text-lg text-brass-ink"
        >
          {userName.trim().charAt(0).toUpperCase() || "·"}
        </span>
        <span className="min-w-0">
          <span className="block truncate font-display text-lg text-ink">
            {userName}
          </span>
          <span className="block truncate text-xs text-ink-soft">
            {userEmail}
          </span>
        </span>
      </div>

      {/* Nav — horizontal scroller on mobile, list on desktop */}
      <nav aria-label="Account" className="mt-5">
        <ul className="flex gap-2 overflow-x-auto pb-1 lg:grid lg:gap-1 lg:overflow-visible lg:pb-0">
          {customerLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <li key={link.href} className="shrink-0 lg:shrink">
                <Link
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex items-center gap-3 whitespace-nowrap rounded-xl px-4 py-3 text-sm transition-colors duration-300",
                    active
                      ? "bg-espresso text-on-dark"
                      : "text-ink-soft hover:bg-brass-wash hover:text-ink",
                  )}
                >
                  <Icon
                    name={link.icon}
                    className={cn(
                      "h-4 w-4 shrink-0",
                      active ? "text-brass-soft" : "text-brass",
                    )}
                  />
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="mt-5 border-t border-line pt-5">
        <button
          type="button"
          onClick={logout}
          disabled={signingOut}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm text-ink-soft transition-colors hover:bg-brass-wash hover:text-ink disabled:opacity-60"
        >
          <Icon name="arrow-up-right" className="h-4 w-4 text-brass" />
          {signingOut ? "Signing out…" : "Sign out"}
        </button>
      </div>
    </aside>
  );
}
