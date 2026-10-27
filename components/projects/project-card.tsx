import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/lib/projects";
import { titleCase } from "@/lib/utils";

export function ProjectCard({
  project,
  priority = false,
  aspect = "landscape",
}: {
  project: Project;
  priority?: boolean;
  aspect?: "landscape" | "portrait" | "square";
}) {
  const aspectClass =
    aspect === "portrait" ? "aspect-[3/4]" : aspect === "square" ? "aspect-square" : "aspect-[4/3]";

  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group block focus-visible:outline-none"
    >
      <div className={`relative overflow-hidden bg-concrete ${aspectClass}`}>
        {project.coverImage ? (
          <Image
            src={project.coverImage.url}
            alt={project.coverImage.alt_text || project.title}
            fill
            priority={priority}
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-slate text-sm">
            No image yet
          </div>
        )}
        <div className="absolute inset-0 border border-ink/0 group-hover:border-copper transition-colors duration-250" />
      </div>
      <div className="mt-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="font-heading font-semibold text-lg text-ink group-hover:text-copper transition-colors duration-250">
            {project.title}
          </h3>
          {project.location && (
            <p className="text-sm text-slate mt-1">{project.location}</p>
          )}
        </div>
        {project.services.length > 0 && (
          <span className="shrink-0 text-[11px] uppercase tracking-wide text-slate border border-concrete px-2 py-1">
            {titleCase(project.services[0])}
          </span>
        )}
      </div>
    </Link>
  );
}
