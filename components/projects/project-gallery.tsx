"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import type { ProjectImage } from "@/lib/projects";

export function ProjectGallery({
  images,
  projectTitle,
}: {
  images: ProjectImage[];
  projectTitle: string;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const close = useCallback(() => setOpenIndex(null), []);
  const showPrev = useCallback(
    () => setOpenIndex((i) => (i === null ? null : (i - 1 + images.length) % images.length)),
    [images.length]
  );
  const showNext = useCallback(
    () => setOpenIndex((i) => (i === null ? null : (i + 1) % images.length)),
    [images.length]
  );

  useEffect(() => {
    if (openIndex === null) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") showPrev();
      if (e.key === "ArrowRight") showNext();
    }
    window.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [openIndex, close, showPrev, showNext]);

  if (images.length === 0) {
    return (
      <div className="border border-dashed border-concrete bg-cream/60 py-16 text-center text-slate">
        No additional photographs have been added to this project yet.
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {images.map((img, i) => (
          <button
            key={img.id}
            type="button"
            onClick={() => setOpenIndex(i)}
            className="relative aspect-[4/3] overflow-hidden bg-concrete focus-visible:outline-none group"
            aria-label={`Open photograph ${i + 1} of ${images.length} for ${projectTitle}`}
          >
            <Image
              src={img.url}
              alt={img.alt_text || `${projectTitle} — photograph ${i + 1}`}
              fill
              sizes="(min-width: 640px) 33vw, 50vw"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
          </button>
        ))}
      </div>

      {openIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${projectTitle} photograph ${openIndex + 1} of ${images.length}`}
          className="fixed inset-0 z-[100] bg-ink/95 flex items-center justify-center p-4 sm:p-10"
        >
          <button
            type="button"
            onClick={close}
            aria-label="Close gallery"
            className="absolute top-5 right-5 text-cream h-11 w-11 flex items-center justify-center"
          >
            <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true">
              <line x1="5" y1="5" x2="21" y2="21" stroke="currentColor" strokeWidth="2" />
              <line x1="21" y1="5" x2="5" y2="21" stroke="currentColor" strokeWidth="2" />
            </svg>
          </button>

          {images.length > 1 && (
            <button
              type="button"
              onClick={showPrev}
              aria-label="Previous photograph"
              className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 text-cream h-12 w-12 flex items-center justify-center"
            >
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
                <path d="M17 6 L10 14 L17 22" stroke="currentColor" strokeWidth="2" fill="none" />
              </svg>
            </button>
          )}

          <div className="relative w-full h-full max-w-5xl">
            <Image
              src={images[openIndex].url}
              alt={images[openIndex].alt_text || `${projectTitle} — photograph ${openIndex + 1}`}
              fill
              sizes="100vw"
              className="object-contain"
              priority
            />
          </div>

          {images.length > 1 && (
            <button
              type="button"
              onClick={showNext}
              aria-label="Next photograph"
              className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 text-cream h-12 w-12 flex items-center justify-center"
            >
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
                <path d="M11 6 L18 14 L11 22" stroke="currentColor" strokeWidth="2" fill="none" />
              </svg>
            </button>
          )}

          <p className="absolute bottom-5 left-1/2 -translate-x-1/2 text-xs text-concrete tracking-wide">
            {openIndex + 1} / {images.length}
          </p>
        </div>
      )}
    </>
  );
}
