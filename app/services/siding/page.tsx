import type { Metadata } from "next";
import { ServiceTemplate } from "@/components/services/service-template";
import { demoImages } from "@/lib/demo-images";
import { getPublishedProjectsByService } from "@/lib/projects";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Siding Installation",
  description:
    "Professional siding installation for residential and commercial buildings, with attention to alignment, transitions, and finished appearance.",
  alternates: { canonical: "/services/siding" },
};

export default function SidingServicePage() {
  const relatedProjects = getPublishedProjectsByService("siding", undefined, 6);

  return (
    <ServiceTemplate
      eyebrow="SERVICE 01"
      title="SIDING INSTALLATION"
      heroImage={demoImages.sidingService}
      intro="Professional siding installation for residential and commercial buildings, with careful attention to alignment, transitions, material detailing, and the finished appearance of the exterior."
      secondaryImage={demoImages.companyIntro}
      relatedHeading="RELATED SIDING PROJECTS"
      relatedProjects={relatedProjects}
      blocks={[
        {
          heading: "OVERVIEW",
          body: "Siding is one of the most visible elements of a building's exterior, and small inconsistencies in alignment or spacing are easy to notice once installed. Our approach focuses on accurate layout, consistent reveals, and a finished surface that reads as clean and intentional from every angle.",
        },
        {
          heading: "RESIDENTIAL AND COMMERCIAL APPLICATIONS",
          body: "Siding installation is suited to a range of project types, from single-family homes and custom residential builds to commercial buildings where exterior cladding is part of a larger facade system. Each application has its own layout and detailing requirements, which we account for during planning.",
        },
        {
          heading: "TRANSITIONS AND DETAILING",
          body: "Corners, trim lines, window and door surrounds, and material transitions are where exterior work is most visible up close. We pay particular attention to how siding meets these transition points so the finished result looks deliberate and well-resolved, not improvised.",
        },
        {
          heading: "MATERIAL AND FINISH CONSIDERATIONS",
          body: "Material choice affects layout, fastening, and detailing. We work with the siding materials and finishes specified for each project and install them according to the manufacturer's intended application and the project's design requirements.",
        },
      ]}
      ctaNote="Share your project details and we will follow up to discuss scope and next steps."
    />
  );
}
