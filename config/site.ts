/**
 * CENTRAL SITE CONFIGURATION
 * ---------------------------------------------------------------------------
 * This is the single source of truth for brand name, tagline, contact details,
 * service area, and social links. Change values here and they will update
 * everywhere across the website (header, footer, metadata, structured data,
 * contact page, etc.).
 *
 * Everything marked "TODO" below is a placeholder. The business has not yet
 * supplied this information, so it must be replaced with real, verifiable
 * details before the site is used publicly. Nothing here has been invented
 * as a real business claim (no founding date, license numbers, project
 * counts, or certifications are included anywhere in the codebase).
 */

export const siteConfig = {
  /** Company name — shown in header, footer, logo, and page titles. */
  companyName: "Forge Exterior Systems",

  /** Short form used in tight spaces (mobile logo lockup, favicon alt text). */
  shortName: "Forge",

  /** Primary tagline, shown in the header area and footer. */
  tagline: "Precision in every exterior.",

  /** One- or two-sentence description used in the footer and meta tags. */
  description:
    "Professional siding, window, and commercial storefront installation for residential and commercial projects.",

  /**
   * Contact details — TODO: replace with the company's real information.
   * Until these are updated, the site treats them as placeholders and does
   * not publish location-specific SEO claims or structured data based on them.
   */
  contact: {
    phone: "(000) 000-0000", // TODO: replace with real phone number
    phoneHref: "+10000000000", // TODO: replace with tel: href (digits only, include country code)
    email: "info@forgeexteriorsystems.example", // TODO: replace with real inbox
    serviceArea: "Service area to be confirmed", // TODO: e.g. "Greater Metro Region and surrounding counties"
    address: "", // TODO: optional physical address, leave blank if not public-facing
  },

  /**
   * Set to true only once every field in `contact` above has been replaced
   * with real, verifiable information. This flag gates whether the site
   * renders LocalBusiness structured data and location-specific SEO copy,
   * so no invented business details are ever published.
   */
  contactInfoVerified: false,

  /** Social links — leave blank ("") to hide a platform from the footer. */
  social: {
    instagram: "",
    facebook: "",
    linkedin: "",
    houzz: "",
  },

  /** Primary navigation — label text is fixed per brand requirements. */
  nav: [
    { label: "HOME", href: "/" },
    { label: "SERVICES", href: "/services" },
    { label: "RESIDENTIAL PROJECTS", href: "/residential-projects" },
    { label: "COMMERCIAL PROJECTS", href: "/commercial-projects" },
    { label: "ABOUT US", href: "/about" },
    { label: "CONTACT", href: "/contact" },
  ],

  estimateCta: {
    label: "REQUEST AN ESTIMATE",
    href: "/contact",
  },

  /** Base URL used for sitemap/robots/canonical/Open Graph generation. */
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
} as const;

export type SiteConfig = typeof siteConfig;

/** Brand colors — kept here as the single source of truth; mirrored in tailwind.config.ts. */
export const brandColors = {
  charcoal: "#24292D",
  nearBlack: "#171A1C",
  offWhite: "#F5F4F0",
  white: "#FFFFFF",
  concrete: "#D9DAD7",
  secondaryGray: "#747B80",
  copper: "#A66B45",
} as const;

/** Service catalog — central list so labels stay consistent everywhere. */
export const services = [
  {
    key: "siding",
    label: "Siding Installation",
    shortLabel: "Siding",
    slug: "siding",
    description:
      "Professional siding installation for residential and commercial buildings, with careful attention to alignment, transitions, material detailing, and the finished appearance of the exterior.",
  },
  {
    key: "windows",
    label: "Window Installation",
    shortLabel: "Windows",
    slug: "windows",
    description:
      "Window installation focused on accurate fit, clean integration with the building envelope, weather protection, and a finished result that complements the architecture.",
  },
  {
    key: "storefronts",
    label: "Commercial Storefronts",
    shortLabel: "Storefronts",
    slug: "commercial-storefronts",
    description:
      "Commercial storefront installation for retail, office, and other commercial environments, with attention to clean sightlines, precise fitting, and project coordination.",
  },
] as const;

export type ServiceKey = (typeof services)[number]["key"];
