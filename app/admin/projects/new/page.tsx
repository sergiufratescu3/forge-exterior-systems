import type { Metadata } from "next";
import { ProjectForm } from "@/components/admin/project-form";

export const metadata: Metadata = {
  title: "New Project",
  robots: { index: false, follow: false },
};

export default function NewProjectPage() {
  return (
    <div>
      <h1 className="font-heading font-bold text-2xl text-ink mb-8">New Project</h1>
      <ProjectForm mode="create" />
    </div>
  );
}
