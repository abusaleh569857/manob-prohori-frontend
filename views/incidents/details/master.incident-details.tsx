"use client";

import Link from "next/link";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  AlertTriangle,
  Siren,
  Phone,
  ExternalLink,
  ShieldCheck,
  Loader2,
} from "lucide-react";
import {
  useGetIncidentByIdQuery,
  useGetIncidentHistoryQuery,
} from "@/redux/api/incidentApi";
import { IncidentStatusTimeline } from "./components/incident-status-timeline";

interface MasterIncidentDetailsProps {
  incidentId: string;
}

const severityBadgeStyles: Record<string, string> = {
  LOW: "bg-slate-100 text-slate-700 border-slate-200",
  MEDIUM: "bg-blue-50 text-blue-700 border-blue-200",
  HIGH: "bg-orange-50 text-orange-700 border-orange-200",
  CRITICAL: "bg-red-50 text-red-700 border-red-200 animate-pulse",
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

export function MasterIncidentDetailsComponent({
  incidentId,
}: MasterIncidentDetailsProps) {
  const { data: incidentResponse, isLoading, error } =
    useGetIncidentByIdQuery(incidentId);
  const { data: historyResponse } = useGetIncidentHistoryQuery(incidentId);

  const incident = incidentResponse?.data;
  const history = historyResponse?.data || [];

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="size-8 animate-spin text-red-600" />
          <p className="text-xs font-semibold text-slate-500">
            Loading incident details...
          </p>
        </div>
      </div>
    );
  }

  if (error || !incident) {
    return (
      <div className="mx-auto max-w-2xl py-12 px-4 text-center">
        <div className="grid size-12 mx-auto place-items-center rounded-full bg-red-100 text-red-600">
          <AlertTriangle className="size-6" />
        </div>
        <h2 className="mt-4 text-lg font-bold text-slate-900">
          Incident Not Found
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          The requested emergency incident does not exist or you do not have permission to view it.
        </p>
        <Link
          href="/"
          className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-red-600 hover:underline"
        >
          <ArrowLeft className="size-3.5" /> Return Home
        </Link>
      </div>
    );
  }

  const mapUrl = `https://www.google.com/maps?q=${incident.latitude},${incident.longitude}`;

  return (
    <div className="min-h-screen bg-[#f4f6f8] py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link
            href="/incidents/my"
            className="flex items-center gap-1.5 text-xs font-bold text-slate-600 transition hover:text-red-600"
          >
            <ArrowLeft className="size-4" />
            Back to My Reports
          </Link>

          <Link
            href="/incidents/create"
            className="flex items-center gap-1 text-xs font-bold text-red-600 hover:underline"
          >
            + Report Another Emergency
          </Link>
        </div>

        {/* Main Incident Overview Card */}
        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm">
          {/* Header Badges & Category */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="rounded-xl bg-red-100 px-3 py-1 text-xs font-black text-red-600">
                {incident.categoryName}
              </span>
              <span
                className={`rounded-xl border px-3 py-1 text-xs font-bold uppercase tracking-wider ${
                  severityBadgeStyles[incident.severity] || "bg-slate-100"
                }`}
              >
                {incident.severity} SEVERITY
              </span>
            </div>

            <span
              className={`rounded-full border px-3.5 py-1 text-xs font-extrabold tracking-wide uppercase ${
                statusBadgeStyles[incident.status] || "bg-slate-100"
              }`}
            >
              ● {incident.status.replaceAll("_", " ")}
            </span>
          </div>

          {/* Title and Description */}
          <h1 className="mt-4 text-2xl font-black text-[#10233f] sm:text-3xl">
            {incident.title}
          </h1>

          <p className="mt-3 text-sm leading-relaxed text-slate-700 whitespace-pre-wrap font-medium">
            {incident.description}
          </p>

          {/* Location & Time Grid */}
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 rounded-2xl border border-slate-100 bg-slate-50/70 p-4.5">
            {/* Location */}
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                <MapPin className="size-4 text-red-500 shrink-0" />
                Location
              </div>
              <p className="text-xs text-slate-600 font-medium">
                {incident.addressText || incident.areaName || "Location coordinates provided"}
                {incident.district ? `, ${incident.district}` : ""}
              </p>
              <a
                href={mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 inline-flex items-center gap-1 text-[11px] font-bold text-red-600 hover:underline"
              >
                View on Google Maps ({incident.latitude.toFixed(4)}, {incident.longitude.toFixed(4)})
                <ExternalLink className="size-3" />
              </a>
            </div>

            {/* Time Reported */}
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                <Calendar className="size-4 text-blue-500 shrink-0" />
                Reported Time
              </div>
              <p className="text-xs text-slate-600 font-medium">
                {new Date(incident.reportedAt).toLocaleString(undefined, {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </p>
              {incident.reporterPhone && (
                <div className="flex items-center gap-1 text-[11px] text-slate-500">
                  <Phone className="size-3" /> Reporter: {incident.reporterName || "Anonymous"} ({incident.reporterPhone})
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Status History Timeline Card */}
        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm">
          <IncidentStatusTimeline
            history={history}
            currentStatus={incident.status}
          />
        </div>
      </div>
    </div>
  );
}
