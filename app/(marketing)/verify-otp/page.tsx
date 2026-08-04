import type { Metadata } from "next";
import { Suspense } from "react";

import { AuthShell } from "@/components/site/auth-shell";
import { OtpVerifyPanel } from "@/components/auth/otp-verify-panel";

export const metadata: Metadata = {
  title: "Verify Code",
  description: "Enter the six-digit code we emailed you to finish signing in.",
};

export default function VerifyOtpPage() {
  return (
    <AuthShell
      eyebrow="Verify"
      title="Enter the code we emailed you"
      points={[
        "Codes are six digits and expire after ten minutes.",
        "Works for both customer and admin accounts.",
        "Nothing to remember — no password required.",
      ]}
      altLinks={[
        { label: "Back to sign in", href: "/login" },
        { label: "Create an account", href: "/register" },
      ]}
    >
      {/* OtpVerifyPanel reads `?email=` and `?next=` via useSearchParams. */}
      <Suspense
        fallback={<div className="h-80 rounded-panel border border-line bg-surface" />}
      >
        <OtpVerifyPanel />
      </Suspense>
    </AuthShell>
  );
}
