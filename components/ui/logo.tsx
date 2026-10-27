import Link from "next/link";
import { siteConfig } from "@/config/site";

type LogoProps = {
  /** "dark" = dark text/mark for light backgrounds. "light" = light text/mark for dark backgrounds (e.g. footer, hero overlay). */
  variant?: "dark" | "light";
  /** Render only the geometric mark, without the wordmark (tight spaces, favicon-style use). */
  iconOnly?: boolean;
  className?: string;
  /** If false, renders a static lockup (no link) — used in contexts like print/social previews. */
  asLink?: boolean;
};

/**
 * Geometric mark: an architectural window/storefront grid — an outer frame
 * divided by a vertical mullion and horizontal transom into four panes, with
 * one pane filled in the copper accent. Deliberately abstract and
 * structural (not a house/roof icon) so it reads at any size, in one color,
 * and works equally on a light background, a dark background, a work
 * vehicle, or site signage.
 */
function Mark({ variant = "dark" }: { variant?: "dark" | "light" }) {
  const stroke = variant === "light" ? "#F5F4F0" : "#171A1C";
  return (
    <svg
      viewBox="0 0 40 40"
      width="32"
      height="32"
      aria-hidden="true"
      className="flex-shrink-0"
    >
      <rect
        x="2"
        y="2"
        width="36"
        height="36"
        fill="none"
        stroke={stroke}
        strokeWidth="2.5"
      />
      <line x1="2" y1="16" x2="38" y2="16" stroke={stroke} strokeWidth="2.5" />
      <line x1="18" y1="2" x2="18" y2="38" stroke={stroke} strokeWidth="2.5" />
      <rect x="19.25" y="17.25" width="17.5" height="19.5" fill="#A66B45" />
    </svg>
  );
}

export function Logo({ variant = "dark", iconOnly = false, className, asLink = true }: LogoProps) {
  const textColor = variant === "light" ? "text-cream" : "text-ink";
  const subColor = variant === "light" ? "text-concrete" : "text-slate";

  const content = (
    <span className={`inline-flex items-center gap-3 ${className ?? ""}`}>
      <Mark variant={variant} />
      {!iconOnly && (
        <span className="flex flex-col leading-none">
          <span
            className={`font-heading font-bold text-lg sm:text-xl tracking-tight ${textColor}`}
          >
            {siteConfig.shortName.toUpperCase()}{" "}
            <span className="hidden sm:inline">EXTERIOR SYSTEMS</span>
            <span className="sm:hidden">EXT. SYSTEMS</span>
          </span>
          <span className={`text-[10px] uppercase tracking-widest2 mt-1 ${subColor}`}>
            {siteConfig.tagline}
          </span>
        </span>
      )}
    </span>
  );

  if (!asLink) return content;

  return (
    <Link href="/" aria-label={`${siteConfig.companyName} — home`} className="shrink-0">
      {content}
    </Link>
  );
}
