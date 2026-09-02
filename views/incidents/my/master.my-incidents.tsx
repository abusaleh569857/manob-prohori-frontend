"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Siren,
  MapPin,
  Calendar,
  AlertTriangle,
  ChevronRight,
  Loader2,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGetMyIncidentsQuery } from "@/redux/api/incidentApi";
import type { Incident } from "@/types/incident.types";

const severityBadgeStyles: Record<string, string> = {
  LOW: "bg-slate-100 text-slate-700",
  MEDIUM: "bg-blue-50 text-blue-700",
  HIGH: "bg-orange-50 text-orange-700",
  CRITICAL: "bg-red-50 text-red-700 font-black",
};

const statusBadgeStyles: Record<string, string> = {
  REPORTED: "bg-yellow-50 text-yellow-800 border-yellow-200",
  VERIFIED: "bg-blue-50 text-blue-800 border-blue-200",
  DISPATCHING: "bg-purple-50 text-purple-800 border-purple-200",
  RESPONDER_ASSIGNED: "bg-indigo-50 text-indigo-800 border-indigo-200",
  IN_PROGRESS: "bg-orange-50 text-orange-800 border-orange-200",
  RESOLVED: "bg-emerald-50 text-emerald-800 border-emerald-200",
  CANCELLED: "bg-slate-100 text-slate-600 border-slate-200",
  REJECTED: "bg-red-50 text-red-800 border-red-200",
};

export function MasterMyIncidentsComponent() {
  const router = useRouter();
  const { data: response, isLoading, error } = useGetMyIncidentsQuery();
  const incidents = response?.data || [];

  return (
    <div className="min-h-screen bg-brand-canvas py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex items-center gap-1.5 text-xs font-bold text-brand-text-secondary transition hover:text-brand-red cursor-pointer"
          >
            <ArrowLeft className="size-4" />
            Back
          </button>

          <Link href="/incidents/create">
            <Button
              size="sm"
              className="flex items-center gap-1.5 rounded-xl bg-brand-red px-4 text-xs font-bold text-white shadow-md shadow-brand-red/20 hover:bg-brand-red-dark"
            >
              <Plus className="size-3.5" />
              Report Emergency
            </Button>
          </Link>
        </div>

        {/* Header Title */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-brand-navy">
            My Emergency Reports
          </h1>
          <p className="mt-1 text-xs text-brand-text-secondary font-medium">
            Track status, responder assignments, and resolution progress for incidents you reported.
          </p>
        </div>

        {/* Content Area */}
        {isLoading ? (
          <div className="flex min-h-[40vh] items-center justify-center">
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="size-8 animate-spin text-brand-red" />
              <p className="text-xs font-semibold text-brand-text-muted">
                Loading your reports...
              </p>
            </div>
          </div>
        ) : incidents.length === 0 ? (
          <div className="rounded-3xl border border-brand-border bg-brand-surface p-10 text-center shadow-xs">
            <div className="grid size-12 mx-auto place-items-center rounded-2xl bg-brand-red-soft text-brand-red">
              <Siren className="size-6" />
            </div>
            <h3 className="mt-3 text-base font-bold text-brand-navy">
              No emergency incidents reported yet
            </h3>
            <p className="mt-1 text-xs text-brand-text-secondary">
              When you report an emergency, you will be able to monitor live status and response history here.
            </p>
            <Link href="/incidents/create" className="mt-5 inline-block">
              <Button className="rounded-xl bg-brand-red px-5 text-xs font-bold text-white shadow-md shadow-brand-red/20 hover:bg-brand-red-dark">
                Report an Emergency Now
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3.5">
            {incidents.map((inc: Incident) => (
              <Link
                key={inc.id}
                href={`/incidents/${inc.id}`}
                className="group block rounded-3xl border border-brand-border bg-brand-surface p-5 shadow-xs transition hover:border-brand-red/40 hover:shadow-md"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="space-y-1.5">
                    {/* Badges */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-lg bg-brand-red-soft px-2.5 py-0.5 text-[11px] font-black text-brand-red">
                        {inc.categoryName}
                      </span>
                      <span
                        className={`rounded-lg px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                          severityBadgeStyles[inc.severity] || "bg-slate-100"
                        }`}
                      >
                        {inc.severity}
                      </span>
                      <span
                        className={`rounded-full border px-2.5 py-0.5 text-[10px] font-extrabold uppercase ${
                          statusBadgeStyles[inc.status] || "bg-slate-100"
                        }`}
                      >
                        ● {inc.status.replaceAll("_", " ")}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-base font-bold text-brand-navy group-hover:text-brand-red transition-colors">
                      {inc.title}
                    </h3>

                    {/* Metadata: Location and Date */}
                    <div className="flex flex-wrap items-center gap-4 text-xs text-brand-text-secondary font-medium pt-0.5">
                      <div className="flex items-center gap-1">
                        <MapPin className="size-3.5 text-brand-text-muted" />
                        <span>
                          {inc.addressText || inc.areaName || "Coordinates provided"}
                          {inc.district ? `, ${inc.district}` : ""}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="size-3.5 text-brand-text-muted" />
                        <span>
                          {new Date(inc.reportedAt).toLocaleDateString([], {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-xs font-bold text-brand-text-muted group-hover:text-brand-red transition-colors shrink-0">
                    <span>View Details</span>
                    <ChevronRight className="size-4" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
