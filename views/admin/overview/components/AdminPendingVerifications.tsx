"use client";

import Link from "next/link";
import { UserCheck, HeartPulse, ShieldCheck, ArrowRight, Check, X, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

const pendingVerifications = [
  {
    id: 1,
    type: "VOLUNTEER",
    name: "Dr. Rafiqul Islam",
    detail: "First Aid & Paramedic Training Certificate",
    submittedAt: "10 mins ago",
    badge: "Paramedic Level 2",
    badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  {
    id: 2,
    type: "BLOOD_DONOR",
    name: "Sadia Sultana",
    detail: "Blood Test & Platelet Report (O+ Positive)",
    submittedAt: "25 mins ago",
    badge: "O+ Donor",
    badgeColor: "bg-rose-50 text-rose-700 border-rose-200",
  },
  {
    id: 3,
    type: "VOLUNTEER",
    name: "Mahmud Hasan",
    detail: "Fire & Rescue Operations Certificate",
    submittedAt: "1 hr ago",
    badge: "Rescue Lead",
    badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
  },
];

export function AdminPendingVerifications() {
  return (
    <div className="flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs">
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-brand-navy flex items-center gap-2">
              Pending Verifications Queue
              <span className="rounded-full bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 text-[10px] font-bold">
                3 Pending
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Applications requiring admin document inspection & approval
            </p>
          </div>
          <div className="grid size-8.5 place-items-center rounded-xl bg-slate-100 text-slate-600">
            <UserCheck className="size-4 text-brand-blue" />
          </div>
        </div>

        <div className="mt-3.5 space-y-3">
          {pendingVerifications.map((item) => (
            <div
              key={item.id}
              className="group rounded-xl border border-slate-100 bg-slate-50/60 p-3.5 transition hover:border-slate-200 hover:bg-white hover:shadow-xs"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0 flex-1">
                  <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-white shadow-2xs font-bold text-xs text-brand-navy">
                    {item.type === "VOLUNTEER" ? (
                      <ShieldCheck className="size-4.5 text-emerald-600" />
                    ) : (
                      <HeartPulse className="size-4.5 text-rose-600" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-brand-navy truncate">
                        {item.name}
                      </h4>
                      <span
                        className={cn(
                          "rounded px-1.5 py-0.2 text-[9.5px] font-extrabold uppercase border",
                          item.badgeColor
                        )}
                      >
                        {item.badge}
                      </span>
                    </div>
                    <p className="mt-1 text-[11px] text-slate-600 line-clamp-1">
                      {item.detail}
                    </p>
                    <p className="mt-1 text-[10px] font-medium text-slate-400">
                      Submitted {item.submittedAt}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    title="Approve"
                    className="grid size-7.5 place-items-center rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition cursor-pointer"
                  >
                    <Check className="size-3.5" />
                  </button>
                  <button
                    title="Reject"
                    className="grid size-7.5 place-items-center rounded-lg border border-red-200 bg-red-50 text-brand-red hover:bg-red-100 transition cursor-pointer"
                  >
                    <X className="size-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100">
        <Link
          href="/admin/volunteers"
          className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 hover:text-brand-navy transition"
        >
          <span>View All Pending Applications</span>
          <ArrowRight className="size-3.5" />
        </Link>
      </div>
    </div>
  );
}
