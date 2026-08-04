import type { Metadata } from "next";
import { Suspense } from "react";

import { AuthShell } from "@/components/site/auth-shell";
import { LoginPanel } from "@/components/auth/login-panel";

export const metadata: Metadata = {
  title: "Sign In",
  description:
    "Sign in to track orders, reuse saved measurements and manage your commissions.",
};

export default function LoginPage() {
  return (
    <AuthShell
      eyebrow="Welcome back"
      title="Sign in to your atelier account"
      points={[
        "Track every order and commission in one place.",
        "Reuse saved measurements — no re-measuring for repeat orders.",
        "Keep addresses and delivery preferences on file.",
      ]}
      footnote={
        <>
          <strong className="font-medium text-on-dark">Demo account</strong>
          <br />
          admin@divyaanddesign.com · Admin@12345!
        </>
      }
      altLinks={[
        { label: "Create an account", href: "/register" },
        { label: "Enter a code instead", href: "/verify-otp" },
        { label: "Need help?", href: "/contact" },
      ]}
    >
      {/* LoginPanel reads `?next=` via useSearchParams. */}
      <Suspense
        fallback={<div className="h-80 rounded-panel border border-line bg-surface" />}
      >
        <LoginPanel />
      </Suspense>
    </AuthShell>
  );
}
