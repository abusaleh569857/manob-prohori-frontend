"use client";

import Link from "next/link";
import {
  Map as MapIcon,
  Radio,
  ArrowRight,
  Flame,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";
import { AdminStatCards } from "./components/AdminStatCards";
import { AdminIncidentCharts } from "./components/AdminIncidentCharts";
import { AdminPendingVerifications } from "./components/AdminPendingVerifications";
import { AdminRecentIncidents } from "./components/AdminRecentIncidents";
import { useGetAdminOverviewStatsQuery } from "@/redux/api/incidentApi";

export function MasterAdminOverviewComponent() {
  const { data: statsResponse, isLoading } = useGetAdminOverviewStatsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const stats = statsResponse?.data;
  const metrics = stats?.metrics;

  return (
    <div className="space-y-6">
      {/* 1. Key Performance & Status Metric Cards (Live Backend Counts) */}
      <AdminStatCards metrics={metrics} />

      {/* 2. Tactical GIS Crisis Radar Launch Banner (Quick Link) */}
      <div className="relative overflow-hidden rounded-3xl border-2 border-red-500/80 bg-linear-to-r from-red-600 via-brand-red to-red-700 p-6 text-white shadow-xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between relative z-10">
          <div className="flex items-center gap-4">
            <div className="grid size-14 place-items-center rounded-2xl bg-white/20 text-white backdrop-blur-xs shadow-inner">
              <MapIcon className="size-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-white px-2.5 py-0.5 text-[10px] font-black uppercase text-brand-red">
                  <Radio className="inline-block size-2.5 mr-1 animate-pulse" /> Live Telemetry
                </span>
                <span className="text-xs font-mono font-bold text-red-100">
                  Command Center Radar
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-black mt-1 text-white leading-tight">
                National Emergency Crisis Heatmap &amp; Tactical GIS Radar
              </h2>
              <p className="text-xs sm:text-sm text-red-100 mt-0.5 max-w-xl font-medium">
                Live nationwide emergency clusters, red-zone heatmaps, 8 division crisis rankings, and 1-click volunteer dispatching.
              </p>
            </div>
          </div>

          <Link
            href="/admin/crisis-map"
            className="flex items-center justify-center gap-2 rounded-2xl bg-white px-6 py-3.5 text-xs sm:text-sm font-black text-brand-red hover:bg-red-50 transition shadow-lg shadow-black/10 cursor-pointer shrink-0"
          >
            <span>Open Full GIS Radar</span>
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>

      {/* 3. Interactive Charts Section (Live Categories & Severities) */}
      <AdminIncidentCharts
        categoryBreakdown={stats?.categoryBreakdown}
        severityDistribution={stats?.severityDistribution}
      />

      {/* 4. Active Incident Triage & Pending Verifications Stream */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <AdminRecentIncidents />
        <AdminPendingVerifications />
      </section>
    </div>
  );
}
