"use client";

import Link from "next/link";
import {
  Bell,
  MapPin,
  Clock,
  AlertTriangle,
  Flame,
  HeartPulse,
  ChevronRight,
  ShieldCheck,
  Radio,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useGetPublicVerifiedIncidentsQuery } from "@/redux/api/incidentApi";

function formatRelativeTime(dateString?: string) {
  if (!dateString) return "Recently";
  const date = new Date(dateString);
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / 60000);

  if (diffInMinutes < 1) return "Just now";
  if (diffInMinutes < 60) return `${diffInMinutes} mins ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} ${diffInHours === 1 ? "hour" : "hours"} ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays} ${diffInDays === 1 ? "day" : "days"} ago`;
}

export default function NotificationPanel() {
  const { data: verifiedRes, isLoading } = useGetPublicVerifiedIncidentsQuery(
    { limit: 100 },
    {
      pollingInterval: 15000,
      refetchOnMountOrArgChange: true,
    }
  );

  const incidents = (verifiedRes?.data || [])
    .filter(
      (item: any) =>
        item.status === "VERIFIED" ||
        item.status === "DISPATCHING" ||
        item.status === "IN_PROGRESS" ||
        item.status === "RESPONDER_ASSIGNED"
    )
    .slice(0, 4);

  const getCategoryIcon = (categoryName?: string) => {
    const lower = (categoryName || "").toLowerCase();
    if (lower.includes("fire"))
      return {
        icon: Flame,
        bg: "bg-amber-50 text-amber-600 border-amber-200 ring-4 ring-amber-50/50",
      };
    if (lower.includes("blood") || lower.includes("medical") || lower.includes("health"))
      return {
        icon: HeartPulse,
        bg: "bg-rose-50 text-rose-600 border-rose-200 ring-4 ring-rose-50/50",
      };
    if (lower.includes("accident") || lower.includes("traffic") || lower.includes("crash"))
      return {
        icon: AlertTriangle,
        bg: "bg-red-50 text-brand-red border-red-200 ring-4 ring-red-50/50",
      };
    return {
      icon: ShieldCheck,
      bg: "bg-blue-50 text-brand-blue border-blue-200 ring-4 ring-blue-50/50",
    };
  };

  return (
    <div className="flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white/90 p-5 sm:p-6 backdrop-blur-xl shadow-xs">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-brand-navy flex items-center gap-2">
              Live Alert Notifications
              <span className="inline-flex items-center gap-1 rounded-full bg-red-50 text-brand-red px-2 py-0.5 text-[10px] font-bold border border-red-200">
                <Radio className="size-2.5 animate-pulse" /> Live
              </span>
            </h3>
            <p className="text-xs sm:text-[13px] text-slate-500 font-medium mt-0.5">
              Dispatched emergency broadcasts in your vicinity
            </p>
          </div>
          <div className="grid size-9 place-items-center rounded-xl bg-slate-100/80 text-slate-600">
            {isLoading ? (
              <Loader2 className="size-4.5 animate-spin text-slate-400" />
            ) : (
              <Bell className="size-4.5 text-brand-red" />
            )}
          </div>
        </div>

        {/* Notifications Stream */}
        <div className="mt-4 space-y-3">
          {incidents.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-200 p-6 text-center">
              <ShieldCheck className="mx-auto size-8 text-emerald-500" />
              <p className="mt-2 text-xs font-bold text-brand-navy">
                No Critical Emergencies Active
              </p>
              <p className="mt-0.5 text-[11px] text-slate-400">
                All reported zones are currently safe and monitored.
              </p>
            </div>
          ) : (
            incidents.map((item: any) => {
              const { icon: Icon, bg: iconBg } = getCategoryIcon(item.categoryName);
              const locationText =
                item.addressText || item.areaName || item.district || "Dhaka, Bangladesh";
              const timeString = formatRelativeTime(item.reportedAt || item.createdAt);

              return (
                <Link
                  key={item.id}
                  href={`/incidents/${item.id}`}
                  className="group block relative rounded-xl border border-slate-100 bg-slate-50/70 p-3.5 transition hover:border-slate-300 hover:bg-white hover:shadow-xs"
                >
                  <div className="flex items-start gap-3.5">
                    <div
                      className={cn(
                        "grid size-9.5 shrink-0 place-items-center rounded-xl border shadow-2xs mt-0.5",
                        iconBg
                      )}
                    >
                      <Icon className="size-4.5" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-[13.5px] font-bold text-brand-navy group-hover:text-brand-red transition truncate">
                          {item.title}
                        </p>
                        <span
                          className={cn(
                            "text-[10px] font-black uppercase px-2 py-0.5 rounded-md border shrink-0",
                            item.severity === "CRITICAL" && "bg-red-50 text-brand-red border-red-200",
                            item.severity === "HIGH" && "bg-amber-50 text-amber-700 border-amber-200",
                            item.severity === "MEDIUM" && "bg-blue-50 text-brand-blue border-blue-200",
                            item.severity === "LOW" && "bg-slate-50 text-slate-700 border-slate-200"
                          )}
                        >
                          {item.severity}
                        </span>
                      </div>

                      <p className="mt-1 text-xs text-slate-600 leading-relaxed line-clamp-1">
                        {item.description || "Emergency dispatch active in this location."}
                      </p>

                      <div className="mt-2.5 flex items-center justify-between text-xs font-medium text-slate-400">
                        <span className="flex items-center gap-1.5 truncate max-w-[65%]">
                          <MapPin className="size-3.5 text-slate-400 shrink-0" />
                          <span className="truncate">{locationText}</span>
                        </span>
                        <span className="flex items-center gap-1.5 shrink-0">
                          <Clock className="size-3.5 text-slate-400" />
                          {timeString}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })
          )}
        </div>
      </div>

      {/* View All Action */}
      <div className="mt-4 pt-3.5 border-t border-slate-100">
        <Link
          href="/crisis-map"
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50/80 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100 hover:text-brand-navy transition shadow-2xs"
        >
          <span>View All Dispatches</span>
          <ChevronRight className="size-4" />
        </Link>
      </div>
    </div>
  );
}