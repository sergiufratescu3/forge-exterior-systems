import type { Metadata } from "next";
import { ServiceTemplate } from "@/components/services/service-template";
import { demoImages } from "@/lib/demo-images";
import { getPublishedProjectsByService } from "@/lib/projects";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Window Installation",
  description:
    "Window installation focused on accurate fit, clean integration with the building envelope, and weather protection for residential and commercial projects.",
  alternates: { canonical: "/services/windows" },
};

export default function WindowsServicePage() {
  const relatedProjects = getPublishedProjectsByService("windows", undefined, 6);

  return (
    <ServiceTemplate
      eyebrow="SERVICE 02"
      title="WINDOW INSTALLATION"
      heroImage={demoImages.windowsService}
      intro="Window installation focused on accurate fit, clean integration with the building envelope, weather protection, and a finished result that complements the architecture."
      secondaryImage={demoImages.aboutDetail}
      relatedHeading="RELATED WINDOW PROJECTS"
      relatedProjects={relatedProjects}
      blocks={[
        {
          heading: "OVERVIEW",
          body: "Window installation is about more than setting a unit into an opening — it requires accurate measurement, careful fit, and attention to how the window integrates with the surrounding wall assembly so the finished opening performs and looks the way it should.",
        },
        {
          heading: "RESIDENTIAL AND COMMERCIAL APPLICATIONS",
          body: "We install windows across residential projects, including new construction and replacement work, as well as commercial buildings where window openings are part of a broader exterior system. Each context has different coordination and sequencing needs.",
        },
        {
          heading: "INSTALLATION DETAIL CONSIDERATIONS",
          body: "Flashing, shimming, air and water sealing, and trim-out are handled with attention to manufacturer installation guidance and the conditions of each opening, so the finished window sits square, operates properly, and integrates cleanly with the surrounding exterior finish.",
        },
        {
          heading: "WEATHER PROTECTION",
          body: "Proper sealing and flashing at the window opening are treated as a core part of the installation, not an afterthought, with the goal of a weather-tight integration between the window unit and the building envelope.",
        },
      ]}
      ctaNote="Share your project details and we will follow up to discuss scope and next steps."
    />
  );
}
