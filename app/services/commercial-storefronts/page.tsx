import type { Metadata } from "next";
import { ServiceTemplate } from "@/components/services/service-template";
import { demoImages } from "@/lib/demo-images";
import { getPublishedProjectsByService } from "@/lib/projects";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Commercial Storefront Installation",
  description:
    "Commercial storefront installation for retail, office, and other commercial environments, with attention to clean sightlines and precise fitting.",
  alternates: { canonical: "/services/commercial-storefronts" },
};

export default function CommercialStorefrontsServicePage() {
  const relatedProjects = getPublishedProjectsByService("storefronts", "commercial", 6);

  return (
    <ServiceTemplate
      eyebrow="SERVICE 03 — COMMERCIAL"
      title="COMMERCIAL STOREFRONT INSTALLATION"
      heroImage={demoImages.storefrontService}
      intro="Commercial storefront installation for retail, office, and other commercial environments, with attention to clean sightlines, precise fitting, and project coordination."
      secondaryImage={demoImages.commercialFacade}
      relatedHeading="RELATED COMMERCIAL PROJECTS"
      relatedProjects={relatedProjects}
      blocks={[
        {
          heading: "OVERVIEW",
          body: "Commercial storefront installation is a distinct service from residential window work. Storefront systems typically involve larger spans, different framing and anchoring requirements, and a greater emphasis on how the finished installation reads from the street and within the tenant space.",
        },
        {
          heading: "RELEVANT APPLICATIONS",
          body: "This service applies to retail storefronts, office entries, and other commercial environments where glazed systems are part of the building's public-facing exterior, including tenant improvement and new commercial construction projects.",
        },
        {
          heading: "CLEAN ARCHITECTURAL LINES",
          body: "Storefront systems are highly visible, and sightlines, reveal widths, and alignment between framing members are central to how finished and professional the installation appears. We approach layout and installation with that visibility in mind.",
        },
        {
          heading: "INSTALLATION PRECISION AND COORDINATION",
          body: "Commercial storefront projects often involve coordination with general contractors, property managers, or other trades on site. We coordinate installation sequencing and project requirements accordingly so the work fits into the broader project timeline.",
        },
      ]}
      ctaLabel="DISCUSS YOUR PROJECT"
      ctaNote="Tell us about your commercial storefront project and we will follow up to discuss scope and coordination."
    />
  );
}
