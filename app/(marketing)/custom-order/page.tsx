import type { Metadata } from "next";
import { Suspense } from "react";

import { IMAGES, processSteps, services } from "@/data/home";
import { CustomOrderForm } from "@/components/site/custom-order-form";
import { PageHero } from "@/components/site/page-hero";
import { Icon } from "@/components/site/icons";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/ui/section-heading";

export const metadata: Metadata = {
  title: "Bespoke Commission",
  description:
    "Start a made-to-measure commission. Submit a brief and a tailor replies with a quotation, fabric suggestions and a delivery estimate within two working days.",
};

export default function CustomOrderPage() {
  return (
    <>
      <PageHero
        eyebrow="Bespoke"
        title="Commission something that fits only you"
        description="Start from a sketch, a photograph, or a garment you already love. Submitting a brief costs nothing and commits you to nothing."
        image={IMAGES.ethnic}
        crumbs={[{ label: "Bespoke" }]}
      />

      {/* What happens next */}
      <section className="border-b border-line bg-canvas-warm py-16">
        <div className="shell">
          <p className="eyebrow text-brass-ink">What happens after you submit</p>
          <Reveal
            stagger={0.07}
            className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-5"
          >
            {processSteps.map((step) => (
              <div key={step.step} className="flex gap-4">
                <span className="font-display text-2xl text-brass-soft">
                  {step.step}
                </span>
                <div>
                  <h3 className="text-sm font-medium text-ink">{step.title}</h3>
                  <p className="mt-1.5 text-xs leading-6 text-ink-soft">
                    {step.text}
                  </p>
                </div>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Form + aside */}
      <section className="shell grid gap-14 py-16 md:py-20 lg:grid-cols-[1.35fr_0.65fr] lg:gap-16">
        <div>
          <SectionHeading
            eyebrow="Your brief"
            title="Tell us about the piece"
            description="Every field except the essentials is optional — a tailor will fill the gaps with you. The more you can share now, the more accurate the first quotation."
            size="md"
          />

          <div className="mt-10">
            {/* Reads `?product=` / `?size=` / `?fit=` via useSearchParams, so it
                needs a Suspense boundary to keep this page statically renderable. */}
            <Suspense
              fallback={
                <div className="h-[60rem] rounded-panel border border-line bg-surface" />
              }
            >
              <CustomOrderForm />
            </Suspense>
          </div>
        </div>

        {/* Aside */}
        <aside className="lg:sticky lg:top-32 lg:self-start">
          <div className="rounded-panel bg-espresso p-7 text-on-dark">
            <h2 className="font-display text-xl text-on-dark">
              What it costs, roughly
            </h2>
            <dl className="mt-6 grid gap-4">
              {services.map((service) => (
                <div
                  key={service.title}
                  className="border-b border-on-dark/12 pb-4 last:border-b-0 last:pb-0"
                >
                  <dt className="text-sm text-on-dark">{service.title}</dt>
                  <dd className="mt-1 text-sm text-brass-soft">
                    {service.price}
                  </dd>
                </div>
              ))}
            </dl>
            <p className="mt-6 text-xs leading-6 text-on-dark-soft">
              Final price depends on fabric and the amount of hand-work. The
              quotation you receive is firm, not indicative.
            </p>
          </div>

          <div className="mt-6 rounded-card border border-line bg-canvas-warm p-6">
            <Icon name="clock" className="h-6 w-6 text-brass" />
            <h2 className="mt-4 font-display text-lg text-ink">Timelines</h2>
            <ul className="mt-3 grid gap-2.5 text-sm leading-6 text-ink-soft">
              <li>Made-to-measure — 10 to 14 days</li>
              <li>Bespoke commission — 3 to 4 weeks</li>
              <li>Bridal — 8 to 12 weeks</li>
            </ul>
            <p className="mt-4 border-t border-line pt-4 text-xs leading-6 text-ink-soft">
              Bridal slots are capped each season so the workroom is not
              stretched. Start early if you have a fixed date.
            </p>
          </div>
        </aside>
      </section>
    </>
  );
}
