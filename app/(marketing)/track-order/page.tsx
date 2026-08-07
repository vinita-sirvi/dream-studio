import type { Metadata } from "next";

import { PageHero } from "@/components/site/page-hero";
import { TrackOrderForm } from "@/components/site/account/track-order-form";
import { brandContact } from "@/data/navigation";
import { Icon } from "@/components/site/icons";
import { ButtonLink } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";

export const metadata: Metadata = { title: "Track Order" };

/** The workroom stages an order passes through. */
const STAGES = [
  { label: "Confirmed", text: "Deposit received, brief locked." },
  { label: "Cutting", text: "Pattern drafted and cloth cut." },
  { label: "Stitching", text: "In the hands of an assigned tailor." },
  { label: "Fitting", text: "Toile checked, adjustments made." },
  { label: "Finishing", text: "Hems, linings and closures by hand." },
  { label: "Dispatched", text: "Pressed, boxed, insured and tracked." },
];

/**
 * Order tracking.
 *
 * Deliberately in the marketing group rather than the signed-in account area. This
 * page previously sat under `(customer)`, whose layout redirects anyone without a
 * session to /login — but guests can check out, so the people most likely to need
 * tracking were the ones who could not reach it. The lookup itself is guarded by
 * requiring the order's email, not by requiring an account.
 */
export default async function TrackOrderPage({
  searchParams,
}: {
  searchParams: Promise<{ orderId?: string }>;
}) {
  const { orderId } = await searchParams;

  return (
    <>
      <PageHero
        eyebrow="Tracking"
        title="Where your order is"
        description="Enter your order number and the email you used, and we will show you exactly which stage it has reached."
        crumbs={[{ label: "Track order" }]}
      />

      <section className="shell py-14 md:py-20">
        <div className="mx-auto max-w-3xl">
          <TrackOrderForm
            defaultOrderId={(orderId ?? "").replace(/[^A-Z0-9-]/gi, "").slice(0, 40)}
          />

          <h2 className="mt-16 font-display text-2xl text-ink">
            The six stages
          </h2>
          <p className="mt-3 text-sm leading-7 text-ink-soft">
            Every order moves through these. We message you as each one completes,
            so you should rarely need to ask.
          </p>

          <Reveal stagger={0.07} className="mt-8 grid gap-px bg-line">
            {STAGES.map((stage, index) => (
              <div key={stage.label} className="flex gap-5 bg-canvas py-5">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-line font-display text-sm text-brass-ink">
                  {index + 1}
                </span>
                <div>
                  <h3 className="font-display text-lg text-ink">{stage.label}</h3>
                  <p className="mt-1 text-sm leading-6 text-ink-soft">
                    {stage.text}
                  </p>
                </div>
              </div>
            ))}
          </Reveal>

          <div className="mt-12 rounded-card border border-line bg-canvas-warm p-6 md:p-7">
            <h2 className="font-display text-lg text-ink">Cannot find it?</h2>
            <p className="mt-3 text-sm leading-7 text-ink-soft">
              Check the order number against your confirmation email. If it still
              will not come up, message us and we will tell you exactly which bench
              it is on.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <ButtonLink href="/contact">
                Ask about my order
                <Icon name="arrow-right" className="h-4 w-4" />
              </ButtonLink>
              <ButtonLink href="https://wa.me/919876543210" variant="secondary">
                <Icon name="whatsapp" className="h-4 w-4" />
                WhatsApp us
              </ButtonLink>
            </div>
            <p className="mt-5 text-xs text-ink-soft">{brandContact.hours}</p>
          </div>
        </div>
      </section>
    </>
  );
}
