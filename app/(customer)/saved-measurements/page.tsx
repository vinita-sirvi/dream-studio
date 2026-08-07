import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { howToMeasure } from "@/data/size-guide";
import {
  AccountCard,
  AccountHeader,
} from "@/components/site/account/account-panel";
import {
  MeasurementManager,
  type MeasurementProfile,
} from "@/components/site/account/measurement-manager";
import { ButtonLink } from "@/components/ui/button";
import { serialize } from "@/lib/http";
import { Measurement } from "@/lib/models";
import { isDatabaseConfigured, tryConnectToDatabase } from "@/lib/mongodb";
import { getCurrentSession } from "@/lib/session";

export const metadata: Metadata = { title: "Saved Measurements" };

/**
 * Saved measurement profiles.
 *
 * Reads and writes through `/api/measurements`. The reference list of what the
 * studio records stays below the editor, and the full walkthrough lives on the
 * public /size-guide page.
 */
export default async function SavedMeasurementsPage() {
  const session = await getCurrentSession();
  if (!session) redirect("/login?next=/saved-measurements");

  const profiles = await loadProfiles(session.user.id);

  return (
    <>
      <AccountHeader
        eyebrow="Measurements"
        title="Your measurement profiles"
        description="Store several named profiles — your own, and any you order on behalf of. Every commission starts from the profile you choose."
        action={{ label: "Full size guide", href: "/size-guide" }}
      />

      <MeasurementManager profiles={profiles} />

      <div className="mt-8">
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

async function loadProfiles(userId: string): Promise<MeasurementProfile[]> {
  if (!isDatabaseConfigured()) return [];

  const connected = await tryConnectToDatabase();
  if (!connected) return [];

  return serialize(
    await Measurement.find({ userId }).sort({ createdAt: -1 }).lean(),
  ) as MeasurementProfile[];
}
