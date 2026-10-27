import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { ProjectGrid } from "@/components/projects/project-grid";
import { Button } from "@/components/ui/button";
import { getAvailableServiceFilters, getPublishedProjects } from "@/lib/projects";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Commercial Projects",
  description:
    "Explore commercial exterior installation projects, from storefronts and retail spaces to office buildings and other commercial environments.",
  alternates: { canonical: "/commercial-projects" },
};

export default function CommercialProjectsPage() {
  const projects = getPublishedProjects("commercial");
  const availableFilters = getAvailableServiceFilters("commercial");

  return (
    <>
      <section className="py-16 sm:py-24">
        <Container>
          <div className="max-w-2xl mb-14">
            <p className="label-eyebrow mb-4">COMMERCIAL PORTFOLIO</p>
            <h1 className="font-heading font-extrabold text-4xl sm:text-5xl tracking-tight text-ink">
              BUILT FOR BUSINESS. FINISHED WITH PRECISION.
            </h1>
            <p className="mt-6 text-lg text-slate leading-relaxed">
              Explore commercial exterior installation projects, from
              storefronts and retail spaces to office buildings and other
              commercial environments.
            </p>
          </div>

          <ProjectGrid
            projects={projects}
            category="commercial"
            availableFilters={availableFilters}
          />
        </Container>
      </section>

      <section className="py-20 bg-ink">
        <Container className="text-center">
          <h2 className="font-heading font-bold text-2xl sm:text-3xl text-cream">
            PLANNING A COMMERCIAL PROJECT?
          </h2>
          <p className="mt-4 text-concrete max-w-xl mx-auto">
            Tell us about the building, scope, and timeline, and our team will
            follow up to discuss next steps.
          </p>
          <div className="mt-8">
            <Button href="/contact" size="lg" variant="primary">
              DISCUSS YOUR PROJECT
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}
