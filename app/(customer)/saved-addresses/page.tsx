import type { Metadata } from "next";
import { redirect } from "next/navigation";

import {
  AddressManager,
  type SavedAddress,
} from "@/components/site/account/address-manager";
import { AccountHeader } from "@/components/site/account/account-panel";
import { serialize } from "@/lib/http";
import { Address } from "@/lib/models";
import { isDatabaseConfigured, tryConnectToDatabase } from "@/lib/mongodb";
import { getCurrentSession } from "@/lib/session";

export const metadata: Metadata = { title: "Saved Addresses" };

/**
 * Saved addresses.
 *
 * Reads and writes through `/api/addresses`. The `Address` model existed but had no
 * customer-facing route, so this page could only ever show an empty state.
 */
export default async function SavedAddressesPage() {
  const session = await getCurrentSession();
  if (!session) redirect("/login?next=/saved-addresses");

  const addresses = await loadAddresses(session.user.id);

  return (
    <>
      <AccountHeader
        eyebrow="Addresses"
        title="Delivery and billing addresses"
        description="Keep addresses on file so checkout and dispatch do not need re-typing."
      />

      <AddressManager addresses={addresses} />
    </>
  );
}

async function loadAddresses(userId: string): Promise<SavedAddress[]> {
  if (!isDatabaseConfigured()) return [];

  const connected = await tryConnectToDatabase();
  if (!connected) return [];

  return serialize(
    await Address.find({ userId })
      .sort({ defaultShipping: -1, createdAt: -1 })
      .lean(),
  ) as SavedAddress[];
}
