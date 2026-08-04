import type { Metadata } from "next";

import { getCurrentSession } from "@/lib/session";
import {
  AccountCard,
  AccountHeader,
} from "@/components/site/account/account-panel";
import { Reveal } from "@/components/motion/reveal";
import { ButtonLink } from "@/components/ui/button";
import { Icon } from "@/components/site/icons";

export const metadata: Metadata = { title: "My Account" };

const SHORTCUTS = [
  {
    icon: "box" as const,
    title: "Orders",
    text: "Track what is in the workroom and what has shipped.",
    href: "/orders",
  },
  {
    icon: "tape" as const,
    title: "Measurements",
    text: "Store profiles so repeat orders skip the measuring.",
    href: "/saved-measurements",
  },
  {
    icon: "pin" as const,
    title: "Addresses",
    text: "Keep delivery and billing addresses on file.",
    href: "/saved-addresses",
  },
  {
    icon: "truck" as const,
    title: "Track an order",
    text: "Follow a dispatched parcel to your door.",
    href: "/track-order",
  },
];

/**
 * Account overview.
 *
 * Profile values come from the signed session. There is no per-user profile
 * update endpoint in this codebase, so the details below are read-only and say
 * so, rather than presenting a form that cannot save.
 */
export default async function AccountPage() {
  const session = await getCurrentSession();
  // The layout redirects when there is no session, so this is always present.
  const user = session!.user;

  return (
    <>
      <AccountHeader
        eyebrow="Overview"
        title={`Hello, ${user.name.split(" ")[0]}`}
        description="Your account holds measurements, addresses and order history so every repeat commission starts from what we already know."
      />

      <Reveal stagger={0.07} className="mt-10 grid gap-4 sm:grid-cols-2">
        {SHORTCUTS.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="group/sc flex items-start gap-4 rounded-card border border-line bg-surface p-6 transition-colors hover:border-brass hover:bg-brass-wash"
          >
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-line text-brass transition-colors group-hover/sc:border-brass">
              <Icon name={item.icon} className="h-5 w-5" />
            </span>
            <span>
              <span className="flex items-center gap-2 font-display text-lg text-ink">
                {item.title}
                <Icon
                  name="arrow-right"
                  className="h-4 w-4 -translate-x-1 text-brass opacity-0 transition-all duration-300 group-hover/sc:translate-x-0 group-hover/sc:opacity-100"
                />
              </span>
              <span className="mt-1 block text-sm leading-6 text-ink-soft">
                {item.text}
              </span>
            </span>
          </a>
        ))}
      </Reveal>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <AccountCard
          title="Your details"
          footer={
            <p className="text-xs leading-6 text-ink-soft">
              To change your name or email, email the studio — profile editing is
              not yet self-service.
            </p>
          }
        >
          <dl className="grid gap-4 text-sm">
            <div>
              <dt className="text-[10px] uppercase tracking-[0.18em] text-ink-faint">
                Name
              </dt>
              <dd className="mt-1 text-ink">{user.name}</dd>
            </div>
            <div>
              <dt className="text-[10px] uppercase tracking-[0.18em] text-ink-faint">
                Email
              </dt>
              <dd className="mt-1 break-all text-ink">{user.email}</dd>
            </div>
            <div>
              <dt className="text-[10px] uppercase tracking-[0.18em] text-ink-faint">
                Account type
              </dt>
              <dd className="mt-1 capitalize text-ink">
                {user.role.replace("_", " ")}
              </dd>
            </div>
          </dl>
        </AccountCard>

        <AccountCard title="Start something new">
          <p className="text-sm leading-7 text-ink-soft">
            Commissions start with a short brief. If your measurements are already
            saved, a tailor works straight from them.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <ButtonLink href="/custom-order">
              Commission a piece
              <Icon name="arrow-right" className="h-4 w-4" />
            </ButtonLink>
            <ButtonLink href="/shop" variant="secondary">
              Browse catalogue
            </ButtonLink>
          </div>
        </AccountCard>
      </div>
    </>
  );
}
