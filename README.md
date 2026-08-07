# Divya & Design

A bespoke tailoring storefront and admin: catalogue, cart, checkout, commissions,
customer accounts, and a CMS for staff. Next.js 16 (App Router) with MongoDB via
Mongoose.

## Getting started

```bash
npm install
cp .env.example .env.local   # then fill it in — see below
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

The site runs with no configuration at all: without `MONGODB_URI` the storefront
serves the bundled demo catalogue in `lib/demo-data.ts`, so pages render. Cart,
checkout and account features need a database.

## Environment

Every variable is documented in [`.env.example`](.env.example). The two that
matter most:

| Variable | Notes |
| --- | --- |
| `SESSION_SECRET` | **Required in production.** Signs the session cookie; the server refuses to start signing sessions without it. Generate with `openssl rand -base64 32`. |
| `ADMIN_EMAILS` | Comma-separated. These addresses are promoted to `admin` on first sign-in, and receive contact/commission notifications. |

### Creating the first admin

Put your address in `ADMIN_EMAILS`, then register or sign in with it. The account
is promoted on the way through.

In development only, the demo seed also creates
`admin@divyaanddesign.com` / `Admin@12345!`. Those credentials are in this
repository, so the seed's user accounts never run in production.

## Architecture

```
app/
  (marketing)/   public storefront — catalogue, cart, checkout, commissions
  (customer)/    signed-in account — orders, addresses, measurements
  (admin)/       staff CMS
  api/           route handlers
components/      site/, admin/, ui/, motion/, three/
lib/             data access, pricing, auth, validation
data/            static editorial content
```

### Things worth knowing

**Money is computed on the server, always.** `lib/pricing.ts` resolves prices from
the catalogue and `lib/checkout.ts` builds orders from the caller's stored cart.
The checkout request body carries contact and address details only — no prices, no
totals. Listed prices are treated as tax-inclusive, so `tax` on an order is the
component extracted for the invoice rather than an amount added on top.

**Authorization lives next to the data.** Route handlers call `requireAdmin()` or
`requireSession()` from `lib/api-auth.ts`; page groups additionally guard in their
layout, and pages that read user data re-check (layouts do not re-render on every
navigation). Customer-owned records are scoped by putting `userId` in the query
filter, so another customer's id matches nothing rather than being checked after
the fact.

**Carts and wishlists follow guests.** Keyed by user id when signed in and by a
signed guest cookie otherwise, then merged into the account by the login, register
and OTP routes.

**Stock is reserved, not just checked.** `lib/checkout.ts` decrements with a
conditional update guarded on the current count, so two people buying the last
piece cannot both succeed, and releases on failure.

**Rate limiting is per-process.** `lib/rate-limit.ts` holds counters in memory.
Behind more than one instance an attacker gets `limit × instances` — back it with
Redis before scaling out. Call sites do not need to change.

## Scripts

```bash
npm run dev      # development server
npm run build    # production build
npm run start    # serve the build
npm run lint     # eslint
npx tsc --noEmit # typecheck
```

## Working on this codebase

`AGENTS.md` applies: this is Next.js 16, which renamed Middleware to Proxy and
changed other conventions. Check `node_modules/next/dist/docs/` rather than
assuming older API shapes.
