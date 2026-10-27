"use client";

import { useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ImageUploader } from "@/components/admin/image-uploader";
import { projectInputSchema, type ProjectInput } from "@/lib/validation";
import { toSlug, cn } from "@/lib/utils";
import type { Project } from "@/lib/projects";

const SERVICE_OPTIONS = [
  { key: "siding", label: "Siding" },
  { key: "windows", label: "Windows" },
  { key: "storefronts", label: "Commercial Storefronts" },
] as const;

const inputClass =
  "w-full border border-concrete bg-white px-4 py-3 text-ink focus:outline-none focus:border-ink transition-colors duration-250";

type FieldErrors = Partial<Record<keyof ProjectInput, string>>;

export function ProjectForm({ mode, project }: { mode: "create" | "edit"; project?: Project }) {
  const router = useRouter();
  const slugTouched = useRef(Boolean(project));

  const [title, setTitle] = useState(project?.title ?? "");
  const [slug, setSlug] = useState(project?.slug ?? "");
  const [category, setCategory] = useState<"residential" | "commercial">(
    project?.category ?? "residential"
  );
  const [projectType, setProjectType] = useState(project?.project_type ?? "");
  const [location, setLocation] = useState(project?.location ?? "");
  const [servicesSelected, setServicesSelected] = useState<string[]>(project?.services ?? []);
  const [description, setDescription] = useState(project?.description ?? "");
  const [completionDate, setCompletionDate] = useState(project?.completion_date ?? "");
  const [featured, setFeatured] = useState(project?.featured ?? false);
  const [status, setStatus] = useState<"draft" | "published">(project?.status ?? "draft");

  const [errors, setErrors] = useState<FieldErrors>({});
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [saveError, setSaveError] = useState("");

  function handleTitleChange(value: string) {
    setTitle(value);
    if (!slugTouched.current) {
      setSlug(toSlug(value));
    }
  }

  function toggleService(key: string) {
    setServicesSelected((prev) =>
      prev.includes(key) ? prev.filter((s) => s !== key) : [...prev, key]
    );
  }

  async function handleSubmit(e: FormEvent, submitStatus?: "draft" | "published") {
    e.preventDefault();
    const finalStatus = submitStatus ?? status;

    const payload = {
      title,
      slug,
      category,
      projectType,
      location,
      services: servicesSelected,
      description,
      completionDate,
      featured,
      status: finalStatus,
    };

    const parsed = projectInputSchema.safeParse(payload);
    if (!parsed.success) {
      const fieldErrors: FieldErrors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof ProjectInput;
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      setSaveError("Please correct the highlighted fields.");
      return;
    }

    setErrors({});
    setSaving(true);
    setSaveError("");
    setSaveMessage("");
    setStatus(finalStatus);

    try {
      const url = mode === "create" ? "/api/admin/projects" : `/api/admin/projects/${project!.id}`;
      const method = mode === "create" ? "POST" : "PATCH";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const json = await res.json();

      if (!res.ok || !json.ok) {
        setSaveError(json.message || "Could not save the project.");
        if (json.fieldErrors) setErrors(json.fieldErrors);
        return;
      }

      if (mode === "create") {
        router.push(`/admin/projects/${json.project.id}/edit`);
        return;
      }

      setSaveMessage("Project saved.");
      router.refresh();
    } catch {
      setSaveError("We couldn't reach the server. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={(e) => handleSubmit(e)} className="space-y-10">
      <div className="bg-white border border-concrete p-6 sm:p-8 space-y-6">
        <h2 className="font-heading font-bold text-lg text-ink">Project Details</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-ink mb-2">
              Title <span className="text-copper">*</span>
            </label>
            <input
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className={inputClass}
              required
            />
            {errors.title && <p className="mt-1.5 text-sm text-red-700">{errors.title}</p>}
          </div>
          <div>
            <label className="block text-sm font-semibold text-ink mb-2">
              URL Slug <span className="text-copper">*</span>
            </label>
            <input
              value={slug}
              onChange={(e) => {
                slugTouched.current = true;
                setSlug(toSlug(e.target.value));
              }}
              className={inputClass}
              required
            />
            <p className="mt-1.5 text-xs text-slate">/projects/{slug || "project-slug"}</p>
            {errors.slug && <p className="mt-1.5 text-sm text-red-700">{errors.slug}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-ink mb-2">
              Category <span className="text-copper">*</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as "residential" | "commercial")}
              className={inputClass}
            >
              <option value="residential">Residential</option>
              <option value="commercial">Commercial</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-ink mb-2">Project / Building Type</label>
            <input
              value={projectType}
              onChange={(e) => setProjectType(e.target.value)}
              placeholder="e.g. Single-Family Home, Retail Storefront"
              className={inputClass}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-ink mb-2">Location</label>
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Riverside Heights"
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-ink mb-2">Completion Date</label>
            <input
              type="month"
              value={completionDate}
              onChange={(e) => setCompletionDate(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-ink mb-2">
            Services Performed <span className="text-copper">*</span>
          </label>
          <div className="flex flex-wrap gap-4">
            {SERVICE_OPTIONS.map((opt) => (
              <label key={opt.key} className="flex items-center gap-2 text-sm text-ink">
                <input
                  type="checkbox"
                  checked={servicesSelected.includes(opt.key)}
                  onChange={() => toggleService(opt.key)}
                  className="h-4 w-4 accent-copper"
                />
                {opt.label}
              </label>
            ))}
          </div>
          {errors.services && <p className="mt-1.5 text-sm text-red-700">{errors.services}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-ink mb-2">Project Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            className={cn(inputClass, "resize-y")}
          />
        </div>

        <label className="flex items-center gap-2 text-sm text-ink">
          <input
            type="checkbox"
            checked={featured}
            onChange={(e) => setFeatured(e.target.checked)}
            className="h-4 w-4 accent-copper"
          />
          Feature this project in the homepage preview
        </label>
      </div>

      {mode === "edit" && project && (
        <div className="bg-white border border-concrete p-6 sm:p-8">
          <h2 className="font-heading font-bold text-lg text-ink mb-1">Photographs</h2>
          <p className="text-sm text-slate mb-6">
            Upload photographs, choose a cover image, and reorder the gallery.
          </p>
          <ImageUploader
            projectId={project.id}
            initialImages={project.images}
            initialCoverId={project.cover_image_id}
          />
        </div>
      )}

      {mode === "create" && (
        <p className="text-sm text-slate">
          Save the project first to unlock photograph uploads.
        </p>
      )}

      <div className="sticky bottom-0 bg-cream/95 backdrop-blur border-t border-concrete py-5 -mx-4 px-4 sm:-mx-6 sm:px-6 flex flex-wrap items-center gap-4">
        <Button
          type="submit"
          variant="secondary"
          disabled={saving}
          onClick={(e) => handleSubmit(e, "draft")}
        >
          {saving ? "SAVING…" : "SAVE AS DRAFT"}
        </Button>
        <Button
          type="submit"
          variant="primary"
          disabled={saving}
          onClick={(e) => handleSubmit(e, "published")}
        >
          {saving ? "SAVING…" : "PUBLISH"}
        </Button>

        {mode === "edit" && project && (
          <a
            href={`/projects/${project.slug}?preview=1`}
            target="_blank"
            rel="noreferrer"
            className="text-sm font-semibold text-ink hover:text-copper underline underline-offset-4"
          >
            Preview Project ↗
          </a>
        )}

        {saveMessage && <span className="text-sm text-ink">{saveMessage}</span>}
        {saveError && (
          <span className="text-sm text-red-700" role="alert">
            {saveError}
          </span>
        )}
      </div>
    </form>
  );
}
