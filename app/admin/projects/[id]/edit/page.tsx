import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProjectForm } from "@/components/admin/project-form";
import { getProjectById } from "@/lib/projects";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Edit Project",
  robots: { index: false, follow: false },
};

export default function EditProjectPage({ params }: { params: { id: string } }) {
  const project = getProjectById(params.id);
  if (!project) notFound();

  return (
    <div>
      <h1 className="font-heading font-bold text-2xl text-ink mb-8">Edit Project</h1>
      <ProjectForm mode="edit" project={project} />
    </div>
  );
}
