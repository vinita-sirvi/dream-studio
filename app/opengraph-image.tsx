import { ImageResponse } from "next/og";

export const alt = "Divya & Design — Bespoke Tailoring & Custom Fashion";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Default social card.
 *
 * Uses system serif rather than fetching Cormorant, so generation never depends
 * on a network round-trip at request time. Colours match the brand tokens.
 */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          // Matches --color-espresso / --color-espresso-soft.
          background: "linear-gradient(135deg, #0B1717 0%, #142424 100%)",
          padding: "72px 80px",
          fontFamily: "Georgia, serif",
        }}
      >
        {/* Kicker */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 18,
            color: "#FFB199", // --color-brass-soft
            fontSize: 22,
            letterSpacing: 6,
            textTransform: "uppercase",
          }}
        >
          <div style={{ width: 56, height: 2, background: "#EA4F2E" }} />
          Bespoke Atelier · Est. 2024
        </div>

        {/* Headline */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 92, color: "#F5F9F8", lineHeight: 1.02 }}>
            Cut for one person.
          </div>
          <div
            style={{
              fontSize: 92,
              color: "#FFB199",
              fontStyle: "italic",
              lineHeight: 1.02,
            }}
          >
            Yours.
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            borderTop: "1px solid rgba(245,249,248,0.18)",
            paddingTop: 28,
          }}
        >
          <div style={{ fontSize: 34, color: "#F5F9F8" }}>Divya &amp; Design</div>
          <div style={{ fontSize: 20, color: "#A9BDBB", letterSpacing: 2 }}>
            Made to measure · Hand-finished
          </div>
        </div>
      </div>
    ),
    size,
  );
}
