import Link from "next/link";

/**
 * 404.
 *
 * This is the root not-found, so it renders outside the (marketing) layout and
 * therefore without the site header. It carries its own minimal navigation back
 * into the site.
 */
export default function NotFound() {
  return (
    <main className="flex min-h-svh items-center bg-canvas">
      <div className="shell-narrow py-20 text-center">
        <p className="eyebrow flex items-center justify-center gap-3 text-brass-ink">
          <span aria-hidden="true" className="h-px w-7 bg-brass" />
          Error 404
          <span aria-hidden="true" className="h-px w-7 bg-brass" />
        </p>

        <h1 className="mt-8 display-xl text-ink">
          This page has come apart at the seams
        </h1>

        <p className="mx-auto mt-6 max-w-md text-[15px] leading-8 text-ink-soft">
          The page you asked for does not exist, or has moved. Nothing is lost —
          try one of these instead.
        </p>

        <nav aria-label="Suggested pages" className="mt-11">
          <ul className="flex flex-wrap justify-center gap-3">
            {[
              { label: "Home", href: "/" },
              { label: "Shop", href: "/shop" },
              { label: "Bespoke", href: "/custom-order" },
              { label: "Contact", href: "/contact" },
            ].map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="inline-flex rounded-full border border-line-strong bg-surface px-6 py-3 text-[11px] font-medium uppercase tracking-[0.16em] text-ink transition-colors hover:border-brass hover:bg-brass-wash"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </main>
  );
}
