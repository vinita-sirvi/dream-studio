"use client";

import Link from "next/link";

/**
 * Root error boundary. `reset()` re-attempts the render that failed.
 *
 * Note: the error message itself is deliberately not surfaced to the visitor —
 * it can contain internal detail. It is still available in the server logs.
 */
export default function Error({ reset }: { reset: () => void }) {
  return (
    <main className="flex min-h-svh items-center bg-canvas">
      <div className="shell-narrow py-20 text-center">
        <p className="eyebrow flex items-center justify-center gap-3 text-brass-ink">
          <span aria-hidden="true" className="h-px w-7 bg-brass" />
          Something went wrong
          <span aria-hidden="true" className="h-px w-7 bg-brass" />
        </p>

        <h1 className="mt-8 display-xl text-ink">
          We could not finish that just now
        </h1>

        <p className="mx-auto mt-6 max-w-md text-[15px] leading-8 text-ink-soft">
          Try again — it may have been a passing hiccup. If it keeps happening,
          the studio can help directly.
        </p>

        <div className="mt-11 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={reset}
            className="inline-flex rounded-full bg-espresso px-8 py-4 text-[12px] font-medium uppercase tracking-[0.16em] text-on-dark transition-colors hover:bg-brass-ink"
          >
            Try again
          </button>
          <Link
            href="/"
            className="inline-flex rounded-full border border-line-strong bg-surface px-8 py-4 text-[12px] font-medium uppercase tracking-[0.16em] text-ink transition-colors hover:border-brass hover:bg-brass-wash"
          >
            Back home
          </Link>
          <Link
            href="/contact"
            className="inline-flex rounded-full border border-transparent px-8 py-4 text-[12px] font-medium uppercase tracking-[0.16em] text-ink-soft transition-colors hover:text-ink"
          >
            Contact us
          </Link>
        </div>
      </div>
    </main>
  );
}
