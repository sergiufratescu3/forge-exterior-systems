"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import type { Project, ProjectImage } from "@/lib/projects";
import { cn } from "@/lib/utils";

export function ImageUploader({
  projectId,
  initialImages,
  initialCoverId,
}: {
  projectId: string;
  initialImages: ProjectImage[];
  initialCoverId?: string | null;
}) {
  const [images, setImages] = useState(initialImages);
  const [coverId, setCoverId] = useState<string | null | undefined>(initialCoverId);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  function applyProjectResult(project: Project) {
    setImages(project.images);
    setCoverId(project.cover_image_id);
  }

  async function handleUpload(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;
    setError("");
    setUploading(true);

    const formData = new FormData();
    Array.from(fileList).forEach((file) => formData.append("files", file));

    try {
      const res = await fetch(`/api/admin/projects/${projectId}/images`, {
        method: "POST",
        body: formData,
      });
      const json = await res.json();
      if (res.ok && json.ok) {
        applyProjectResult(json.project);
      } else {
        setError(json.message || "Upload failed.");
      }
    } catch {
      setError("We couldn't reach the server. Please try again.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function setCover(imageId: string) {
    const res = await fetch(`/api/admin/projects/${projectId}/images/${imageId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ setCover: true }),
    });
    const json = await res.json();
    if (res.ok && json.ok) applyProjectResult(json.project);
  }

  async function deleteImage(imageId: string) {
    const confirmed = window.confirm("Remove this photograph? This cannot be undone.");
    if (!confirmed) return;

    const res = await fetch(`/api/admin/projects/${projectId}/images/${imageId}`, {
      method: "DELETE",
    });
    const json = await res.json();
    if (res.ok && json.ok) applyProjectResult(json.project);
    else setError(json.message || "Could not remove the photograph.");
  }

  async function persistOrder(ordered: ProjectImage[]) {
    setImages(ordered);
    await fetch(`/api/admin/projects/${projectId}/images`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderedImageIds: ordered.map((i) => i.id) }),
    });
  }

  function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= images.length) return;
    const next = [...images];
    [next[index], next[target]] = [next[target], next[index]];
    persistOrder(next);
  }

  return (
    <div>
      <div className="mb-6">
        <label className="inline-flex items-center gap-3 border border-ink bg-ink text-cream px-5 py-3 text-xs font-semibold uppercase tracking-wide cursor-pointer hover:bg-charcoal">
          {uploading ? "UPLOADING…" : "UPLOAD PHOTOGRAPHS"}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            disabled={uploading}
            onChange={(e) => handleUpload(e.target.files)}
          />
        </label>
        <p className="mt-2 text-xs text-slate">
          JPEG, PNG, or WebP — up to 8MB each. Images are optimized automatically on upload.
        </p>
        {error && (
          <p className="mt-2 text-sm text-red-700" role="alert">
            {error}
          </p>
        )}
      </div>

      {images.length === 0 ? (
        <p className="text-sm text-slate border border-dashed border-concrete py-8 text-center">
          No photographs uploaded yet.
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((img, index) => {
            const isCover = img.id === coverId;
            return (
              <div
                key={img.id}
                className={cn(
                  "relative border bg-white",
                  isCover ? "border-copper ring-1 ring-copper" : "border-concrete"
                )}
              >
                <div className="relative aspect-[4/3]">
                  <Image src={img.url} alt={img.alt_text || ""} fill sizes="200px" className="object-cover" />
                  {isCover && (
                    <span className="absolute top-2 left-2 bg-copper text-cream text-[10px] uppercase tracking-wide px-2 py-1">
                      Cover
                    </span>
                  )}
                </div>
                <div className="p-2 flex items-center justify-between gap-1 flex-wrap">
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => move(index, -1)}
                      disabled={index === 0}
                      aria-label="Move earlier"
                      className="h-7 w-7 text-xs border border-concrete hover:border-ink disabled:opacity-30"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      onClick={() => move(index, 1)}
                      disabled={index === images.length - 1}
                      aria-label="Move later"
                      className="h-7 w-7 text-xs border border-concrete hover:border-ink disabled:opacity-30"
                    >
                      ↓
                    </button>
                  </div>
                  <div className="flex gap-2">
                    {!isCover && (
                      <button
                        type="button"
                        onClick={() => setCover(img.id)}
                        className="text-[11px] font-semibold text-ink hover:text-copper"
                      >
                        Set Cover
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => deleteImage(img.id)}
                      className="text-[11px] font-semibold text-red-700 hover:text-red-900"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
