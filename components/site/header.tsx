import { announcement } from "@/data/home";
import { getCurrentSession } from "@/lib/session";

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

  return (
    <HeaderShell
      user={
        session?.user
          ? { name: session.user.name, role: session.user.role }
          : null
      }
      announcement={announcement}
      overHero={overHero}
    />
  );
}
