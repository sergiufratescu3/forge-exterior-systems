"use client";

import { useState } from "react";
import type { Inquiry } from "@/lib/inquiries";
import { cn } from "@/lib/utils";

export function InquiriesTable({ initialInquiries }: { initialInquiries: Inquiry[] }) {
  const [inquiries, setInquiries] = useState(initialInquiries);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  async function toggleStatus(inquiry: Inquiry) {
    const nextStatus = inquiry.status === "new" ? "read" : "new";
    const res = await fetch(`/api/admin/inquiries/${inquiry.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: nextStatus }),
    });
    if (res.ok) {
      setInquiries((prev) =>
        prev.map((i) => (i.id === inquiry.id ? { ...i, status: nextStatus } : i))
      );
    }
  }

  if (inquiries.length === 0) {
    return <p className="text-slate py-10">No inquiries have been submitted yet.</p>;
  }

  return (
    <div className="space-y-3">
      {inquiries.map((inquiry) => {
        const attachments: string[] = JSON.parse(inquiry.attachment_paths || "[]");
        const expanded = expandedId === inquiry.id;
        return (
          <div key={inquiry.id} className="border border-concrete bg-white">
            <button
              type="button"
              onClick={() => setExpandedId(expanded ? null : inquiry.id)}
              className="w-full flex items-center justify-between gap-4 p-4 text-left"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span
                  className={cn(
                    "px-2 py-1 text-[10px] uppercase tracking-wide shrink-0",
                    inquiry.status === "new" ? "bg-copper text-cream" : "bg-concrete text-slate"
                  )}
                >
                  {inquiry.status}
                </span>
                <span className="font-semibold text-ink truncate">{inquiry.name}</span>
                <span className="text-sm text-slate truncate hidden sm:inline">
                  {inquiry.category || "—"} / {inquiry.service || "—"} / {inquiry.location}
                </span>
              </div>
              <span className="text-xs text-slate shrink-0">
                {new Date(inquiry.created_at).toLocaleDateString()}
              </span>
            </button>

            {expanded && (
              <div className="border-t border-concrete p-4 space-y-3 text-sm">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <p>
                    <span className="text-slate">Email: </span>
                    <a href={`mailto:${inquiry.email}`} className="text-ink hover:text-copper">
                      {inquiry.email}
                    </a>
                  </p>
                  {inquiry.phone && (
                    <p>
                      <span className="text-slate">Phone: </span>
                      {inquiry.phone}
                    </p>
                  )}
                  {inquiry.company && (
                    <p>
                      <span className="text-slate">Company: </span>
                      {inquiry.company}
                    </p>
                  )}
                  {inquiry.timeline && (
                    <p>
                      <span className="text-slate">Timeline: </span>
                      {inquiry.timeline}
                    </p>
                  )}
                </div>
                <p className="text-ink whitespace-pre-wrap">{inquiry.description}</p>
                {attachments.length > 0 && (
                  <div className="flex flex-wrap gap-3">
                    {attachments.map((url) => (
                      <a
                        key={url}
                        href={url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-semibold text-ink underline underline-offset-4 hover:text-copper"
                      >
                        View attachment
                      </a>
                    ))}
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => toggleStatus(inquiry)}
                  className="text-xs font-semibold text-ink hover:text-copper underline underline-offset-4"
                >
                  Mark as {inquiry.status === "new" ? "read" : "unread"}
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
