import Image from "next/image";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";
import { ProjectCard } from "@/components/projects/project-card";
import type { Project } from "@/lib/projects";

export type ServiceContentBlock = {
  heading: string;
  body: string;
};

export function ServiceTemplate({
  eyebrow,
  title,
  heroImage,
  intro,
  blocks,
  secondaryImage,
  relatedProjects,
  relatedHeading = "RELATED PROJECTS",
  ctaLabel = "REQUEST AN ESTIMATE",
  ctaHref = "/contact",
  ctaNote,
}: {
  eyebrow: string;
  title: string;
  heroImage: { src: string; alt: string };
  intro: string;
  blocks: ServiceContentBlock[];
  secondaryImage: { src: string; alt: string };
  relatedProjects: Project[];
  relatedHeading?: string;
  ctaLabel?: string;
  ctaHref?: string;
  ctaNote?: string;
}) {
  return (
    <>
      <section className="relative bg-ink">
        <div className="relative h-[52vh] min-h-[380px] max-h-[640px] w-full overflow-hidden">
          <Image
            src={heroImage.src}
            alt={heroImage.alt}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/40 to-ink/10" />
          <div className="relative z-10 h-full container max-w-7xl flex flex-col justify-end pb-14">
            <p className="label-eyebrow text-copper mb-4">{eyebrow}</p>
            <h1 className="font-heading font-extrabold text-3xl sm:text-5xl tracking-tight text-cream max-w-3xl">
              {title}
            </h1>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <Container className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-14 items-start">
          <div>
            <p className="text-lg sm:text-xl text-ink leading-relaxed max-w-prose2 font-medium">
              {intro}
            </p>

            <div className="mt-12 space-y-10">
              {blocks.map((block) => (
                <div key={block.heading} className="border-t border-concrete pt-6">
                  <h2 className="font-heading font-bold text-xl text-ink">{block.heading}</h2>
                  <p className="mt-3 text-slate leading-relaxed max-w-prose2">{block.body}</p>
                </div>
              ))}
            </div>

            <div className="mt-12">
              <Button href={ctaHref} size="lg" variant="primary">
                {ctaLabel}
              </Button>
              {ctaNote && <p className="mt-3 text-sm text-slate max-w-md">{ctaNote}</p>}
            </div>
          </div>

          <div className="relative aspect-[4/5] bg-concrete lg:sticky lg:top-28">
            <Image
              src={secondaryImage.src}
              alt={secondaryImage.alt}
              fill
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="object-cover"
            />
          </div>
        </Container>
      </section>

      {relatedProjects.length > 0 && (
        <section className="py-16 sm:py-24 bg-cream">
          <Container>
            <SectionHeading eyebrow="FROM THE PORTFOLIO" title={relatedHeading} className="mb-12" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
              {relatedProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </Container>
        </section>
      )}
    </>
  );
}
