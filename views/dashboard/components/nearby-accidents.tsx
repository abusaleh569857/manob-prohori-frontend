"use client";

import Link from "next/link";
import {
  AlertTriangle,
  Flame,
  HeartPulse,
  MapPin,
  Clock,
  ChevronRight,
  ShieldCheck,
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

export default function NearbyAccidents() {
  const { data: verifiedRes, isLoading } = useGetPublicVerifiedIncidentsQuery(
    { limit: 100 },
    {
      pollingInterval: 15000,
      refetchOnMountOrArgChange: true,
    }
  );

  const incidents = (verifiedRes?.data || []).filter(
    (item: any) =>
      item.status === "VERIFIED" ||
      item.status === "DISPATCHING" ||
      item.status === "IN_PROGRESS" ||
      item.status === "RESPONDER_ASSIGNED"
  );

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
    <div id="incidents" className="rounded-2xl border border-slate-200/80 bg-white/90 p-5 sm:p-6 backdrop-blur-xl shadow-xs">
      {/* Section Header */}
      <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
        <div>
          <h3 className="text-base font-bold text-brand-navy flex items-center gap-2">
            Recent Nearby Incidents
            <span className="rounded-full bg-red-50 text-brand-red px-2.5 py-0.5 text-[11px] font-bold border border-red-200">
              {isLoading ? (
                <Loader2 className="inline size-3 animate-spin" />
              ) : (
                `${incidents.length} Active`
              )}
            </span>
          </h3>
          <p className="text-xs sm:text-[13px] text-slate-500 font-medium mt-0.5">
            Emergency dispatches currently tracked by response teams
          </p>
        </div>

        <Link
          href="/crisis-map"
          className="text-xs font-bold text-brand-red hover:underline"
        >
          View Map
        </Link>
      </div>

      {/* Incident List */}
      <div className="mt-4 space-y-3">
        {incidents.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-200 p-6 text-center">
            <ShieldCheck className="mx-auto size-8 text-emerald-500" />
            <p className="mt-2 text-xs font-bold text-brand-navy">
              No Active Emergencies in Vicinity
            </p>
            <p className="mt-0.5 text-[11px] text-slate-400">
              Emergency zones are all cleared and operational.
            </p>
          </div>
        ) : (
          incidents.slice(0, 4).map((incident: any) => {
            const { icon: Icon, bg: iconBg } = getCategoryIcon(incident.categoryName);
            const locationText =
              incident.addressText || incident.areaName || incident.district || "Dhaka, Bangladesh";
            const timeString = formatRelativeTime(incident.reportedAt || incident.createdAt);

            return (
              <div
                key={incident.id}
                className="group flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50/70 p-3.5 transition hover:border-slate-200 hover:bg-white hover:shadow-xs"
              >
                <div className="flex items-start gap-3.5 min-w-0 flex-1">
                  <div
                    className={cn(
                      "grid size-10.5 shrink-0 place-items-center rounded-xl border shadow-2xs mt-0.5",
                      iconBg
                    )}
                  >
                    <Icon className="size-5" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-[13.5px] font-bold text-brand-navy group-hover:text-brand-red transition truncate">
                        {incident.title}
                      </h4>
                      <span
                        className={cn(
                          "rounded px-2 py-0.5 text-[10px] font-black uppercase border shrink-0",
                          incident.severity === "CRITICAL" &&
                            "bg-red-50 text-brand-red border-red-200",
                          incident.severity === "HIGH" &&
                            "bg-amber-50 text-amber-700 border-amber-200",
                          incident.severity === "MEDIUM" &&
                            "bg-blue-50 text-brand-blue border-blue-200",
                          incident.severity === "LOW" &&
                            "bg-slate-50 text-slate-700 border-slate-200"
                        )}
                      >
                        {incident.severity}
                      </span>
                    </div>

                    <p className="mt-1 text-xs text-slate-600 line-clamp-1">
                      {incident.description || "Active emergency response in progress."}
                    </p>

                    <div className="mt-2 flex items-center gap-3 text-xs font-medium text-slate-400">
                      <span className="flex items-center gap-1 truncate max-w-[60%]">
                        <MapPin className="size-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{locationText}</span>
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1 shrink-0">
                        <Clock className="size-3.5 text-slate-400" />
                        {timeString}
                      </span>
                    </div>
                  </div>
                </div>

                <Link
                  href={`/incidents/${incident.id}`}
                  className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-brand-navy transition shadow-2xs shrink-0"
                >
                  <span>Details</span>
                  <ChevronRight className="size-3.5 text-slate-400" />
                </Link>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}