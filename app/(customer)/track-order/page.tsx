import type { Metadata } from "next";

import {
  AccountCard,
  AccountHeader,
} from "@/components/site/account/account-panel";
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
 * There is no public order-lookup endpoint in this codebase (orders are only
 * readable through the authenticated admin API), so this page explains the stages
 * and routes people to the studio rather than offering a lookup form that would
 * always fail.
 */
export default function TrackOrderPage() {
  return (
    <>
      <AccountHeader
        eyebrow="Tracking"
        title="Where your order is"
        description="Every order moves through six stages. We message you as each one completes, so you should rarely need to ask."
      />

      <Reveal stagger={0.07} className="mt-10 grid gap-px bg-line">
        {STAGES.map((stage, index) => (
          <div key={stage.label} className="flex gap-5 bg-canvas py-5">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-line font-display text-sm text-brass-ink">
              {index + 1}
            </span>
            <div>
              <h2 className="font-display text-lg text-ink">{stage.label}</h2>
              <p className="mt-1 text-sm leading-6 text-ink-soft">{stage.text}</p>
            </div>
          </div>
        ))}
      </Reveal>

      <div className="mt-8">
        <AccountCard title="Need a status now?">
          <p className="text-sm leading-7 text-ink-soft">
            Self-service tracking is not live yet. Send your order number and we
            will tell you exactly which bench it is on.
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
        </AccountCard>
      </div>
    </>
  );
}
