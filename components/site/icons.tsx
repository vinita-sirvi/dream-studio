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
  | "heart";

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
  }
}
