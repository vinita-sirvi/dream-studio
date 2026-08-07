import { announcement } from "@/data/home";
import { getGuestId, getCurrentSession } from "@/lib/session";
import { readCartCount } from "@/lib/cart";
import { isDatabaseConfigured } from "@/lib/mongodb";

import { HeaderShell } from "./header-shell";

/**
 * Server component. Resolves the session once on the server and hands it to the
 * interactive shell, so the header never flashes a signed-out state and no
 * client-side auth request is made.
 */
export async function SiteHeader({
  /** Routes with a dark hero behind the header render it transparent at top. */
  overHero = false,
}: {
  overHero?: boolean;
}) {
  const session = await getCurrentSession();
  const cartCount = await resolveCartCount(session?.user.id);

  return (
    <HeaderShell
      user={
        session?.user
          ? { name: session.user.name, role: session.user.role }
          : null
      }
      announcement={announcement}
      overHero={overHero}
      cartCount={cartCount}
    />
  );
}

/**
 * Units in the bag, for the header badge.
 *
 * Deliberately reads the *existing* guest cookie rather than creating one — the
 * header renders on every page, and minting a cookie here would give every
 * first-time visitor a guest id before they had done anything. A failure returns
 * zero: a missing badge is a far better outcome than a header that throws and
 * takes the whole page down with it.
 */
async function resolveCartCount(userId?: string) {
  if (!isDatabaseConfigured()) return 0;

  try {
    if (userId) {
      return await readCartCount({ userId });
    }

    const guestId = await getGuestId();
    if (!guestId) return 0;
    return await readCartCount({ guestSessionId: guestId });
  } catch {
    return 0;
  }
}
