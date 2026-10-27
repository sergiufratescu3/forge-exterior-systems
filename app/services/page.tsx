import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { services } from "@/config/site";
import { demoImages } from "@/lib/demo-images";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Siding installation, window installation, and commercial storefront installation for residential and commercial exterior projects.",
  alternates: { canonical: "/services" },
};

const serviceImages = {
  siding: demoImages.sidingService,
  windows: demoImages.windowsService,
  storefronts: demoImages.storefrontService,
};

export default function ServicesPage() {
  return (
    <>
      <section className="py-20 sm:py-28 bg-cream border-b border-concrete">
        <Container>
          <p className="label-eyebrow mb-4">WHAT WE DO</p>
          <h1 className="font-heading font-extrabold text-4xl sm:text-5xl tracking-tight text-ink max-w-3xl">
            EXTERIOR INSTALLATION SERVICES
          </h1>
          <p className="mt-6 text-lg text-slate max-w-2xl leading-relaxed">
            Forge Exterior Systems provides siding installation, window
            installation, and commercial storefront installation for
            residential and commercial projects — each handled with attention
            to detail and coordination from start to finish.
          </p>
        </Container>
      </section>

      <div className="divide-y divide-concrete">
        {services.map((service, index) => {
          const img = serviceImages[service.key];
          const reversed = index % 2 === 1;
          return (
            <section key={service.key} className="py-16 sm:py-24">
              <Container
                className={`grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center ${
                  reversed ? "lg:[&>*:first-child]:order-2" : ""
                }`}
              >
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest2 text-copper">
                    SERVICE {String(index + 1).padStart(2, "0")}
                  </p>
                  <h2 className="mt-3 font-heading font-bold text-3xl text-ink">
                    {service.label.toUpperCase()}
                  </h2>
                  <p className="mt-5 text-slate leading-relaxed max-w-prose2">
                    {service.description}
                  </p>
                  <Link
                    href={`/services/${service.slug}`}
                    className="mt-6 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-ink hover:text-copper underline underline-offset-4"
                  >
                    Learn More
                  </Link>
                </div>
                <div className="relative aspect-[4/3] bg-concrete">
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
              </Container>
            </section>
          );
        })}
      </div>
    </>
  );
}
