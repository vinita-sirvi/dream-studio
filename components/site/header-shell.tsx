"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";

import { mainNav, type NavItem } from "@/data/navigation";
import { cn } from "@/lib/cn";
import { useScrolledPast } from "@/lib/use-client-env";

import { BrandMark } from "./brand-mark";
import { HeaderAccount } from "./header-account";
import { Icon } from "./icons";
import { MobileNav } from "./mobile-nav";
import { SearchOverlay } from "./search-overlay";
import { ScrollProgress } from "@/components/motion/scroll-progress";

type SessionUser = { name: string; role?: string } | null;

/**
 * Interactive header chrome.
 *
 * Receives the already-resolved session from the server <SiteHeader> so no
 * client-side auth fetch is needed. Two visual states:
 *  - `transparent` — floating over a dark hero (home page, at scroll top)
 *  - `solid`       — frosted glass, condensed, once scrolled or off-hero
 */
export function HeaderShell({
  user,
  announcement,
  /** True on routes whose hero sits beneath the header. */
  overHero,
  /** Units in the bag, resolved on the server. */
  cartCount = 0,
}: {
  user: SessionUser;
  announcement: string;
  overHero: boolean;
  cartCount?: number;
}) {
  const pathname = usePathname();
  // 24px of travel is enough to feel intentional without flickering.
  const scrolled = useScrolledPast(24);
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const closeTimer = useRef<number | undefined>(undefined);

  // Close every transient surface on navigation.
  //
  // Adjusted during render rather than in an effect (the pattern documented in
  // "You Might Not Need an Effect" → adjusting state when a prop changes). An
  // effect would commit and paint one frame with the overlay still open before
  // closing it, which is visible as a flicker on back/forward navigation.
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setMenuOpen(false);
    setSearchOpen(false);
    setOpenDropdown(null);
  }

  const inverted = overHero && !scrolled;

  // Small delay on close so diagonal mouse travel into the panel doesn't
  // dismiss it — a common annoyance with hover menus.
  function scheduleClose() {
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setOpenDropdown(null), 140);
  }
  function cancelClose() {
    window.clearTimeout(closeTimer.current);
  }

  return (
    <>
      <a href="#main" className="sr-only-focusable z-[120] m-3 rounded-full bg-espresso px-5 py-3 text-sm text-on-dark">
        Skip to content
      </a>

      {/* Announcement bar scrolls away with the page rather than sticking. */}
      <div className="bg-espresso px-4 py-2.5 text-center">
        <p className="eyebrow text-on-dark-soft">{announcement}</p>
      </div>

      <header
        className={cn(
          "sticky top-0 z-50 transition-[background-color,box-shadow,border-color] duration-500 ease-[var(--ease-out-quart)]",
          inverted
            ? "border-b border-transparent bg-transparent"
            : "glass border-b border-line shadow-soft",
        )}
        onMouseLeave={scheduleClose}
      >
        <div
          className={cn(
            "shell flex items-center gap-4 transition-[padding] duration-500 ease-[var(--ease-out-expo)]",
            scrolled ? "py-3" : "py-5",
          )}
        >
          {/* Mobile: menu trigger */}
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            aria-expanded={menuOpen}
            className={cn(
              "grid h-10 w-10 shrink-0 place-items-center rounded-full border transition-colors xl:hidden",
              inverted
                ? "border-on-dark-soft/40 text-on-dark hover:bg-on-dark/10"
                : "border-line text-ink hover:border-brass hover:bg-brass-wash",
            )}
          >
            <Icon name="menu" className="h-5 w-5" />
          </button>

          <BrandMark onDark={inverted} compact={scrolled} className="shrink-0" />

          {/* Desktop navigation */}
          <nav
            aria-label="Main"
            className="ml-auto hidden items-center gap-1 xl:flex"
          >
            {mainNav.map((item) => (
              <NavLink
                key={item.label}
                item={item}
                inverted={inverted}
                active={isActive(pathname, item.href)}
                open={openDropdown === item.label}
                onOpen={() => {
                  cancelClose();
                  setOpenDropdown(item.children ? item.label : null);
                }}
                onRequestClose={scheduleClose}
                onCancelClose={cancelClose}
              />
            ))}
          </nav>

          {/* Actions */}
          <div className="ml-auto flex shrink-0 items-center gap-1.5 xl:ml-6">
            <IconAction
              label="Search"
              icon="search"
              inverted={inverted}
              onClick={() => setSearchOpen(true)}
            />

            <Link
              href="/wishlist"
              aria-label="Wishlist"
              className={iconActionClasses(inverted)}
            >
              <Icon name="heart" className="h-[18px] w-[18px]" />
            </Link>

            <Link
              href="/cart"
              aria-label={
                cartCount > 0
                  ? `Cart, ${cartCount} ${cartCount === 1 ? "item" : "items"}`
                  : "Cart"
              }
              className={cn(iconActionClasses(inverted), "relative")}
            >
              <Icon name="bag" className="h-[18px] w-[18px]" />
              {cartCount > 0 ? (
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute -right-0.5 -top-0.5 grid h-[18px] min-w-[18px] place-items-center rounded-full px-1 text-[10px] font-medium tabular-nums",
                    inverted
                      ? "bg-on-dark text-espresso"
                      : "bg-espresso text-on-dark",
                  )}
                >
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              ) : null}
            </Link>

            {/* Account menu (includes sign-out) or a sign-in link */}
            {user ? (
              <HeaderAccount user={user} inverted={inverted} />
            ) : (
              <Link
                href="/login"
                className={cn(
                  "ml-1 hidden rounded-full px-5 py-2.5 text-[11px] font-medium uppercase tracking-[0.16em] transition-colors sm:block",
                  inverted
                    ? "bg-on-dark text-espresso hover:bg-brass-soft"
                    : "bg-espresso text-on-dark hover:bg-brass-ink",
                )}
              >
                Sign In
              </Link>
            )}
          </div>
        </div>

        {/* Mega-menu panel, shared by all dropdown items */}
        {mainNav.map((item) =>
          item.children && openDropdown === item.label ? (
            <MegaMenu
              key={item.label}
              item={item}
              onMouseEnter={cancelClose}
              onMouseLeave={scheduleClose}
              onNavigate={() => setOpenDropdown(null)}
            />
          ) : null,
        )}

        {!inverted ? <ScrollProgress /> : null}
      </header>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
      <MobileNav
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        user={user}
        onSearch={() => {
          setMenuOpen(false);
          setSearchOpen(true);
        }}
      />
    </>
  );
}

