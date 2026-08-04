type IconName =
  | "search"
  | "user"
  | "bag"
  | "chevron-left"
  | "chevron-right"
  | "tape"
  | "badge"
  | "lock"
  | "truck"
  | "returns"
  | "dress"
  | "fabric"
  | "spark"
  | "scissors"
  | "box"
  | "chat"
  | "gift"
  | "shield"
  | "tag"
  | "heart"
  | "heart-filled"
  | "menu"
  | "close"
  | "arrow-right"
  | "arrow-up-right"
  | "chevron-down"
  | "plus"
  | "minus"
  | "check"
  | "filter"
  | "sliders"
  | "zoom"
  | "quote"
  | "sparkle"
  | "hanger"
  | "needle"
  | "ruler"
  | "mail"
  | "phone"
  | "pin"
  | "clock"
  | "instagram"
  | "facebook"
  | "pinterest"
  | "whatsapp";

const stroke = "currentColor";

export function Icon({
  name,
  className = "",
}: {
  name: IconName;
  className?: string;
}) {
  const common = {
    fill: "none",
    stroke,
    strokeWidth: "1.8",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  switch (name) {
    case "search":
      return (
        <svg viewBox="0 0 24 24" className={className} {...common}>
          <circle cx="11" cy="11" r="6.5" />
          <path d="m16 16 4 4" />
        </svg>
      );
    case "user":
      return (
        <svg viewBox="0 0 24 24" className={className} {...common}>
          <circle cx="12" cy="8" r="3.5" />
          <path d="M5.5 19c1.8-3.2 4.2-4.8 6.5-4.8S16.7 15.8 18.5 19" />
        </svg>
      );
    case "bag":
      return (
        <svg viewBox="0 0 24 24" className={className} {...common}>
          <path d="M6.5 8h11l-1 11h-9z" />
          <path d="M9 8a3 3 0 0 1 6 0" />
        </svg>
      );
    case "chevron-left":
      return (
        <svg viewBox="0 0 24 24" className={className} {...common}>
          <path d="m14 6-6 6 6 6" />
        </svg>
      );
    case "chevron-right":
      return (
        <svg viewBox="0 0 24 24" className={className} {...common}>
          <path d="m10 6 6 6-6 6" />
        </svg>
      );
    case "tape":
      return (
        <svg viewBox="0 0 24 24" className={className} {...common}>
          <path d="M4 14a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v3H4z" />
          <path d="M8 10V7a4 4 0 0 1 8 0v3" />
          <path d="M8.5 17v-1M11 17v-2M13.5 17v-1M16 17v-2" />
        </svg>
      );
    case "badge":
      return (
        <svg viewBox="0 0 24 24" className={className} {...common}>
          <path d="M12 3 14.6 6.3 19 7l-.8 4.3L20 15l-4.1 1.4L14.6 21 12 18.8 9.4 21l-.3-4.6L4 15l1.8-3.7L5 7l4.4-.7z" />
          <path d="m9.5 12.2 1.6 1.6 3.5-3.7" />
        </svg>
      );
    case "lock":
      return (
        <svg viewBox="0 0 24 24" className={className} {...common}>
          <rect x="6" y="11" width="12" height="9" rx="2" />
          <path d="M8 11V8a4 4 0 0 1 8 0v3" />
          <path d="M12 14v2" />
        </svg>
      );
    case "truck":
      return (
        <svg viewBox="0 0 24 24" className={className} {...common}>
          <path d="M3.5 7.5h10v8h-10z" />
          <path d="M13.5 10h4l3 3v2.5h-7z" />
          <circle cx="8" cy="18" r="1.8" />
          <circle cx="18" cy="18" r="1.8" />
        </svg>
      );
    case "returns":
      return (
        <svg viewBox="0 0 24 24" className={className} {...common}>
          <path d="M7 7H3v4" />
          <path d="M3 7c2.2-2.6 5.2-4 8.5-4A9.5 9.5 0 1 1 4.7 17.8" />
          <path d="M4 17.5V13h4.5" />
        </svg>
      );
    case "dress":
      return (
        <svg viewBox="0 0 24 24" className={className} {...common}>
          <path d="M9 4.5 12 7l3-2.5 2.2 2.6-1.7 3.2 1.4 2.9-2.3 6.3H9.4L7 13.2l1.4-2.9-1.7-3.2z" />
        </svg>
      );
    case "fabric":
      return (
        <svg viewBox="0 0 24 24" className={className} {...common}>
          <path d="M5 6h14v12H5z" />
          <path d="M8 6c0 3 2 3 2 6s-2 3-2 6" />
          <path d="M16 6c0 3-2 3-2 6s2 3 2 6" />
        </svg>
      );
    case "spark":
      return (
        <svg viewBox="0 0 24 24" className={className} {...common}>
          <path d="M12 4 13.5 9 19 10.5l-5.5 1.5L12 17l-1.5-5-5.5-1.5L10.5 9z" />
          <path d="M18 3v3M21 6h-3" />
        </svg>
      );
    case "scissors":
      return (
        <svg viewBox="0 0 24 24" className={className} {...common}>
          <circle cx="6" cy="7" r="2.2" />
          <circle cx="6" cy="17" r="2.2" />
          <path d="m8 8.5 9 5.5M8 15.5 17 10" />
        </svg>
      );
    case "box":
      return (
        <svg viewBox="0 0 24 24" className={className} {...common}>
          <path d="m4.5 8 7.5-4 7.5 4-7.5 4z" />
          <path d="M4.5 8v8l7.5 4 7.5-4V8" />
          <path d="M12 12v8" />
        </svg>
      );
    case "chat":
      return (
        <svg viewBox="0 0 24 24" className={className} {...common}>
          <path d="M5 5.5h14v9H12l-4.5 3v-3H5z" />
          <path d="M8 9h8M8 11.5h5" />
        </svg>
      );
    case "gift":
      return (
        <svg viewBox="0 0 24 24" className={className} {...common}>
          <path d="M4.5 9h15v3h-15z" />
          <path d="M6 12v8h12v-8" />
          <path d="M12 9v11M12 9c-1.8 0-3-1-3-2.3C9 5.8 10.4 5 12 6.5 13.6 5 15 5.8 15 6.7 15 8 13.8 9 12 9z" />
        </svg>
      );
    case "shield":
      return (
        <svg viewBox="0 0 24 24" className={className} {...common}>
          <path d="M12 3 19 6v5c0 4.4-2.7 8.1-7 10-4.3-1.9-7-5.6-7-10V6z" />
          <path d="m9.3 12 1.8 1.8 3.8-4" />
        </svg>
      );
    case "tag":
      return (
        <svg viewBox="0 0 24 24" className={className} {...common}>
          <path d="m4 12 8-8h6l2 2v6l-8 8z" />
          <circle cx="16.5" cy="7.5" r="1.2" />
        </svg>
      );
    case "heart":
      return (
        <svg viewBox="0 0 24 24" className={className} {...common}>
          <path d="M12 20.5 4.2 12.7a4.2 4.2 0 0 1 5.9-5.9L12 8.7l1.9-1.9a4.2 4.2 0 0 1 5.9 5.9z" />
        </svg>
      );
    case "menu":
      return (
        <svg viewBox="0 0 24 24" className={className} {...common}>
          <path d="M4 7h16M4 12h16M4 17h16" />
        </svg>
      );
    case "close":
      return (
        <svg viewBox="0 0 24 24" className={className} {...common}>
          <path d="m6 6 12 12M18 6 6 18" />
        </svg>
      );

    // --- Added for the redesign ------------------------------------------
    case "heart-filled":
      return (
        <svg viewBox="0 0 24 24" className={className} fill={stroke} stroke="none">
          <path d="M12 20.5 4.2 12.7a4.2 4.2 0 0 1 5.9-5.9L12 8.7l1.9-1.9a4.2 4.2 0 0 1 5.9 5.9z" />
        </svg>
      );
    case "arrow-right":
      return (
        <svg viewBox="0 0 24 24" className={className} {...common}>
          <path d="M4 12h15m-5.5-5.5L19 12l-5.5 5.5" />
        </svg>
      );
    case "arrow-up-right":
      return (
        <svg viewBox="0 0 24 24" className={className} {...common}>
          <path d="M7 17 17 7M8.5 7H17v8.5" />
        </svg>
      );
    case "chevron-down":
      return (
        <svg viewBox="0 0 24 24" className={className} {...common}>
          <path d="m6 10 6 6 6-6" />
        </svg>
      );
    case "plus":
      return (
        <svg viewBox="0 0 24 24" className={className} {...common}>
          <path d="M12 5v14M5 12h14" />
        </svg>
      );
    case "minus":
      return (
        <svg viewBox="0 0 24 24" className={className} {...common}>
          <path d="M5 12h14" />
        </svg>
      );
    case "check":
      return (
        <svg viewBox="0 0 24 24" className={className} {...common}>
          <path d="m5 12.5 4.5 4.5L19 7.5" />
        </svg>
      );
    case "filter":
      return (
        <svg viewBox="0 0 24 24" className={className} {...common}>
          <path d="M4 6h16l-6 7v5l-4 2v-7z" />
        </svg>
      );
    case "sliders":
      return (
        <svg viewBox="0 0 24 24" className={className} {...common}>
          <path d="M4 8h10M18 8h2M4 16h4M12 16h8" />
          <circle cx="16" cy="8" r="2" />
          <circle cx="10" cy="16" r="2" />
        </svg>
      );
    case "zoom":
      return (
        <svg viewBox="0 0 24 24" className={className} {...common}>
          <circle cx="11" cy="11" r="6.5" />
          <path d="m16 16 4 4M8.5 11h5M11 8.5v5" />
        </svg>
      );
    case "quote":
      return (
        <svg viewBox="0 0 24 24" className={className} fill={stroke} stroke="none">
          <path d="M9.5 6c-3 1.4-4.8 4-4.8 7.2 0 2.9 1.6 4.8 3.9 4.8 1.9 0 3.3-1.4 3.3-3.3 0-1.8-1.2-3.1-2.9-3.1-.3 0-.6 0-.8.1.3-1.7 1.5-3.1 3.2-4zm8.4 0c-3 1.4-4.8 4-4.8 7.2 0 2.9 1.6 4.8 3.9 4.8 1.9 0 3.3-1.4 3.3-3.3 0-1.8-1.2-3.1-2.9-3.1-.3 0-.6 0-.8.1.3-1.7 1.5-3.1 3.2-4z" />
        </svg>
      );
    case "sparkle":
      return (
        <svg viewBox="0 0 24 24" className={className} {...common}>
          <path d="M12 3.5 13.6 9 19 10.6 13.6 12.2 12 17.7 10.4 12.2 5 10.6 10.4 9z" />
          <path d="M18.5 16.5l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7z" />
        </svg>
      );
    case "hanger":
      return (
        <svg viewBox="0 0 24 24" className={className} {...common}>
          <path d="M12 8.5a2.4 2.4 0 1 1 2.4-2.4" />
          <path d="M12 8.5 4 14.2c-.8.6-.4 1.8.6 1.8h14.8c1 0 1.4-1.2.6-1.8z" />
        </svg>
      );
    case "needle":
      return (
        <svg viewBox="0 0 24 24" className={className} {...common}>
          <path d="M19 5 8.5 15.5" />
          <path d="M6.5 17.5 5 19l1.5-.5.5-1.5z" />
          <circle cx="18" cy="6" r="1.6" />
          <path d="M14 6.5c1.6 1.2 2.4 2.4 2.4 2.4" />
        </svg>
      );
    case "ruler":
      return (
        <svg viewBox="0 0 24 24" className={className} {...common}>
          <path d="M3.5 14.5 9.5 8.5l6 6-6 6z" />
          <path d="M11 7 17 1l6 6-6 6" />
          <path d="M13.5 9.5 12 11M16 12l-1.5 1.5M6 14l1.5 1.5M8.5 16.5 10 18" />
        </svg>
      );
    case "mail":
      return (
        <svg viewBox="0 0 24 24" className={className} {...common}>
          <rect x="3.5" y="6" width="17" height="12" rx="2" />
          <path d="m4.5 7.5 7.5 5.5 7.5-5.5" />
        </svg>
      );
    case "phone":
      return (
        <svg viewBox="0 0 24 24" className={className} {...common}>
          <path d="M6 3.5h3l1.5 4-2 1.5a10 10 0 0 0 6.5 6.5l1.5-2 4 1.5v3c0 1-.8 1.8-1.8 1.7C11.5 19.6 4.4 12.5 3.8 5.3 3.7 4.3 4.5 3.5 5.5 3.5z" />
        </svg>
      );
    case "pin":
      return (
        <svg viewBox="0 0 24 24" className={className} {...common}>
          <path d="M12 21c4-4.6 6-7.8 6-10.4A6 6 0 0 0 6 10.6C6 13.2 8 16.4 12 21z" />
          <circle cx="12" cy="10.4" r="2.2" />
        </svg>
      );
    case "clock":
      return (
        <svg viewBox="0 0 24 24" className={className} {...common}>
          <circle cx="12" cy="12" r="8" />
          <path d="M12 7.5V12l3 2" />
        </svg>
      );
    case "instagram":
      return (
        <svg viewBox="0 0 24 24" className={className} {...common}>
          <rect x="4" y="4" width="16" height="16" rx="4.5" />
          <circle cx="12" cy="12" r="3.6" />
          <circle cx="16.8" cy="7.2" r="0.9" fill={stroke} stroke="none" />
        </svg>
      );
    case "facebook":
      return (
        <svg viewBox="0 0 24 24" className={className} {...common}>
          <path d="M14.5 8.5h2.2V5.6h-2.4c-2.2 0-3.6 1.4-3.6 3.7v1.6H8.5v2.9h2.2V21h3v-7.2h2.3l.4-2.9h-2.7V9.8c0-.8.3-1.3.8-1.3z" />
        </svg>
      );
    case "pinterest":
      return (
        <svg viewBox="0 0 24 24" className={className} {...common}>
          <circle cx="12" cy="12" r="8.5" />
          <path d="M10.4 17.5 12 11.4M9.6 11c0-1.7 1.3-3 3-3 1.5 0 2.7 1 2.7 2.6 0 1.9-1.1 3.4-2.6 3.4-.8 0-1.4-.6-1.2-1.4" />
        </svg>
      );
    case "whatsapp":
      return (
        <svg viewBox="0 0 24 24" className={className} {...common}>
          <path d="M20 12a8 8 0 0 1-11.8 7L4 20l1.1-4.1A8 8 0 1 1 20 12z" />
          <path d="M9.2 9c-.3.6-.2 1.6.6 2.7.8 1.1 1.8 1.8 2.6 2 .6.2 1.3.1 1.6-.4l.3-.5-1.7-.9-.5.5c-.6-.3-1.3-1-1.6-1.7l.5-.5-.9-1.6z" />
        </svg>
      );
  }
}
