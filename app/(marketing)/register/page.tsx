import Link from "next/link";

import { RegisterPanel } from "@/components/auth/register-panel";

export default function RegisterPage() {
  return (
    <section className="mx-auto grid min-h-[72vh] w-full max-w-[1440px] gap-8 px-4 py-16 md:px-8 lg:grid-cols-[0.95fr_1.05fr] lg:px-10">
      <div className="rounded-[2rem] border border-[#eadccc] bg-[linear-gradient(135deg,#f3e4d2,#fff8f2)] p-8 shadow-[0_18px_42px_rgba(103,73,47,0.08)]">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#8a6b56]">
          Create Account
        </p>
        <h1
          className="mt-4 text-4xl font-medium text-[#2f2319] md:text-6xl"
          style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
        >
          Create your customer profile
        </h1>
        <p className="mt-5 max-w-xl text-base leading-8 text-[#5f4f43]">
          Save addresses, measurements, wishlists, and order history so repeat
          purchases become effortless.
        </p>
        <div className="mt-8 grid gap-4 text-sm text-[#49382d]">
          <div className="rounded-2xl border border-[#eadccc] bg-white/70 px-5 py-4">
            Faster checkout with saved information
          </div>
          <div className="rounded-2xl border border-[#eadccc] bg-white/70 px-5 py-4">
            Access your measurements and custom orders
          </div>
          <div className="rounded-2xl border border-[#eadccc] bg-white/70 px-5 py-4">
            Sync your wishlist across devices
          </div>
        </div>
      </div>

      <div>
        <RegisterPanel />
        <div className="mt-6 flex items-center gap-3 text-sm text-[#5f4f43]">
          <Link href="/login" className="transition hover:text-[#3b2417]">
            Back to login
          </Link>
        </div>
      </div>
    </section>
  );
}
