"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import {
  Map as MapIcon,
  Radio,
  AlertTriangle,
  Layers,
  ArrowLeft,
  ShieldCheck,
  Flame,
} from "lucide-react";

const AdminLiveIncidentMap = dynamic(
  () =>
    import("../overview/components/AdminLiveIncidentMap").then(
      (mod) => mod.AdminLiveIncidentMap
    ),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[500px] w-full flex-col items-center justify-center rounded-3xl border border-slate-200 bg-white p-8 shadow-xs">
        <div className="size-8 animate-spin rounded-full border-3 border-brand-red border-t-transparent" />
        <span className="mt-3 text-sm font-bold text-slate-500">
          Loading National GIS Crisis Telemetry &amp; Heatmap...
        </span>
      </div>
    ),
  }
);

export function MasterAdminCrisisMapComponent() {
  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col gap-4 rounded-3xl border border-slate-200/90 bg-white/95 p-6 backdrop-blur-xl shadow-xs sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="grid size-14 place-items-center rounded-2xl bg-brand-red-soft text-brand-red border border-red-200 shadow-2xs">
            <MapIcon className="size-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-brand-navy tracking-tight">
                National Crisis Map &amp; GIS Radar
              </h1>
              <span className="rounded-full bg-red-50 border border-red-200 px-2.5 py-0.5 text-xs font-extrabold text-brand-red">
                <Radio className="inline-block size-3 mr-1 animate-pulse" />
                Command Center
              </span>
            </div>
            <p className="mt-0.5 text-xs sm:text-[13px] font-medium text-slate-500">
              Interactive nationwide incident clusters, red-zone disaster heatmaps, volunteer density &amp; division crisis ranking.
            </p>
          </div>
        </div>

        {/* Quick Links */}
        <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-center">
          <Link
            href="/admin/incidents"
            className="flex items-center gap-1.5 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-bold text-brand-navy hover:bg-slate-100 transition shadow-2xs"
          >
            <AlertTriangle className="size-4 text-brand-red" />
            <span>Incident Triage Console</span>
          </Link>

          <Link
            href="/admin/dashboard"
            className="flex items-center gap-1.5 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 transition shadow-2xs"
          >
            <ArrowLeft className="size-4" />
            <span>Overview &amp; Analytics</span>
          </Link>
        </div>
      </div>

      {/* Main Full GIS Map & Telemetry Dashboard */}
      <AdminLiveIncidentMap />
    </div>
  );
}
