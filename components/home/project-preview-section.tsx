import type { Project } from "@/lib/projects";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";
import { ProjectCard } from "@/components/projects/project-card";
import { ProjectsEmptyState } from "@/components/projects/empty-state";

export function ProjectPreviewSection({
  id,
  eyebrow,
  title,
  description,
  projects,
  category,
  viewAllHref,
  viewAllLabel,
  tone = "light",
}: {
  id?: string;
  eyebrow: string;
  title: string;
  description: string;
  projects: Project[];
  category: "residential" | "commercial";
  viewAllHref: string;
  viewAllLabel: string;
  tone?: "light" | "dark";
}) {
  return (
    <section
      id={id}
      className={tone === "dark" ? "py-20 sm:py-28 bg-ink" : "py-20 sm:py-28 bg-white"}
    >
      <Container>
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-8 mb-14">
          <SectionHeading
            eyebrow={eyebrow}
            title={title}
            description={description}
            light={tone === "dark"}
          />
          {projects.length > 0 && (
            <Button
              href={viewAllHref}
              variant={tone === "dark" ? "outline-light" : "secondary"}
              className="shrink-0 self-start sm:self-auto"
            >
              {viewAllLabel}
            </Button>
          )}
        </div>

        {projects.length === 0 ? (
          <ProjectsEmptyState category={category} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}

        {projects.length > 0 && (
          <div className="mt-12 sm:hidden">
            <Button href={viewAllHref} variant={tone === "dark" ? "outline-light" : "secondary"} className="w-full">
              {viewAllLabel}
            </Button>
          </div>
        )}
      </Container>
    </section>
  );
}
