import Image from "next/image";
import { Button } from "@/components/ui/button";
import { demoImages } from "@/lib/demo-images";
import { siteConfig } from "@/config/site";

export function Hero() {
  return (
    <section className="relative bg-ink">
      <div className="relative h-[82vh] min-h-[560px] max-h-[920px] w-full overflow-hidden">
        <Image
          src={demoImages.heroExterior.src}
          alt={demoImages.heroExterior.alt}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/40 to-ink/10" />

        <div className="relative z-10 h-full container max-w-7xl flex flex-col justify-end pb-16 sm:pb-20">
          <p className="label-eyebrow text-copper mb-5">
            RESIDENTIAL &amp; COMMERCIAL EXTERIORS
          </p>
          <h1 className="font-heading font-extrabold text-4xl sm:text-6xl lg:text-7xl leading-[1.05] tracking-tight text-cream max-w-4xl">
            BUILT WITH PRECISION.
            <br />
            DEFINED BY DETAIL.
          </h1>
          <p className="mt-6 text-base sm:text-lg text-concrete max-w-xl leading-relaxed">
            Professional siding, window, and storefront installation for
            residential and commercial projects. Quality workmanship,
            attention to detail, and dependable execution from start to
            finish.
          </p>
          <div className="mt-9 flex flex-wrap gap-4">
            <Button href={siteConfig.estimateCta.href} size="lg" variant="primary">
              {siteConfig.estimateCta.label}
            </Button>
            <Button href="#projects" size="lg" variant="outline-light">
              EXPLORE OUR PROJECTS
            </Button>
          </div>
        </div>
      </div>
      <p className="sr-only">{demoImages.heroExterior.alt}</p>
    </section>
  );
}
