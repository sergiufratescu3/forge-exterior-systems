import { siteConfig } from "@/config/site";

/**
 * Renders LocalBusiness structured data — but only once the business has
 * confirmed its real contact details (siteConfig.contactInfoVerified).
 * Until then this renders nothing, so no placeholder phone/email/address
 * is ever published as structured data.
 */
export function StructuredData() {
  if (!siteConfig.contactInfoVerified) return null;

  const data = {
    "@context": "https://schema.org",
    "@type": "GeneralContractor",
    name: siteConfig.companyName,
    description: siteConfig.description,
    telephone: siteConfig.contact.phone,
    email: siteConfig.contact.email,
    areaServed: siteConfig.contact.serviceArea,
    url: siteConfig.siteUrl,
    ...(siteConfig.contact.address ? { address: siteConfig.contact.address } : {}),
  };

  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
