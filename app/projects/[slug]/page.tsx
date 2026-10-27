import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { ProjectGallery } from "@/components/projects/project-gallery";
import { getAdjacentProjects, getProjectBySlug } from "@/lib/projects";
import { getCurrentAdmin } from "@/lib/auth";
import { formatDate, titleCase } from "@/lib/utils";

export const dynamic = "force-dynamic";

async function loadProject(slug: string, previewRequested: boolean) {
  if (previewRequested) {
    const admin = await getCurrentAdmin();
    if (admin) {
      return getProjectBySlug(slug, { includeDrafts: true });
    }
  }
  return getProjectBySlug(slug);
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const project = await loadProject(params.slug, false);
  if (!project) return { title: "Project Not Found" };
  return {
    title: project.title,
    description:
      project.description.slice(0, 160) ||
      `${titleCase(project.category)} exterior installation project${
        project.location ? ` in ${project.location}` : ""
      }.`,
    alternates: { canonical: `/projects/${project.slug}` },
  };
}

export default async function ProjectDetailPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { preview?: string };
}) {
  const previewRequested = searchParams?.preview === "1";
  const project = await loadProject(params.slug, previewRequested);

  if (!project) {
    notFound();
  }

  const isDraftPreview = project.status === "draft";
  const { prev, next } = getAdjacentProjects(project);
  const categoryHref =
    project.category === "residential" ? "/residential-projects" : "/commercial-projects";
  const categoryLabel =
    project.category === "residential" ? "Residential Projects" : "Commercial Projects";

  return (
    <article>
      {isDraftPreview && (
        <div className="bg-copper text-cream text-sm text-center py-3 px-4">
          Draft preview — this project is not published and is only visible to signed-in administrators.
        </div>
      )}

      <section className="py-14 sm:py-20 border-b border-concrete">
        <Container>
          <Link
            href={categoryHref}
            className="text-xs font-semibold uppercase tracking-wide text-slate hover:text-ink"
          >
            ← {categoryLabel}
          </Link>

          <div className="mt-6 flex flex-wrap items-start justify-between gap-6">
            <div>
              <h1 className="font-heading font-extrabold text-3xl sm:text-5xl tracking-tight text-ink">
                {project.title}
              </h1>
              <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate">
                {project.location && <span>{project.location}</span>}
                {project.project_type && <span>{project.project_type}</span>}
                {project.completion_date && <span>{formatDate(project.completion_date)}</span>}
              </div>
            </div>

            {project.services.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {project.services.map((s) => (
                  <span
                    key={s}
                    className="text-[11px] uppercase tracking-wide text-slate border border-concrete px-3 py-1.5"
                  >
                    {titleCase(s)}
                  </span>
                ))}
              </div>
            )}
          </div>

          {project.description && (
            <p className="mt-8 text-lg text-ink leading-relaxed max-w-prose2">
              {project.description}
            </p>
          )}
        </Container>
      </section>

      <section className="py-14 sm:py-20">
        <Container>
          <ProjectGallery images={project.images} projectTitle={project.title} />
        </Container>
      </section>

      <section className="py-14 border-t border-concrete">
        <Container className="flex flex-col sm:flex-row items-center justify-between gap-8">
          <div className="flex gap-8 text-sm">
            {prev ? (
              <Link href={`/projects/${prev.slug}`} className="text-slate hover:text-ink">
                ← {prev.title}
              </Link>
            ) : (
              <span />
            )}
            {next && (
              <Link href={`/projects/${next.slug}`} className="text-slate hover:text-ink">
                {next.title} →
              </Link>
            )}
          </div>
          <Button href="/contact" variant="primary">
            REQUEST AN ESTIMATE
          </Button>
        </Container>
      </section>
    </article>
  );
}
