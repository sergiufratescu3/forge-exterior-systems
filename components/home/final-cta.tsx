import Image from "next/image";
import { Button } from "@/components/ui/button";
import { demoImages } from "@/lib/demo-images";
import { siteConfig } from "@/config/site";

export function FinalCta() {
  return (
    <section className="relative bg-ink">
      <div className="relative py-24 sm:py-32 overflow-hidden">
        <Image
          src={demoImages.finalCta.src}
          alt={demoImages.finalCta.alt}
          fill
          sizes="100vw"
          className="object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-ink/70" />
        <div className="relative container max-w-7xl text-center">
          <h2 className="font-heading font-extrabold text-3xl sm:text-5xl tracking-tight text-cream max-w-3xl mx-auto">
            HAVE A PROJECT IN MIND?
          </h2>
          <p className="mt-5 text-concrete max-w-xl mx-auto leading-relaxed">
            Whether you are planning a residential exterior project or a
            commercial installation, let&apos;s discuss your requirements.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-4">
            <Button href={siteConfig.estimateCta.href} size="lg" variant="primary">
              {siteConfig.estimateCta.label}
            </Button>
            <Button href="/contact" size="lg" variant="outline-light">
              CONTACT OUR TEAM
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
