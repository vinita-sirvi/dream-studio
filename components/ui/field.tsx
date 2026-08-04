import type { ComponentPropsWithoutRef, ReactNode } from "react";

import { cn } from "@/lib/cn";

const CONTROL =
  "w-full rounded-xl border border-line bg-surface px-4 py-3.5 text-sm text-ink " +
  "placeholder:text-ink-faint transition-colors duration-200 " +
  "hover:border-line-strong focus:border-brass focus:outline-none " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brass-ink " +
  "disabled:cursor-not-allowed disabled:opacity-60 " +
  "aria-[invalid=true]:border-danger";

const LABEL =
  "eyebrow block text-brass-ink";

/**
 * Field wrapper: renders the label, control and optional hint/error as a single
 * accessible unit. Always pass an `id` matching the control's `id` so the label
 * association is real rather than visual.
 */
export function Field({
  label,
  htmlFor,
  hint,
  error,
  required,
  className,
  children,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  error?: string;
  required?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("grid gap-2", className)}>
      <label className={LABEL} htmlFor={htmlFor}>
        {label}
        {required ? (
          <span className="ml-1 text-danger" aria-hidden="true">
            *
          </span>
        ) : null}
      </label>
      {children}
      {hint && !error ? (
        <p id={`${htmlFor}-hint`} className="text-xs leading-5 text-ink-soft">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p
          id={`${htmlFor}-error`}
          className="text-xs leading-5 text-danger"
          role="alert"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function Input({
  className,
  ...props
}: ComponentPropsWithoutRef<"input">) {
  return <input className={cn(CONTROL, className)} {...props} />;
}

export function Textarea({
  className,
  ...props
}: ComponentPropsWithoutRef<"textarea">) {
  return (
    <textarea className={cn(CONTROL, "min-h-32 resize-y", className)} {...props} />
  );
}

export function Select({
  className,
  children,
  ...props
}: ComponentPropsWithoutRef<"select">) {
  return (
    <div className="relative">
      <select
        className={cn(
          CONTROL,
          "cursor-pointer appearance-none bg-none pr-11",
          className,
        )}
        {...props}
      >
        {children}
      </select>
      {/* Custom chevron; the native one is removed via appearance-none. */}
      <svg
        aria-hidden="true"
        viewBox="0 0 16 16"
        className="pointer-events-none absolute right-4 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-brass"
      >
        <path
          d="M3 6l5 5 5-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

/** Status line for form submissions. Announced politely to screen readers. */
export function FormStatus({
  status,
  message,
}: {
  status: "idle" | "loading" | "success" | "error";
  message?: string;
}) {
  return (
    <p
      aria-live="polite"
      role={status === "error" ? "alert" : undefined}
      className={cn(
        "min-h-5 text-sm leading-5 transition-colors",
        status === "error" && "text-danger",
        status === "success" && "text-success",
        (status === "idle" || status === "loading") && "text-ink-soft",
      )}
    >
      {message}
    </p>
  );
}
