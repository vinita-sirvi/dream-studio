"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Field, FormStatus, Input } from "@/components/ui/field";
import { Icon } from "@/components/site/icons";

/**
 * Account creation. POST /api/auth/register then straight to /account —
 * unchanged from the original implementation.
 */
export function RegisterPanel() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await response.json().catch(() => null);
    if (!response.ok) {
      setStatus("error");
      setMessage(data?.message ?? "Could not create the account.");
      return;
    }

    setStatus("success");
    router.push("/account");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-5">
      <Field label="Your name" htmlFor="register-name" required>
        <Input
          id="register-name"
          type="text"
          autoComplete="name"
          required
          value={form.name}
          onChange={(event) =>
            setForm((current) => ({ ...current, name: event.target.value }))
          }
        />
      </Field>

      <Field label="Email address" htmlFor="register-email" required>
        <Input
          id="register-email"
          type="email"
          autoComplete="email"
          required
          value={form.email}
          onChange={(event) =>
            setForm((current) => ({ ...current, email: event.target.value }))
          }
        />
      </Field>

      <Field
        label="Password"
        htmlFor="register-password"
        hint="At least eight characters."
        required
      >
        <Input
          id="register-password"
          type="password"
          autoComplete="new-password"
          minLength={8}
          required
          value={form.password}
          onChange={(event) =>
            setForm((current) => ({ ...current, password: event.target.value }))
          }
        />
      </Field>

      <Button
        type="submit"
        size="lg"
        disabled={status === "loading"}
        className="mt-1 w-full"
      >
        {status === "loading" ? "Creating account…" : "Create account"}
        <Icon name="arrow-right" className="h-4 w-4" />
      </Button>

      <FormStatus status={status} message={message} />

      <p className="text-xs leading-6 text-ink-soft">
        By creating an account you agree to our{" "}
        <a href="/terms" className="text-brass-ink underline underline-offset-2">
          terms
        </a>{" "}
        and{" "}
        <a
          href="/privacy-policy"
          className="text-brass-ink underline underline-offset-2"
        >
          privacy policy
        </a>
        .
      </p>
    </form>
  );
}
