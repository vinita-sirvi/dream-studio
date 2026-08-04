"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Field, FormStatus, Input } from "@/components/ui/field";
import { Icon } from "@/components/site/icons";
import { cn } from "@/lib/cn";

type Mode = "password" | "otp";

/**
 * Sign-in panel. Logic is unchanged from the original:
 *  - POST /api/auth/login for password sign-in, redirecting admins to /admin
 *  - POST /api/auth/otp/request then on to /verify-otp for OTP sign-in
 *  - `?next=` is honoured only for same-origin relative paths (open-redirect guard)
 *
 * Presentation adds real labels, an aria-live status region, and a tab pattern
 * that is announced correctly rather than two anonymous buttons.
 */
export function LoginPanel() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestedNext = searchParams.get("next");
  const nextPath =
    requestedNext?.startsWith("/") && !requestedNext.startsWith("//")
      ? requestedNext
      : "/account";

  const [mode, setMode] = useState<Mode>("password");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");
  const [passwordForm, setPasswordForm] = useState({ email: "", password: "" });
  const [otpEmail, setOtpEmail] = useState("");

  async function submitPassword(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(passwordForm),
    });

    const data = await response.json().catch(() => null);
    if (!response.ok) {
      setStatus("error");
      setMessage(data?.message ?? "Invalid email or password.");
      return;
    }

    const role = data?.data?.role;
    setStatus("success");
    router.push(
      role === "admin" || role === "super_admin" ? "/admin" : nextPath,
    );
    router.refresh();
  }

  async function submitOtp(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    const response = await fetch("/api/auth/otp/request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: otpEmail }),
    });

    const data = await response.json().catch(() => null);
    if (!response.ok) {
      setStatus("error");
      setMessage(data?.message ?? "Could not send a code.");
      return;
    }

    setStatus("success");
    router.push(
      `/verify-otp?email=${encodeURIComponent(otpEmail)}&next=${encodeURIComponent(nextPath)}`,
    );
  }

  return (
    <div>
      {/* Mode switch */}
      <div
        role="tablist"
        aria-label="Sign-in method"
        className="flex rounded-full border border-line bg-canvas-warm p-1"
      >
        {(
          [
            ["password", "Password"],
            ["otp", "Email code"],
          ] as const
        ).map(([value, label]) => (
          <button
            key={value}
            type="button"
            role="tab"
            aria-selected={mode === value}
            onClick={() => {
              setMode(value);
              setStatus("idle");
              setMessage("");
            }}
            className={cn(
              "flex-1 rounded-full px-4 py-2.5 text-[11px] font-medium uppercase tracking-[0.14em] transition-colors duration-300",
              mode === value
                ? "bg-espresso text-on-dark"
                : "text-ink-soft hover:text-ink",
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {mode === "password" ? (
        <form onSubmit={submitPassword} className="mt-7 grid gap-5">
          <Field label="Email address" htmlFor="login-email" required>
            <Input
              id="login-email"
              type="email"
              autoComplete="email"
              required
              value={passwordForm.email}
              onChange={(event) =>
                setPasswordForm((current) => ({
                  ...current,
                  email: event.target.value,
                }))
              }
            />
          </Field>

          <Field label="Password" htmlFor="login-password" required>
            <Input
              id="login-password"
              type="password"
              autoComplete="current-password"
              required
              value={passwordForm.password}
              onChange={(event) =>
                setPasswordForm((current) => ({
                  ...current,
                  password: event.target.value,
                }))
              }
            />
          </Field>

          <Button
            type="submit"
            size="lg"
            disabled={status === "loading"}
            className="mt-1 w-full"
          >
            {status === "loading" ? "Signing in…" : "Sign in"}
            <Icon name="arrow-right" className="h-4 w-4" />
          </Button>

          <FormStatus status={status} message={message} />
        </form>
      ) : (
        <form onSubmit={submitOtp} className="mt-7 grid gap-5">
          <Field
            label="Email address"
            htmlFor="otp-request-email"
            hint="We'll send a six-digit code that expires in ten minutes."
            required
          >
            <Input
              id="otp-request-email"
              type="email"
              autoComplete="email"
              required
              value={otpEmail}
              onChange={(event) => setOtpEmail(event.target.value)}
            />
          </Field>

          <Button
            type="submit"
            size="lg"
            disabled={status === "loading"}
            className="mt-1 w-full"
          >
            {status === "loading" ? "Sending code…" : "Send me a code"}
            <Icon name="arrow-right" className="h-4 w-4" />
          </Button>

          <FormStatus status={status} message={message} />
        </form>
      )}
    </div>
  );
}
