import Link from "next/link";
import { Suspense } from "react";

import { LoginPanel } from "@/components/auth/login-panel";

export default function LoginPage() {
  return (
    <section className="mx-auto grid min-h-[72vh] w-full max-w-[1440px] gap-8 px-4 py-16 md:px-8 lg:grid-cols-[0.95fr_1.05fr] lg:px-10">
      <div className="rounded-[2rem] border border-[#eadccc] bg-[linear-gradient(135deg,#2a1b10,#7a4f2f)] p-8 text-[#f7ecdf] shadow-[0_18px_42px_rgba(103,73,47,0.14)]">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#e7ceb6]">
          Sign In
        </p>
        <h1
          className="mt-4 text-4xl font-medium md:text-6xl"
          style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
        >
          Welcome back to Divya & Design
        </h1>
        <p className="mt-5 max-w-xl text-base leading-8 text-[#f3e5d6]">
          Log in to manage your account, track orders, save measurements, and
          access custom tailoring and admin tools where permitted.
        </p>
        <div className="mt-8 grid gap-4 text-sm">
          <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4">
            Password login for secure account access
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4">
            OTP login for quick verification
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4">
            Admin users are redirected to the dashboard automatically
          </div>
        </div>
        <div className="mt-8 text-sm text-[#f0ddca]">
          Demo admin: <span className="font-semibold">admin@divyaanddesign.com</span>
        </div>
        <div className="mt-2 text-sm text-[#f0ddca]">
          Demo password: <span className="font-semibold">Admin@12345!</span>
        </div>
      </div>

      <div>
        <Suspense
          fallback={
            <div className="rounded-[2rem] border border-[#eadccc] bg-white/85 p-6 shadow-[0_18px_42px_rgba(103,73,47,0.08)] md:p-8">
              Loading login form...
            </div>
          }
        >
          <LoginPanel />
        </Suspense>
        <div className="mt-6 flex flex-wrap gap-3 text-sm text-[#5f4f43]">
          <Link href="/register" className="transition hover:text-[#3b2417]">
            Create account
          </Link>
          <span>·</span>
          <Link href="/verify-otp" className="transition hover:text-[#3b2417]">
            Verify OTP
          </Link>
        </div>
      </div>
    </section>
  );
}
