import type { Metadata } from "next";
import Image from "next/image";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { demoImages } from "@/lib/demo-images";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Forge Exterior Systems' working philosophy, service capabilities, and approach to residential and commercial exterior installation.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <section className="py-20 sm:py-28 bg-cream border-b border-concrete">
        <Container>
          <p className="label-eyebrow mb-4">ABOUT US</p>
          <h1 className="font-heading font-extrabold text-4xl sm:text-5xl tracking-tight text-ink max-w-3xl">
            BUILT ON CRAFTSMANSHIP.
            <br />
            FOCUSED ON EXECUTION.
          </h1>
        </Container>
      </section>

      <section className="py-16 sm:py-24">
        <Container className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          <div>
            <h2 className="font-heading font-bold text-2xl text-ink">Company Introduction</h2>
            <p className="mt-4 text-slate leading-relaxed max-w-prose2">
              {siteConfig.companyName} provides siding, window, and
              commercial storefront installation for residential and
              commercial projects. Our work is centered on accurate
              installation, clean finishes, and clear coordination with
              everyone involved in a project — from homeowners to general
              contractors and property managers.
              {/* EDITABLE: expand with the specific introduction the business owner wants to lead with. */}
            </p>
          </div>
          <div className="relative aspect-[4/3] bg-concrete">
            <Image
              src={demoImages.aboutTeam.src}
              alt={demoImages.aboutTeam.alt}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-24 bg-cream border-t border-concrete">
        <Container className="grid grid-cols-1 lg:grid-cols-2 gap-14">
          <div>
            <h2 className="font-heading font-bold text-2xl text-ink">Background &amp; Experience</h2>
            <p className="mt-4 text-slate leading-relaxed max-w-prose2">
              {/* EDITABLE: replace with the company's real background. No founding date, project
                  count, or years-in-business figure is stated here until it is supplied, so the
                  site never presents an invented history as fact. */}
              Specific details about the company&apos;s history and experience will
              be added here once provided. This section is intended to describe
              the team&apos;s background in exterior installation work in plain,
              factual terms.
            </p>
          </div>
          <div>
            <h2 className="font-heading font-bold text-2xl text-ink">Service Area</h2>
            <p className="mt-4 text-slate leading-relaxed max-w-prose2">
              {siteConfig.contact.serviceArea}.{" "}
              {/* EDITABLE: set the real service area in config/site.ts (siteConfig.contact.serviceArea). */}
              Contact our team to confirm whether a specific project location
              falls within our current service area.
            </p>
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-24">
        <Container className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          <div className="relative aspect-[4/3] bg-concrete order-2 lg:order-1">
            <Image
              src={demoImages.aboutDetail.src}
              alt={demoImages.aboutDetail.alt}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="order-1 lg:order-2">
            <h2 className="font-heading font-bold text-2xl text-ink">
              Residential &amp; Commercial Capability
            </h2>
            <p className="mt-4 text-slate leading-relaxed max-w-prose2">
              We work across both residential and commercial exterior
              installation — from individual homes and custom residential
              builds to retail storefronts, office buildings, and other
              commercial properties. Each project type has different
              coordination needs, and our approach is adjusted accordingly
              while holding to the same installation standards.
            </p>
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-24 bg-cream border-t border-concrete">
        <Container>
          <h2 className="font-heading font-bold text-2xl text-ink">Team</h2>
          <p className="mt-4 text-slate leading-relaxed max-w-prose2">
            {/* EDITABLE: add real team bios/photos once provided. */}
            Information about our installation team will be added here.
          </p>
        </Container>
      </section>

      <section className="py-16 sm:py-24">
        <Container>
          <h2 className="font-heading font-bold text-2xl text-ink">
            Values &amp; Working Philosophy
          </h2>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-10">
            <div>
              <h3 className="font-heading font-semibold text-ink">Precision First</h3>
              <p className="mt-2 text-sm text-slate leading-relaxed">
                Accurate measurement and layout before installation begins,
                so the finished work fits and reads correctly.
              </p>
            </div>
            <div>
              <h3 className="font-heading font-semibold text-ink">Clear Communication</h3>
              <p className="mt-2 text-sm text-slate leading-relaxed">
                Project details, scope, and status are communicated clearly
                with homeowners, contractors, and property managers alike.
              </p>
            </div>
            <div>
              <h3 className="font-heading font-semibold text-ink">Finished-Result Focus</h3>
              <p className="mt-2 text-sm text-slate leading-relaxed">
                Attention carries through to the last details — trim,
                transitions, and cleanup — not just the main installation.
              </p>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-16 bg-ink">
        <Container className="text-center">
          <h2 className="font-heading font-bold text-2xl sm:text-3xl text-cream">
            HAVE A PROJECT IN MIND?
          </h2>
          <div className="mt-8">
            <Button href="/contact" size="lg" variant="primary">
              REQUEST AN ESTIMATE
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}
