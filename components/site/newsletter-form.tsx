"use client";

import { useId, useState } from "react";

import { cn } from "@/lib/cn";

import { Icon } from "./icons";

type Status = "idle" | "loading" | "success" | "error";

/**
 * Newsletter subscribe form. Posts to the existing /api/newsletter route.
 *
 * Fixes a bug in the previous version, where the status <p> was rendered as a
 * flex child of the input group and so appeared inline between the field and the
 * button. The message now sits below the group, in its own aria-live region.
 */
export function NewsletterForm({
  source = "footer",
  onDark = false,
  className,
}: {
  source?: string;
  onDark?: boolean;
  className?: string;
}) {
  const inputId = useId();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source }),
      });

      if (!response.ok) {
        setStatus("error");
        setMessage("Please enter a valid email address.");
        return;
      }

      setStatus("success");
      setEmail("");
      setMessage("Thank you — you're on the list.");
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
  }

  return (
    <form onSubmit={onSubmit} className={cn("w-full max-w-lg", className)}>
      <label htmlFor={inputId} className="sr-only">
        Email address
      </label>

      <div
        className={cn(
          "flex items-center gap-3 border-b pb-3 transition-colors focus-within:border-brass",
          onDark ? "border-on-dark/25" : "border-line-strong",
        )}
      >
        <input
          id={inputId}
          type="email"
          name="email"
          autoComplete="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="your@email.com"
          aria-describedby={`${inputId}-status`}
          aria-invalid={status === "error" || undefined}
          className={cn(
            "min-w-0 flex-1 bg-transparent py-1 text-base outline-none",
            onDark
              ? "text-on-dark placeholder:text-on-dark-soft/70"
              : "text-ink placeholder:text-ink-faint",
          )}
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className={cn(
            "group/sub flex shrink-0 items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] transition-opacity disabled:opacity-60",
            onDark ? "text-brass-soft" : "text-brass-ink",
          )}
        >
          {status === "loading" ? "Sending" : "Subscribe"}
          <Icon
            name="arrow-right"
            className="h-4 w-4 transition-transform duration-300 group-hover/sub:translate-x-1"
          />
        </button>
      </div>

      <p
        id={`${inputId}-status`}
        aria-live="polite"
        role={status === "error" ? "alert" : undefined}
        className={cn(
          "mt-3 min-h-5 text-xs leading-5",
          status === "error" && "text-danger",
          status === "success" && (onDark ? "text-brass-soft" : "text-success"),
          (status === "idle" || status === "loading") &&
            (onDark ? "text-on-dark-soft" : "text-ink-soft"),
        )}
      >
        {message || (status === "idle" ? "No spam. Unsubscribe anytime." : "")}
      </p>
    </form>
  );
}
