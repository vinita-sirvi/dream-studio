import type { ReactNode } from "react";

import { Reveal } from "@/components/motion/reveal";
import { ButtonLink } from "@/components/ui/button";

import { Icon } from "../icons";

type IconName = Parameters<typeof Icon>[0]["name"];

/**
 * Standard header for an account page.
 */
export function AccountHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  action?: { label: string; href: string };
}) {
  return (
    <header className="flex flex-col gap-6 border-b border-line pb-8 md:flex-row md:items-end md:justify-between">
      <div>
        <p className="eyebrow text-brass-ink">{eyebrow}</p>
        <h1 className="mt-3 display-md text-ink">{title}</h1>
        {description ? (
          <p className="mt-3 max-w-xl text-sm leading-7 text-ink-soft">
            {description}
          </p>
        ) : null}
      </div>
      {action ? (
        <ButtonLink href={action.href} variant="secondary" className="shrink-0">
          {action.label}
          <Icon name="arrow-right" className="h-4 w-4" />
        </ButtonLink>
      ) : null}
    </header>
  );
}

/**
 * Empty state for an account section that has no records yet.
 *
 * The account pages have no data-fetching implementation in this codebase — no
 * per-user order, address or measurement queries exist — so each page presents
 * its real empty state rather than fabricated rows.
 */
export function AccountEmpty({
  icon,
  title,
  description,
  primaryCta,
  secondaryCta,
}: {
  icon: IconName;
  title: string;
  description: string;
  primaryCta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
}) {
  return (
    <Reveal direction="up" className="mt-10">
      <div className="rounded-panel border border-line bg-canvas-warm px-8 py-14 text-center">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-full border border-line-strong bg-canvas text-brass">
          <Icon name={icon} className="h-6 w-6" />
        </span>
        <h2 className="mt-6 font-display text-xl text-ink">{title}</h2>
        <p className="mx-auto mt-3 max-w-sm text-sm leading-7 text-ink-soft">
          {description}
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <ButtonLink href={primaryCta.href}>
            {primaryCta.label}
            <Icon name="arrow-right" className="h-4 w-4" />
          </ButtonLink>
          {secondaryCta ? (
            <ButtonLink href={secondaryCta.href} variant="secondary">
              {secondaryCta.label}
            </ButtonLink>
          ) : null}
        </div>
      </div>
    </Reveal>
  );
}

/** Simple bordered card used to group account content. */
export function AccountCard({
  title,
  children,
  footer,
}: {
  title: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <section className="rounded-card border border-line bg-surface p-6 md:p-7">
      <h2 className="font-display text-lg text-ink">{title}</h2>
      <div className="mt-5">{children}</div>
      {footer ? (
        <div className="mt-6 border-t border-line pt-5">{footer}</div>
      ) : null}
    </section>
  );
}
