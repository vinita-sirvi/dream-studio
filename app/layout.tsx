import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";

import "./globals.css";

/**
 * Both faces are variable and self-hosted by next/font, so there is no external
 * request and no layout shift. `display: swap` + the fallback metrics below keep
 * CLS at zero while the face loads.
 */
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
});

const jost = Jost({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jost",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.APP_URL ?? "http://localhost:3000"),
  title: {
    default: "Divya & Design — Bespoke Tailoring & Custom Fashion",
    template: "%s | Divya & Design",
  },
  description:
    "An atelier for custom-made clothing. Hand-finished kurtis, blouses, lehengas and co-ord sets, tailored to your measurements.",
  applicationName: "Divya & Design",
  keywords: [
    "custom tailoring",
    "bespoke clothing",
    "made to measure",
    "kurti",
    "lehenga",
    "blouse stitching",
    "Indian ethnic wear",
  ],
  openGraph: {
    type: "website",
    siteName: "Divya & Design",
    title: "Divya & Design — Bespoke Tailoring & Custom Fashion",
    description:
      "An atelier for custom-made clothing, tailored to your measurements.",
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    // Matches --color-canvas / --color-espresso in app/globals.css.
    { media: "(prefers-color-scheme: light)", color: "#f7f9f9" },
    { media: "(prefers-color-scheme: dark)", color: "#0b1717" },
  ],
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // NOTE: no `data-scroll-behavior="smooth"`. In Next 16 that would re-enable
    // the smooth-scroll override on navigation, which fights Lenis.
    <html
      lang="en"
      className={`${cormorant.variable} ${jost.variable} h-full`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col bg-canvas text-ink">
        {children}
      </body>
    </html>
  );
}
