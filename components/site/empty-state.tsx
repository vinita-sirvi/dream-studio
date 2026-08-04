import type { ReactNode } from "react";

import { Reveal } from "@/components/motion/reveal";
import { ButtonLink } from "@/components/ui/button";

import { Icon } from "./icons";

type IconName = Parameters<typeof Icon>[0]["name"];

/**
 * Designed empty state, used by /cart, /checkout and /wishlist.
 *
 * These routes have no backing implementation in this codebase (no cart API, no
 * persisted wishlist), so rather than fake a working feature they present an
 * intentional, on-brand empty state that routes people somewhere useful.
 */
export function EmptyState({
  icon,
  title,
  description,
  primaryCta,
  secondaryCta,
  note,
  children,
}: {
  icon: IconName;
  title: string;
  description: string;
  primaryCta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  note?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <section className="shell py-20 md:py-28">
      <Reveal direction="up">
        <div className="mx-auto max-w-2xl rounded-panel border border-line bg-canvas-warm px-8 py-16 text-center md:px-14 md:py-20">
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-full border border-line-strong bg-canvas text-brass">
            <Icon name={icon} className="h-7 w-7" />
          </span>

          <h2 className="mt-8 display-md text-ink">{title}</h2>
          <p className="mx-auto mt-4 max-w-md text-[15px] leading-8 text-ink-soft">
            {description}
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <ButtonLink href={primaryCta.href} size="lg">
              {primaryCta.label}
              <Icon name="arrow-right" className="h-4 w-4" />
            </ButtonLink>
            {secondaryCta ? (
              <ButtonLink
                href={secondaryCta.href}
                variant="secondary"
                size="lg"
              >
                {secondaryCta.label}
              </ButtonLink>
            ) : null}
          </div>

          {note ? (
            <p className="mt-9 border-t border-line pt-7 text-xs leading-6 text-ink-soft">
              {note}
            </p>
          ) : null}

          {children}
        </div>
      </Reveal>
    </section>
  );
}
