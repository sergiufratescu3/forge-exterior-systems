import type { Metadata } from "next";
import { InquiriesTable } from "@/components/admin/inquiries-table";
import { listInquiries } from "@/lib/inquiries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Inquiries",
  robots: { index: false, follow: false },
};

export default function AdminInquiriesPage() {
  const inquiries = listInquiries();
  const newCount = inquiries.filter((i) => i.status === "new").length;

  return (
    <div>
      <div className="mb-10">
        <h1 className="font-heading font-bold text-2xl text-ink">Project Inquiries</h1>
        <p className="text-sm text-slate mt-1">
          {inquiries.length} total — {newCount} new
        </p>
      </div>
      <InquiriesTable initialInquiries={inquiries} />
    </div>
  );
}
