import Image from "next/image";
import Link from "next/link";
import { services } from "@/config/site";
import { demoImages } from "@/lib/demo-images";

const serviceImages = {
  siding: demoImages.sidingService,
  windows: demoImages.windowsService,
  storefronts: demoImages.storefrontService,
};

export function ServicesSection() {
  return (
    <section className="py-20 sm:py-28 bg-cream">
      <div className="container max-w-7xl">
        <div className="max-w-2xl mb-14">
          <p className="label-eyebrow mb-4">OUR CAPABILITIES</p>
          <h2 className="font-heading font-bold text-3xl sm:text-4xl tracking-tight text-ink">
            WHAT WE DO
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-px bg-concrete border border-concrete">
          {services.map((service, index) => {
            const img = serviceImages[service.key];
            return (
              <article key={service.key} className="bg-cream flex flex-col">
                <div className="relative aspect-[4/3]">
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    sizes="(min-width: 1024px) 33vw, 100vw"
                    className="object-cover"
                  />
                </div>
                <div className="p-7 sm:p-8 flex flex-col flex-1">
                  <p className="text-xs font-semibold uppercase tracking-widest2 text-copper">
                    SERVICE {String(index + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-3 font-heading font-bold text-xl text-ink">
                    {service.label.toUpperCase()}
                  </h3>
                  <p className="mt-3 text-sm text-slate leading-relaxed flex-1">
                    {service.description}
                  </p>
                  <Link
                    href={`/services/${service.slug}`}
                    className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-ink hover:text-copper underline underline-offset-4"
                  >
                    Learn More
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
