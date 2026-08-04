import type { Metadata } from "next";

import { allFaqs, faqGroups } from "@/data/faq";
import { brandContact } from "@/data/navigation";
import { PageHero } from "@/components/site/page-hero";
import { Icon } from "@/components/site/icons";
import { Accordion } from "@/components/ui/accordion";
import { ButtonLink } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description:
    "How bespoke ordering works, how we take measurements, which fabrics we use, and what happens if a garment does not fit.",
};

export default function FaqPage() {
  // FAQPage structured data — eligible for rich results in search.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: allFaqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <PageHero
        eyebrow="Help"
        title="Questions people actually ask"
        description="Grouped by topic. If your question is not here, write to us — we answer within one working day."
        crumbs={[{ label: "FAQ" }]}
      />

      <div className="shell grid gap-14 py-16 md:py-20 lg:grid-cols-[16rem_1fr] lg:gap-20">
        {/* Topic rail */}
        <aside className="lg:sticky lg:top-32 lg:self-start">
          <p className="eyebrow text-ink-faint">Topics</p>
          <nav aria-label="FAQ topics">
            <ol className="mt-5 grid gap-3">
              {faqGroups.map((group, index) => (
                <li key={group.category}>
                  <a
                    href={`#faq-${index}`}
                    className="flex gap-3 text-sm leading-6 text-ink-soft transition-colors hover:text-ink"
                  >
                    <span className="tabular-nums text-brass">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    {group.category}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <div className="mt-9 border-t border-line pt-7">
            <p className="text-sm leading-7 text-ink-soft">
              Prefer to ask a person?
            </p>
            <a
              href={`mailto:${brandContact.email}`}
              className="mt-2 inline-flex items-center gap-2 text-sm text-brass-ink transition-opacity hover:opacity-70"
            >
              <Icon name="mail" className="h-4 w-4" />
              Email the studio
            </a>
          </div>
        </aside>

        {/* Groups */}
        <div className="max-w-3xl">
          {faqGroups.map((group, index) => (
            <Reveal
              key={group.category}
              direction="up"
              as="section"
              className="mb-14 last:mb-0"
            >
              <div id={`faq-${index}`} className="scroll-mt-32" />
              <h2 className="flex items-baseline gap-4 display-md text-ink">
                <span className="font-display text-base text-brass">
                  {String(index + 1).padStart(2, "0")}
                </span>
                {group.category}
              </h2>
              <Accordion className="mt-6" items={group.items} />
            </Reveal>
          ))}

          <div className="mt-14 rounded-panel bg-espresso p-8 text-on-dark md:p-10">
            <h2 className="display-md text-on-dark">Still stuck?</h2>
            <p className="mt-4 max-w-lg text-sm leading-7 text-on-dark-soft">
              Fit questions are much easier to answer with a photograph. Send one
              over and a tailor will tell you exactly what to change.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/contact" variant="onDark">
                Ask a question
                <Icon name="arrow-right" className="h-4 w-4" />
              </ButtonLink>
              <ButtonLink
                href="/size-guide"
                variant="ghost"
                className="border-on-dark-soft/40 text-on-dark hover:border-on-dark hover:bg-on-dark/10"
              >
                Read the size guide
              </ButtonLink>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
