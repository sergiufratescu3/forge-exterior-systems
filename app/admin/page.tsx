import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ProjectsTable } from "@/components/admin/projects-table";
import { getAllProjectsAdmin } from "@/lib/projects";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  robots: { index: false, follow: false },
};

export default function AdminDashboardPage() {
  const projects = getAllProjectsAdmin();
  const published = projects.filter((p) => p.status === "published").length;
  const drafts = projects.filter((p) => p.status === "draft").length;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="font-heading font-bold text-2xl text-ink">Projects</h1>
          <p className="text-sm text-slate mt-1">
            {projects.length} total — {published} published, {drafts} draft
          </p>
        </div>
        <Button href="/admin/projects/new" variant="primary">
          + NEW PROJECT
        </Button>
      </div>

      {projects.length === 0 ? (
        <div className="border border-dashed border-concrete bg-white py-16 text-center">
          <p className="text-slate mb-4">No projects yet.</p>
          <Link href="/admin/projects/new" className="font-semibold text-ink hover:text-copper underline">
            Create your first project
          </Link>
        </div>
      ) : (
        <ProjectsTable initialProjects={projects} />
      )}
    </div>
  );
}
