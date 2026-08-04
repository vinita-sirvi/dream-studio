import type { Metadata } from "next";

import {
  AccountEmpty,
  AccountHeader,
} from "@/components/site/account/account-panel";

export const metadata: Metadata = { title: "Saved Addresses" };

/**
 * Saved addresses.
 *
 * An Address model exists in lib/models.ts, but there is no route to read or
 * write addresses for the signed-in user, so this presents its empty state
 * honestly rather than a form that cannot persist.
 */
export default function SavedAddressesPage() {
  return (
    <>
      <AccountHeader
        eyebrow="Addresses"
        title="Delivery and billing addresses"
        description="Keep addresses on file so checkout and dispatch do not need re-typing."
      />

      <AccountEmpty
        icon="pin"
        title="No addresses saved"
        description="Add an address when you place your next order and we will keep it here for future deliveries."
        primaryCta={{ label: "Browse the catalogue", href: "/shop" }}
        secondaryCta={{ label: "Contact the studio", href: "/contact" }}
      />
    </>
  );
}
