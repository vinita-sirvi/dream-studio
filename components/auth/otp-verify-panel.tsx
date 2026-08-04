"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Field, FormStatus, Input } from "@/components/ui/field";
import { Icon } from "@/components/site/icons";

/**
 * One-time-code verification. POST /api/auth/otp/verify, then on to `?next=`
 * (relative paths only) — unchanged from the original implementation.
 *
 * The code input gains `inputMode="numeric"`, `autoComplete="one-time-code"` and
 * digit-only filtering, so mobile keyboards and SMS/email autofill behave.
 */
export function OtpVerifyPanel() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultEmail = searchParams.get("email") ?? "";
  const requestedNext = searchParams.get("next");
  const nextPath =
    requestedNext?.startsWith("/") && !requestedNext.startsWith("//")
      ? requestedNext
      : "/account";

  const [email, setEmail] = useState(defaultEmail);
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    const response = await fetch("/api/auth/otp/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code }),
    });

    const data = await response.json().catch(() => null);
    if (!response.ok) {
      setStatus("error");
      setMessage(data?.message ?? "That code is not valid.");
      return;
    }

    setStatus("success");
    router.push(nextPath);
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-5">
      <Field label="Email address" htmlFor="verify-email" required>
        <Input
          id="verify-email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </Field>

      <Field
        label="Six-digit code"
        htmlFor="verify-code"
        hint="Check your inbox. Codes expire ten minutes after they are sent."
        required
      >
        <Input
          id="verify-code"
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          pattern="[0-9]{6}"
          maxLength={6}
          required
          placeholder="000000"
          value={code}
          // Strip anything non-numeric so a pasted "123 456" still validates.
          onChange={(event) =>
            setCode(event.target.value.replace(/\D/g, "").slice(0, 6))
          }
          className="text-center font-display text-2xl tracking-[0.5em]"
        />
      </Field>

      <Button
        type="submit"
        size="lg"
        disabled={status === "loading" || code.length !== 6}
        className="mt-1 w-full"
      >
        {status === "loading" ? "Verifying…" : "Verify and sign in"}
        <Icon name="arrow-right" className="h-4 w-4" />
      </Button>

      <FormStatus status={status} message={message} />
    </form>
  );
}