/** `/` must match exactly, everything else matches by prefix. */
function isActive(pathname: string, href: string) {
  const path = href.split("?")[0];
  if (path === "/") return pathname === "/";
  return pathname === path || pathname.startsWith(`${path}/`);
}

function iconActionClasses(inverted: boolean) {
  return cn(
    "grid h-10 w-10 place-items-center rounded-full border transition-colors duration-300",
    inverted
      ? "border-transparent text-on-dark hover:border-on-dark-soft/40 hover:bg-on-dark/10"
      : "border-transparent text-ink hover:border-line-strong hover:bg-surface",
  );
}

function IconAction({
  label,
  icon,
  inverted,
  onClick,
}: {
  label: string;
  icon: "search";
  inverted: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={iconActionClasses(inverted)}
    >
      <Icon name={icon} className="h-[18px] w-[18px]" />
    </button>
  );
}

function NavLink({
  item,
  inverted,
  active,
  open,
  onOpen,
  onRequestClose,
  onCancelClose,
}: {
  item: NavItem;
  inverted: boolean;
  active: boolean;
  open: boolean;
  onOpen: () => void;
  onRequestClose: () => void;
  onCancelClose: () => void;
}) {
  const hasChildren = Boolean(item.children);

  return (
    <div
      className="relative"
      onMouseEnter={onOpen}
      onFocusCapture={onCancelClose}
    >
      <Link
        href={item.href}
        aria-expanded={hasChildren ? open : undefined}
        aria-haspopup={hasChildren ? "true" : undefined}
        className={cn(
          "group/nav relative flex items-center gap-1.5 px-3.5 py-2 text-[11.5px] font-medium uppercase tracking-[0.14em] transition-colors duration-300",
          inverted
            ? "text-on-dark/90 hover:text-on-dark"
            : "text-ink-soft hover:text-ink",
          active && (inverted ? "text-on-dark" : "text-ink"),
        )}
        // Keyboard users open the panel on focus; Escape closes it.
        onFocus={hasChildren ? onOpen : undefined}
        onKeyDown={(event) => {
          if (event.key === "Escape") onRequestClose();
        }}
      >
        {item.label}
        {hasChildren ? (
          <Icon
            name="chevron-down"
            className={cn(
              "h-3 w-3 transition-transform duration-300",
              open && "rotate-180",
            )}
          />
        ) : null}

        {/* Underline wipes in from the left; stays put when active. */}
        <span
          aria-hidden="true"
          className={cn(
            "absolute inset-x-3.5 bottom-0.5 h-px origin-left transition-transform duration-400 ease-[var(--ease-out-expo)]",
            inverted ? "bg-on-dark" : "bg-brass",
            active ? "scale-x-100" : "scale-x-0 group-hover/nav:scale-x-100",
          )}
        />
      </Link>
    </div>
  );
}

function MegaMenu({
  item,
  onMouseEnter,
  onMouseLeave,
  onNavigate,
}: {
  item: NavItem;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onNavigate: () => void;
}) {
  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="absolute inset-x-0 top-full hidden border-b border-line bg-canvas shadow-lift xl:block animate-[mega-in_360ms_var(--ease-out-expo)]"
    >
      <div className="shell grid grid-cols-[1fr_auto] gap-12 py-10">
        <ul className="grid grid-cols-3 gap-x-8 gap-y-1">
          {item.children?.map((child) => (
            <li key={child.href}>
              <Link
                href={child.href}
                onClick={onNavigate}
                className="group/mega flex flex-col gap-1 rounded-xl px-4 py-3.5 transition-colors hover:bg-brass-wash"
              >
                <span className="flex items-center gap-2 font-display text-lg text-ink">
                  {child.label}
                  <Icon
                    name="arrow-right"
                    className="h-4 w-4 -translate-x-1 text-brass opacity-0 transition-all duration-300 group-hover/mega:translate-x-0 group-hover/mega:opacity-100"
                  />
                </span>
                {child.description ? (
                  <span className="text-xs text-ink-soft">
                    {child.description}
                  </span>
                ) : null}
              </Link>
            </li>
          ))}
        </ul>

        {/* Editorial promo rail */}
        <Link
          href="/custom-order"
          onClick={onNavigate}
          className="group/promo flex w-72 flex-col justify-between rounded-panel bg-espresso p-7 text-on-dark transition-colors hover:bg-espresso-soft"
        >
          <div>
            <p className="eyebrow text-on-dark-soft">Made to measure</p>
            <p className="mt-4 font-display text-2xl leading-tight">
              Can&rsquo;t find it? We&rsquo;ll make it.
            </p>
          </div>
          <span className="mt-8 flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-brass-soft">
            Start a bespoke order
            <Icon
              name="arrow-right"
              className="h-4 w-4 transition-transform duration-300 group-hover/promo:translate-x-1"
            />
          </span>
        </Link>
      </div>
    </div>
  );
}
