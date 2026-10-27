"use client";

import { useMemo, useState } from "react";
import type { Project } from "@/lib/projects";
import { ProjectCard } from "./project-card";
import { ProjectsEmptyState } from "./empty-state";
import { cn, titleCase } from "@/lib/utils";

const SERVICE_LABELS: Record<string, string> = {
  siding: "Siding",
  windows: "Windows",
  storefronts: "Storefronts",
};

export function ProjectGrid({
  projects,
  category,
  availableFilters,
}: {
  projects: Project[];
  category: "residential" | "commercial";
  availableFilters: string[];
}) {
  const [activeFilter, setActiveFilter] = useState<string>("all");

  const filters = useMemo(() => {
    const base = [{ key: "all", label: `All ${titleCase(category)}` }];
    const serviceFilters = availableFilters.map((key) => ({
      key,
      label: SERVICE_LABELS[key] ?? titleCase(key),
    }));
    const hasFullExterior =
      availableFilters.includes("siding") && availableFilters.includes("windows");
    return [
      ...base,
      ...serviceFilters,
      ...(hasFullExterior ? [{ key: "full-exterior", label: "Full Exterior" }] : []),
    ];
  }, [availableFilters, category]);

  const filtered = useMemo(() => {
    if (activeFilter === "all") return projects;
    if (activeFilter === "full-exterior") {
      return projects.filter(
        (p) => p.services.includes("siding") && p.services.includes("windows")
      );
    }
    return projects.filter((p) => p.services.includes(activeFilter));
  }, [projects, activeFilter]);

  if (projects.length === 0) {
    return <ProjectsEmptyState category={category} />;
  }

  return (
    <div>
      {filters.length > 1 && (
        <div
          className="flex flex-wrap gap-2 mb-10"
          role="group"
          aria-label={`Filter ${category} projects`}
        >
          {filters.map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => setActiveFilter(f.key)}
              aria-pressed={activeFilter === f.key}
              className={cn(
                "px-4 py-2 text-xs font-semibold uppercase tracking-wide border transition-colors duration-250",
                activeFilter === f.key
                  ? "bg-ink text-cream border-ink"
                  : "bg-transparent text-slate border-concrete hover:border-ink hover:text-ink"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      )}

      {filtered.length === 0 ? (
        <p className="text-slate py-12 text-center">
          No projects currently match this filter.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
          {filtered.map((project, i) => (
            <ProjectCard key={project.id} project={project} priority={i < 3} />
          ))}
        </div>
      )}
    </div>
  );
}
