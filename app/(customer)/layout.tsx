import { redirect } from "next/navigation";

import { getCurrentSession } from "@/lib/session";
import { SiteFooter } from "@/components/site/footer";
import { SiteHeader } from "@/components/site/header";
import { SmoothScroll } from "@/components/motion/smooth-scroll";
import { AccountNav } from "@/components/site/account/account-nav";

/**
 * Signed-in customer area.
 *
 * Auth behaviour is unchanged: no session means a redirect to
 * /login?next=/account.
 *
 * Previously this group rendered without the site header or footer, so the
 * account pages felt like a different application. They now sit inside the same
 * chrome as the storefront.
 */
export default async function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getCurrentSession();
  if (!session) redirect("/login?next=/account");

  return (
    <>
      <SmoothScroll />
      <SiteHeader />

      <main id="main" className="flex-1">
        <div className="shell grid gap-10 py-14 md:py-20 lg:grid-cols-[17rem_1fr] lg:gap-16">
          <AccountNav
            userName={session.user.name}
            userEmail={session.user.email}
          />
          <div className="min-w-0">{children}</div>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
