import Link from "next/link";
import { siteConfig, services } from "@/config/site";
import { Logo } from "@/components/ui/logo";
import { currentYear } from "@/lib/utils";

const socialLinks = [
  { key: "instagram", label: "Instagram", href: siteConfig.social.instagram },
  { key: "facebook", label: "Facebook", href: siteConfig.social.facebook },
  { key: "linkedin", label: "LinkedIn", href: siteConfig.social.linkedin },
  { key: "houzz", label: "Houzz", href: siteConfig.social.houzz },
].filter((s) => s.href);

export function Footer() {
  return (
    <footer className="bg-ink text-cream">
      <div className="container max-w-7xl py-16 grid grid-cols-1 gap-12 md:grid-cols-4">
        <div className="md:col-span-1">
          <Logo variant="light" />
          <p className="mt-5 text-sm text-concrete leading-relaxed max-w-xs">
            {siteConfig.description}
          </p>
          {socialLinks.length > 0 && (
            <ul className="mt-6 flex gap-4">
              {socialLinks.map((s) => (
                <li key={s.key}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs uppercase tracking-wide text-concrete hover:text-copper"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <h3 className="label-eyebrow mb-4">Services</h3>
          <ul className="space-y-3 text-sm">
            {services.map((s) => (
              <li key={s.key}>
                <Link href={`/services/${s.slug}`} className="text-concrete hover:text-cream">
                  {s.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/services" className="text-concrete hover:text-cream">
                All Services
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="label-eyebrow mb-4">Company</h3>
          <ul className="space-y-3 text-sm">
            <li>
              <Link href="/residential-projects" className="text-concrete hover:text-cream">
                Residential Projects
              </Link>
            </li>
            <li>
              <Link href="/commercial-projects" className="text-concrete hover:text-cream">
                Commercial Projects
              </Link>
            </li>
            <li>
              <Link href="/about" className="text-concrete hover:text-cream">
                About Us
              </Link>
            </li>
            <li>
              <Link href="/contact" className="text-concrete hover:text-cream">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="label-eyebrow mb-4">Contact</h3>
          <ul className="space-y-3 text-sm text-concrete">
            <li>
              <a href={`tel:${siteConfig.contact.phoneHref}`} className="hover:text-cream">
                {siteConfig.contact.phone}
              </a>
            </li>
            <li>
              <a href={`mailto:${siteConfig.contact.email}`} className="hover:text-cream break-all">
                {siteConfig.contact.email}
              </a>
            </li>
            <li>{siteConfig.contact.serviceArea}</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container max-w-7xl py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate">
          <p>
            © {currentYear()} {siteConfig.companyName}. All rights reserved.
          </p>
          <p className="text-slate">{siteConfig.tagline}</p>
        </div>
      </div>
    </footer>
  );
}
