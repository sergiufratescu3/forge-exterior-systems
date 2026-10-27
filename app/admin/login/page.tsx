import { Suspense } from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Logo } from "@/components/ui/logo";
import { LoginForm } from "@/components/admin/login-form";
import { getCurrentAdmin } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Admin Sign In",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage() {
  const admin = await getCurrentAdmin();
  if (admin) redirect("/admin");

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-cream px-4 py-16">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-8">
          <Logo iconOnly={false} />
        </div>
        <div className="bg-white border border-concrete p-8">
          <h1 className="font-heading font-bold text-xl text-ink mb-1">Admin Sign In</h1>
          <p className="text-sm text-slate mb-6">
            Sign in to manage residential and commercial project content.
          </p>
          <Suspense>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
