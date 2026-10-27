import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { ContactForm } from "@/components/contact/contact-form";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Contact / Request an Estimate",
  description:
    "Tell us about your residential or commercial exterior project and the installation services you need. Our team will review the details and follow up.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <section className="py-16 sm:py-24">
      <Container className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-16">
        <div>
          <p className="label-eyebrow mb-4">GET IN TOUCH</p>
          <h1 className="font-heading font-extrabold text-4xl sm:text-5xl tracking-tight text-ink max-w-xl">
            LET&apos;S DISCUSS YOUR PROJECT.
          </h1>
          <p className="mt-6 text-lg text-slate max-w-xl leading-relaxed">
            Tell us a little about your project and the installation services
            you need. Our team can review the information and follow up
            using the contact details you provide.
          </p>

          <div className="mt-12">
            <ContactForm />
          </div>
        </div>

        <aside className="lg:border-l lg:border-concrete lg:pl-12">
          <h2 className="label-eyebrow mb-4">Direct Contact</h2>
          <ul className="space-y-4 text-ink">
            <li>
              <p className="text-xs uppercase tracking-wide text-slate mb-1">Phone</p>
              <a href={`tel:${siteConfig.contact.phoneHref}`} className="font-heading font-semibold text-lg hover:text-copper">
                {siteConfig.contact.phone}
              </a>
            </li>
            <li>
              <p className="text-xs uppercase tracking-wide text-slate mb-1">Email</p>
              <a
                href={`mailto:${siteConfig.contact.email}`}
                className="font-heading font-semibold text-lg hover:text-copper break-all"
              >
                {siteConfig.contact.email}
              </a>
            </li>
            <li>
              <p className="text-xs uppercase tracking-wide text-slate mb-1">Service Area</p>
              <p>{siteConfig.contact.serviceArea}</p>
            </li>
          </ul>

          <div className="mt-10 border-t border-concrete pt-6">
            <h3 className="font-heading font-semibold text-ink mb-2">What happens next?</h3>
            <p className="text-sm text-slate leading-relaxed">
              Every inquiry is reviewed by our team. We follow up using the
              contact details provided to discuss project scope and next
              steps.
            </p>
          </div>
        </aside>
      </Container>
    </section>
  );
}
