import type { Metadata } from "next";
import { Hero } from "@/components/home/hero";
import { Intro } from "@/components/home/intro";
import { ServicesSection } from "@/components/home/services-section";
import { ProjectPreviewSection } from "@/components/home/project-preview-section";
import { WhyChooseUs } from "@/components/home/why-choose-us";
import { ProcessSection } from "@/components/home/process-section";
import { FinalCta } from "@/components/home/final-cta";
import { getFeaturedProjects } from "@/lib/projects";

// Homepage project previews reflect the live database, so render on request.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function HomePage() {
  const residentialProjects = getFeaturedProjects("residential", 3);
  const commercialProjects = getFeaturedProjects("commercial", 3);

  return (
    <>
      <Hero />
      <Intro />
      <ServicesSection />

      <ProjectPreviewSection
        id="projects"
        eyebrow="PORTFOLIO"
        title="RESIDENTIAL PROJECTS"
        description="A closer look at completed exterior work, architectural details, and residential transformations."
        projects={residentialProjects}
        category="residential"
        viewAllHref="/residential-projects"
        viewAllLabel="VIEW ALL RESIDENTIAL PROJECTS"
        tone="light"
      />

      <ProjectPreviewSection
        eyebrow="PORTFOLIO"
        title="COMMERCIAL PROJECTS"
        description="Exterior installation for commercial spaces, storefronts, and buildings where precision and presentation matter."
        projects={commercialProjects}
        category="commercial"
        viewAllHref="/commercial-projects"
        viewAllLabel="VIEW ALL COMMERCIAL PROJECTS"
        tone="dark"
      />

      <WhyChooseUs />
      <ProcessSection />
      <FinalCta />
    </>
  );
}
