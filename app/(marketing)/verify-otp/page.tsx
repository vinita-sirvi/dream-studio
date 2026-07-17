import Link from "next/link";
import { Suspense } from "react";

import { OtpVerifyPanel } from "@/components/auth/otp-verify-panel";

export default function VerifyOtpPage() {
  return (
    <section className="mx-auto grid min-h-[72vh] w-full max-w-[1200px] gap-8 px-4 py-16 md:px-8 lg:grid-cols-[0.9fr_1.1fr]">
      <div className="rounded-[2rem] border border-[#eadccc] bg-white/80 p-8 shadow-[0_18px_42px_rgba(103,73,47,0.08)]">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#8a6b56]">
          Verify OTP
        </p>
        <h1
          className="mt-4 text-4xl font-medium text-[#2f2319] md:text-6xl"
          style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
        >
          Confirm your login code
        </h1>
        <p className="mt-5 max-w-xl text-base leading-8 text-[#5f4f43]">
          Check your email for the 6-digit code and enter it here to complete
          login. The code expires in 10 minutes.
        </p>
        <div className="mt-8 grid gap-4 text-sm text-[#49382d]">
          <div className="rounded-2xl border border-[#eadccc] bg-[#fbf6ef] px-5 py-4">
            Use this after requesting OTP login
          </div>
          <div className="rounded-2xl border border-[#eadccc] bg-[#fbf6ef] px-5 py-4">
            Works with customer and admin accounts
          </div>
        </div>
        <div className="mt-6 text-sm">
          <Link href="/login" className="text-[#3b2417] transition hover:underline">
            Back to login
          </Link>
        </div>
      </div>

      <Suspense
        fallback={
          <div className="rounded-[2rem] border border-[#eadccc] bg-white/85 p-6 shadow-[0_18px_42px_rgba(103,73,47,0.08)] md:p-8">
            Loading OTP form...
          </div>
        }
      >
        <OtpVerifyPanel />
      </Suspense>
    </section>
  );
}
