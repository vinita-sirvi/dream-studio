import type { Policy } from "@/data/policies";
import { Reveal } from "@/components/motion/reveal";
import { ButtonLink } from "@/components/ui/button";

import { PageHero } from "./page-hero";
import { Icon } from "./icons";

/**
 * Shared renderer for the three policy pages.
 *
 * Uses a narrow measure (~65 characters) and generous leading, because these are
 * the only pages on the site people actually have to read closely.
 */
export function PolicyPage({ policy }: { policy: Policy }) {
  return (
    <>
      <PageHero
        eyebrow={policy.eyebrow}
        title={policy.title}
        description={policy.intro}
        crumbs={[{ label: policy.eyebrow }]}
      />

      <div className="shell grid gap-14 py-16 md:py-20 lg:grid-cols-[16rem_1fr] lg:gap-20">
        {/* Contents rail */}
        <aside className="lg:sticky lg:top-32 lg:self-start">
          <p className="eyebrow text-ink-faint">On this page</p>
          <nav aria-label="Policy sections">
            <ol className="mt-5 grid gap-3">
              {policy.sections.map((section, index) => (
                <li key={section.heading}>
                  <a
                    href={`#section-${index}`}
                    className="group/toc flex gap-3 text-sm leading-6 text-ink-soft transition-colors hover:text-ink"
                  >
                    <span className="tabular-nums text-brass">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    {section.heading}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <p className="mt-8 border-t border-line pt-6 text-xs text-ink-faint">
            Last updated {policy.updated}
          </p>
        </aside>

        {/* Body */}
        <div className="max-w-2xl">
          {policy.sections.map((section, index) => (
            <Reveal
              key={section.heading}
              direction="up"
              as="section"
              className="scroll-mt-32 border-b border-line pb-10 pt-2 last:border-b-0"
            >
              <div id={`section-${index}`} className="scroll-mt-32" />
              <h2 className="flex items-baseline gap-4 display-md text-ink">
                <span className="font-display text-base text-brass">
                  {String(index + 1).padStart(2, "0")}
                </span>
                {section.heading}
              </h2>
              <div className="mt-5 grid gap-4">
                {section.body.map((paragraph) => (
                  <p
                    key={paragraph.slice(0, 40)}
                    className="text-[15px] leading-8 text-ink-soft"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </Reveal>
          ))}

          <div className="mt-12 rounded-panel border border-line bg-canvas-warm p-8">
            <h2 className="font-display text-xl text-ink">
              Still not sure where you stand?
            </h2>
            <p className="mt-3 text-sm leading-7 text-ink-soft">
              Policies are necessarily general. If your situation is not covered
              here, write to us and we will give you a straight answer about your
              specific order.
            </p>
            <ButtonLink href="/contact" variant="secondary" className="mt-6">
              Contact the studio
              <Icon name="arrow-right" className="h-4 w-4" />
            </ButtonLink>
          </div>
        </div>
      </div>
    </>
  );
}
