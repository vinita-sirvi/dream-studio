"use client";

import Link from "next/link";

export default function Error({
  reset,
}: {
  reset: () => void;
}) {
  return (
    <main className="mx-auto flex min-h-[70vh] w-full max-w-[960px] items-center px-4 py-16 md:px-8">
      <div className="w-full rounded-[2rem] border border-[#eadccc] bg-white/80 p-10 text-center shadow-[0_18px_42px_rgba(103,73,47,0.08)]">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#8a6b56]">
          Something went wrong
        </p>
        <h1
          className="mt-4 text-4xl font-medium text-[#2f2319] md:text-6xl"
          style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
        >
          We could not complete that action.
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-base leading-8 text-[#5f4f43]">
          Please try again. If the issue continues, go back to the homepage and
          retry from there.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={reset}
            className="rounded-md bg-[#3b2417] px-6 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-[#533521]"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="rounded-md border border-[#d8c5b0] bg-white px-6 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-[#3b2417] transition hover:bg-[#faf5ee]"
          >
            Home
          </Link>
        </div>
      </div>
    </main>
  );
}
