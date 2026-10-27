import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  light = false,
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  light?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className
      )}
    >
      {eyebrow && (
        <p className={cn("label-eyebrow mb-3", light && "text-copper")}>{eyebrow}</p>
      )}
      <h2
        className={cn(
          "font-heading font-bold text-3xl sm:text-4xl leading-[1.1] tracking-tight",
          light ? "text-cream" : "text-ink"
        )}
      >
        {title}
      </h2>
      {description && (
        <p className={cn("mt-4 text-base sm:text-lg leading-relaxed", light ? "text-concrete" : "text-slate")}>
          {description}
        </p>
      )}
    </div>
  );
}
