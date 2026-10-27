import Image from "next/image";
import { demoImages } from "@/lib/demo-images";

export function Intro() {
  return (
    <section className="py-20 sm:py-28">
      <div className="container max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        <div>
          <p className="label-eyebrow mb-4">WHO WE ARE</p>
          <h2 className="font-heading font-bold text-3xl sm:text-4xl leading-[1.1] tracking-tight text-ink">
            EXTERIOR INSTALLATION.
            <br />
            DONE RIGHT.
          </h2>
          <p className="mt-6 text-base sm:text-lg text-slate leading-relaxed max-w-prose2">
            Every exterior detail matters. From siding and window installation
            to commercial storefront systems, we focus on accurate
            installation, clean finishes, and coordination with the
            requirements of each project.
          </p>
        </div>
        <div className="relative aspect-[4/3] bg-concrete">
          <Image
            src={demoImages.companyIntro.src}
            alt={demoImages.companyIntro.alt}
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
