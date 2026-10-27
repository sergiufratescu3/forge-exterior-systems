import Link from "next/link";
import { getCurrentAdmin } from "@/lib/auth";
import { Logo } from "@/components/ui/logo";
import { LogoutButton } from "@/components/admin/logout-button";

export const metadata = {
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await getCurrentAdmin();

  // No session (only reachable on /admin/login, which middleware leaves public):
  // render the page on its own, without the dashboard chrome.
  if (!admin) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-cream">
      <header className="border-b border-concrete bg-white">
        <div className="container max-w-7xl flex h-16 items-center justify-between">
          <Link href="/admin" className="flex items-center gap-3">
            <Logo iconOnly />
            <span className="font-heading font-bold text-sm uppercase tracking-wide text-ink">
              Project Dashboard
            </span>
          </Link>
          <nav className="flex items-center gap-4 sm:gap-6">
            <Link href="/admin" className="text-[11px] sm:text-xs font-semibold uppercase tracking-wide text-slate hover:text-ink">
              Projects
            </Link>
            <Link
              href="/admin/inquiries"
              className="text-[11px] sm:text-xs font-semibold uppercase tracking-wide text-slate hover:text-ink"
            >
              Inquiries
            </Link>
          </nav>
          <div className="flex items-center gap-6">
            <span className="text-xs text-slate hidden sm:inline">{admin.email}</span>
            <Link
              href="/"
              target="_blank"
              className="text-xs font-semibold uppercase tracking-wide text-slate hover:text-ink"
            >
              View Site ↗
            </Link>
            <LogoutButton />
          </div>
        </div>
      </header>
      <main className="container max-w-7xl py-10">{children}</main>
    </div>
  );
}
