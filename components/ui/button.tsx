import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost" | "onDark" | "underline";
type Size = "sm" | "md" | "lg";

const BASE =
  "relative inline-flex items-center justify-center gap-2 whitespace-nowrap " +
  "font-medium uppercase tracking-[0.16em] transition-[background-color,color,border-color,box-shadow] " +
  "duration-300 ease-[var(--ease-out-quart)] disabled:pointer-events-none disabled:opacity-55";

const VARIANTS: Record<Variant, string> = {
  primary:
    "rounded-full bg-espresso text-on-dark shadow-soft hover:bg-brass-ink hover:shadow-lift",
  secondary:
    "rounded-full border border-line-strong bg-surface text-ink hover:border-brass hover:bg-brass-wash",
  ghost:
    "rounded-full border border-transparent text-ink hover:border-line-strong hover:bg-surface",
  onDark:
    "rounded-full bg-on-dark text-espresso hover:bg-brass-soft",
  // Editorial text link with an underline that wipes in from the left.
  underline:
    "group/underline gap-3 !tracking-[0.2em] text-ink hover:text-brass-ink",
};

const SIZES: Record<Size, string> = {
  sm: "px-5 py-2.5 text-[11px]",
  md: "px-7 py-3.5 text-[12px]",
  lg: "px-9 py-4.5 text-[13px]",
};

const UNDERLINE_SIZES: Record<Size, string> = {
  sm: "text-[11px]",
  md: "text-[12px]",
  lg: "text-[13px]",
};

type SharedProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
};

function classesFor({ variant = "primary", size = "md", className }: SharedProps) {
  return cn(
    BASE,
    VARIANTS[variant],
    variant === "underline" ? UNDERLINE_SIZES[size] : SIZES[size],
    className,
  );
}

/** The animated rule used by the `underline` variant. */
function UnderlineRule() {
  return (
    <span
      aria-hidden="true"
      className="relative h-px w-8 overflow-hidden bg-line-strong"
    >
      <span className="absolute inset-0 -translate-x-full bg-brass-ink transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover/underline:translate-x-0" />
    </span>
  );
}

type ButtonProps = SharedProps & ComponentPropsWithoutRef<"button">;

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={classesFor({ variant, size, className, children })}
      {...props}
    >
      {children}
      {variant === "underline" ? <UnderlineRule /> : null}
    </button>
  );
}

type ButtonLinkProps = SharedProps &
  Omit<ComponentPropsWithoutRef<typeof Link>, "className" | "children">;

/** Same visual language as <Button>, but renders a real anchor via next/link. */
export function ButtonLink({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonLinkProps) {
  return (
    <Link
      className={classesFor({ variant, size, className, children })}
      {...props}
    >
      {children}
      {variant === "underline" ? <UnderlineRule /> : null}
    </Link>
  );
}
