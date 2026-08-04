import type { Metadata } from "next";

import { howToMeasure } from "@/data/size-guide";
import {
  AccountCard,
  AccountEmpty,
  AccountHeader,
} from "@/components/site/account/account-panel";
import { ButtonLink } from "@/components/ui/button";

export const metadata: Metadata = { title: "Saved Measurements" };

/**
 * Saved measurement profiles.
 *
 * A Measurement model exists in lib/models.ts, but there is no route to read or
 * write profiles for the signed-in user, so this shows the empty state plus the
 * reference list of what we record. The public /size-guide page carries the full
 * how-to-measure walkthrough.
 */
export default function SavedMeasurementsPage() {
  return (
    <>
      <AccountHeader
        eyebrow="Measurements"
        title="Your measurement profiles"
        description="Store several named profiles — your own, and any you order on behalf of. Every commission starts from the profile you choose."
        action={{ label: "Full size guide", href: "/size-guide" }}
      />

      <AccountEmpty
        icon="tape"
        title="No profiles saved yet"
        description="Measurements are recorded during your first fitting, in the studio or over a guided video call, and kept here afterwards."
        primaryCta={{ label: "Book a fitting call", href: "/contact" }}
        secondaryCta={{ label: "Read the size guide", href: "/size-guide" }}
      />

      <div className="mt-6">
        <AccountCard
          title="What we record"
          footer={
            <ButtonLink href="/size-guide" variant="underline">
              How to take each one
            </ButtonLink>
          }
        >
          <ul className="grid gap-2.5 sm:grid-cols-2">
            {howToMeasure.map((item, index) => (
              <li
                key={item.name}
                className="flex items-baseline gap-3 text-sm text-ink-soft"
              >
                <span className="tabular-nums text-brass">
                  {String(index + 1).padStart(2, "0")}
                </span>
                {item.name}
              </li>
            ))}
          </ul>
        </AccountCard>
      </div>
    </>
  );
}
