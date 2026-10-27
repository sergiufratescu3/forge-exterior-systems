"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Close the mobile menu on route change.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Lock body scroll while the mobile menu is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    // Fragment, not a single wrapping element: the mobile nav panel below
    // uses `position: fixed` and must NOT be a descendant of <header>, which
    // applies `backdrop-blur` (a CSS `backdrop-filter`). A `backdrop-filter`
    // (like `transform` or `filter`) makes its element the containing block
    // for fixed-position descendants, which would collapse the full-height
    // panel to the header's own 80px height instead of the viewport.
    <>
      <header className="sticky top-0 z-50 border-b border-concrete bg-cream/95 backdrop-blur supports-[backdrop-filter]:bg-cream/90">
        <div className="container max-w-7xl flex h-20 items-center justify-between gap-6">
          <Logo />

          <nav
            className="hidden lg:flex items-center gap-8"
            aria-label="Main navigation"
          >
            {siteConfig.nav.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "text-sm font-semibold uppercase tracking-wide transition-colors duration-250 pb-1 border-b-2",
                    active
                      ? "text-ink border-copper"
                      : "text-slate border-transparent hover:text-ink hover:border-concrete",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden lg:block">
            <Button href={siteConfig.estimateCta.href} variant="primary">
              {siteConfig.estimateCta.label}
            </Button>
          </div>

          <button
            type="button"
            className="lg:hidden inline-flex items-center justify-center h-11 w-11 -mr-2 text-ink"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            <svg
              width="26"
              height="26"
              viewBox="0 0 26 26"
              fill="none"
              aria-hidden="true"
            >
              {open ? (
                <>
                  <line
                    x1="5"
                    y1="5"
                    x2="21"
                    y2="21"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <line
                    x1="21"
                    y1="5"
                    x2="5"
                    y2="21"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                </>
              ) : (
                <>
                  <line
                    x1="3"
                    y1="7"
                    x2="23"
                    y2="7"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <line
                    x1="3"
                    y1="13"
                    x2="23"
                    y2="13"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <line
                    x1="3"
                    y1="19"
                    x2="23"
                    y2="19"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                </>
              )}
            </svg>
          </button>
        </div>
      </header>

      {open && (
        <div
          id="mobile-nav"
          className="lg:hidden fixed inset-x-0 top-20 bottom-0 z-40 bg-cream border-t border-concrete overflow-y-auto"
        >
          <nav
            className="container max-w-7xl py-8 flex flex-col gap-1"
            aria-label="Mobile navigation"
          >
            {siteConfig.nav.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "py-4 text-lg font-heading font-semibold border-b border-concrete",
                    active ? "text-copper" : "text-ink",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
            <div className="mt-6">
              <Button
                href={siteConfig.estimateCta.href}
                variant="primary"
                className="w-full"
              >
                {siteConfig.estimateCta.label}
              </Button>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
