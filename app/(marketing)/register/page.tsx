import type { Metadata } from "next";

import { AuthShell } from "@/components/site/auth-shell";
import { RegisterPanel } from "@/components/auth/register-panel";

export const metadata: Metadata = {
  title: "Create Account",
  description:
    "Create an account to save measurements, track orders and speed up repeat commissions.",
};

export default function RegisterPage() {
  return (
    <AuthShell
      eyebrow="Create account"
      title="Your measurements, kept on file"
      points={[
        "Store several measurement profiles — yours and your family's.",
        "Repeat orders start from your existing numbers.",
        "Follow each commission through the workroom.",
      ]}
      altLinks={[
        { label: "Already have an account?", href: "/login" },
        { label: "Read the size guide", href: "/size-guide" },
      ]}
    >
      <RegisterPanel />
    </AuthShell>
  );
}
