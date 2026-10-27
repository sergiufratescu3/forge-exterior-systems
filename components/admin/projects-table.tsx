"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { Project } from "@/lib/projects";
import { cn, titleCase } from "@/lib/utils";

export function ProjectsTable({ initialProjects }: { initialProjects: Project[] }) {
  const router = useRouter();
  const [projects, setProjects] = useState(initialProjects);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "residential" | "commercial">("all");

  async function toggleStatus(project: Project) {
    setBusyId(project.id);
    const nextStatus = project.status === "published" ? "draft" : "published";
    try {
      const res = await fetch(`/api/admin/projects/${project.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
      const json = await res.json();
      if (res.ok && json.ok) {
        setProjects((prev) =>
          prev.map((p) => (p.id === project.id ? { ...p, status: nextStatus } : p))
        );
      } else {
        alert(json.message || "Could not update project status.");
      }
    } finally {
      setBusyId(null);
    }
  }

  async function deleteProject(project: Project) {
    const confirmed = window.confirm(
      `Delete "${project.title}"? This permanently removes the project and its photographs. This cannot be undone.`
    );
    if (!confirmed) return;

    setBusyId(project.id);
    try {
      const res = await fetch(`/api/admin/projects/${project.id}`, { method: "DELETE" });
      const json = await res.json();
      if (res.ok && json.ok) {
        setProjects((prev) => prev.filter((p) => p.id !== project.id));
      } else {
        alert(json.message || "Could not delete project.");
      }
    } finally {
      setBusyId(null);
      router.refresh();
    }
  }

  const visible = projects.filter((p) => filter === "all" || p.category === filter);

  return (
    <div>
      <div className="flex gap-2 mb-6" role="group" aria-label="Filter by category">
        {(["all", "residential", "commercial"] as const).map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setFilter(key)}
            className={cn(
              "px-3 py-1.5 text-xs font-semibold uppercase tracking-wide border",
              filter === key
                ? "bg-ink text-cream border-ink"
                : "bg-white text-slate border-concrete hover:border-ink"
            )}
          >
            {key === "all" ? "All" : titleCase(key)}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <p className="text-slate py-10">No projects in this category yet.</p>
      ) : (
        <div className="overflow-x-auto border border-concrete bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-concrete text-left text-xs uppercase tracking-wide text-slate">
                <th className="p-4">Cover</th>
                <th className="p-4">Title</th>
                <th className="p-4">Category</th>
                <th className="p-4">Status</th>
                <th className="p-4">Updated</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((project) => (
                <tr key={project.id} className="border-b border-concrete last:border-0">
                  <td className="p-4">
                    <div className="relative w-16 h-12 bg-concrete">
                      {project.coverImage && (
                        <Image
                          src={project.coverImage.url}
                          alt=""
                          fill
                          sizes="64px"
                          className="object-cover"
                        />
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <Link
                      href={`/admin/projects/${project.id}/edit`}
                      className="font-semibold text-ink hover:text-copper"
                    >
                      {project.title}
                    </Link>
                    <p className="text-xs text-slate">{project.location}</p>
                  </td>
                  <td className="p-4 text-slate">{titleCase(project.category)}</td>
                  <td className="p-4">
                    <span
                      className={cn(
                        "px-2 py-1 text-xs uppercase tracking-wide",
                        project.status === "published"
                          ? "bg-ink text-cream"
                          : "bg-concrete text-slate"
                      )}
                    >
                      {project.status}
                    </span>
                  </td>
                  <td className="p-4 text-slate text-xs">
                    {new Date(project.updated_at).toLocaleDateString()}
                  </td>
                  <td className="p-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-4">
                      {project.status === "published" && (
                        <Link
                          href={`/projects/${project.slug}`}
                          target="_blank"
                          className="text-xs font-semibold text-slate hover:text-ink"
                        >
                          View
                        </Link>
                      )}
                      <button
                        type="button"
                        disabled={busyId === project.id}
                        onClick={() => toggleStatus(project)}
                        className="text-xs font-semibold text-ink hover:text-copper disabled:opacity-50"
                      >
                        {project.status === "published" ? "Unpublish" : "Publish"}
                      </button>
                      <Link
                        href={`/admin/projects/${project.id}/edit`}
                        className="text-xs font-semibold text-ink hover:text-copper"
                      >
                        Edit
                      </Link>
                      <button
                        type="button"
                        disabled={busyId === project.id}
                        onClick={() => deleteProject(project)}
                        className="text-xs font-semibold text-red-700 hover:text-red-900 disabled:opacity-50"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
