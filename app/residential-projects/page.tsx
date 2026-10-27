import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { ProjectGrid } from "@/components/projects/project-grid";
import { getAvailableServiceFilters, getPublishedProjects } from "@/lib/projects";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Residential Projects",
  description:
    "Explore residential exterior projects featuring siding, windows, and installation details designed to complement each home's architecture.",
  alternates: { canonical: "/residential-projects" },
};

export default function ResidentialProjectsPage() {
  const projects = getPublishedProjects("residential");
  const availableFilters = getAvailableServiceFilters("residential");

  return (
    <section className="py-16 sm:py-24">
      <Container>
        <div className="max-w-2xl mb-14">
          <p className="label-eyebrow mb-4">RESIDENTIAL PORTFOLIO</p>
          <h1 className="font-heading font-extrabold text-4xl sm:text-5xl tracking-tight text-ink">
            CRAFTED FOR THE WAY WE LIVE.
          </h1>
          <p className="mt-6 text-lg text-slate leading-relaxed">
            Explore residential exterior projects featuring siding, windows,
            and installation details designed to complement each home&apos;s
            architecture.
          </p>
        </div>

        <ProjectGrid
          projects={projects}
          category="residential"
          availableFilters={availableFilters}
        />
      </Container>
    </section>
  );
}
