"use client";

import Link from "next/link";
import {
  AlertTriangle,
  Flame,
  HeartPulse,
  MapPin,
  Clock,
  Radio,
  ShieldCheck,
  ArrowRight,
  ImageIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useGetPublicVerifiedIncidentsQuery } from "@/redux/api/incidentApi";

export function LiveVerifiedIncidents() {
  const { data: apiResponse, isLoading } = useGetPublicVerifiedIncidentsQuery(
    { limit: 100 },
    { refetchOnMountOrArgChange: true }
  );

  const incidents = (apiResponse?.data || []).filter(
    (item: any) =>
      item.status === "VERIFIED" ||
      item.status === "DISPATCHING" ||
      item.status === "IN_PROGRESS" ||
      item.status === "RESPONDER_ASSIGNED"
  );

  if (isLoading || incidents.length === 0) {
    return null; // Don't show if there are no verified emergencies
  }

  const getCategoryIcon = (categoryName: string) => {
    const lower = (categoryName || "").toLowerCase();
    if (lower.includes("fire")) return Flame;
    if (lower.includes("blood") || lower.includes("medical")) return HeartPulse;
    if (lower.includes("accident") || lower.includes("traffic")) return AlertTriangle;
    return ShieldCheck;
  };

  return (
    <section className="relative z-20 mx-auto mt-6 max-w-360 rounded-3xl border border-red-200/80 bg-white/95 p-6 sm:p-8 shadow-[0_20px_60px_rgba(220,38,38,0.06)] backdrop-blur">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between pb-5 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-red px-3 py-1 text-xs font-black text-white shadow-xs animate-pulse">
              <Radio className="size-3.5" /> LIVE
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-brand-navy tracking-tight">
              Verified Emergency Dispatches
            </h2>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 font-medium">
            Active emergencies verified by Manob Prohori dispatch controllers. Stay alert and avoid danger zones.
          </p>
        </div>

        <Link
          href="/crisis-map"
          className="flex items-center gap-1.5 rounded-xl border border-red-200/80 bg-red-50/80 px-4 py-2 text-xs font-bold text-brand-red hover:bg-red-100 transition shadow-2xs self-start sm:self-center"
        >
          <span>Open Live Crisis Map</span>
          <ArrowRight className="size-3.5" />
        </Link>
      </div>

      {/* Live Verified Incidents Grid */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {incidents.map((incident: any) => {
          const Icon = getCategoryIcon(incident.categoryName);
          const locationText = incident.addressText || incident.areaName || incident.district || "Dhaka";
          const hasPhotos = incident.imageUrls && incident.imageUrls.length > 0;

          return (
            <div
              key={incident.id}
              className="group flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-4.5 shadow-xs transition hover:border-red-300 hover:shadow-md"
            >
              <div>
                {/* Category & Status Badge */}
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={cn(
                      "rounded px-2 py-0.5 text-[10px] font-black uppercase border",
                      incident.severity === "CRITICAL" && "bg-red-50 text-brand-red border-red-200",
                      incident.severity === "HIGH" && "bg-amber-50 text-amber-700 border-amber-200",
                      incident.severity === "MEDIUM" && "bg-blue-50 text-brand-blue border-blue-200",
                      incident.severity === "LOW" && "bg-slate-50 text-slate-700 border-slate-200"
                    )}
                  >
                    {incident.severity}
                  </span>

                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-extrabold text-emerald-700 border border-emerald-200">
                    <ShieldCheck className="size-3 text-emerald-600" />
                    Verified
                  </span>
                </div>

                {/* Photo Preview Thumbnail (if uploaded) */}
                {hasPhotos && (
                  <div className="relative mt-3 aspect-video w-full overflow-hidden rounded-xl bg-slate-100 border border-slate-100">
                    <img
                      src={incident.imageUrls[0]}
                      alt={incident.title}
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                      onError={(e) => {
                        e.currentTarget.parentElement?.classList.add("hidden");
                      }}
                    />
                    <span className="absolute bottom-1 right-1.5 rounded-md bg-black/60 px-1.5 py-0.5 text-[9px] font-bold text-white flex items-center gap-1">
                      <ImageIcon className="size-2.5" />
                      {incident.imageUrls.length} Photo
                    </span>
                  </div>
                )}

                {/* Title & Category */}
                <div className="mt-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    {incident.categoryName || "Emergency"}
                  </span>
                  <h3 className="mt-0.5 text-sm font-bold text-brand-navy group-hover:text-brand-red transition line-clamp-2 leading-snug">
                    {incident.title}
                  </h3>
                </div>

                {/* Location & Time */}
                <div className="mt-3 space-y-1 text-xs text-slate-500">
                  <div className="flex items-center gap-1.5 font-medium">
                    <MapPin className="size-3.5 text-brand-red shrink-0" />
                    <span className="truncate">{locationText}</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-medium text-slate-400">
                    <Clock className="size-3.5 shrink-0" />
                    <span>{new Date(incident.reportedAt || incident.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
              </div>

              {/* Footer Action Link */}
              <div className="mt-4 pt-3 border-t border-slate-100">
                <Link
                  href={`/incidents/${incident.id}`}
                  className="flex items-center justify-between text-xs font-extrabold text-brand-red group-hover:translate-x-0.5 transition"
                >
                  <span>View Details</span>
                  <ArrowRight className="size-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
