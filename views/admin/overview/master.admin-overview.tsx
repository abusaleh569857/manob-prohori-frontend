"use client";

import dynamic from "next/dynamic";
import { AdminStatCards } from "./components/AdminStatCards";
import { AdminIncidentCharts } from "./components/AdminIncidentCharts";
import { AdminPendingVerifications } from "./components/AdminPendingVerifications";
import { AdminRecentIncidents } from "./components/AdminRecentIncidents";
import { useGetAdminOverviewStatsQuery } from "@/redux/api/incidentApi";

const AdminLiveIncidentMap = dynamic(
  () =>
    import("./components/AdminLiveIncidentMap").then(
      (mod) => mod.AdminLiveIncidentMap
    ),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 w-full flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
        <div className="size-6 animate-spin rounded-full border-2 border-brand-red border-t-transparent" />
        <span className="mt-3 text-xs font-bold text-slate-400">
          Loading National Dispatch Map...
        </span>
      </div>
    ),
  }
);

export function MasterAdminOverviewComponent() {
  const { data: statsResponse, isLoading } = useGetAdminOverviewStatsQuery(undefined, {
    pollingInterval: 10000,
  });

  const stats = statsResponse?.data;

  return (
    <div className="space-y-6">
      {/* 1. Key Performance & Status Metric Cards (Live Backend Counts) */}
      <AdminStatCards metrics={stats?.metrics} />

      {/* 2. Interactive Charts Section (Live Categories & Severities) */}
      <AdminIncidentCharts
        categoryBreakdown={stats?.categoryBreakdown}
        severityDistribution={stats?.severityDistribution}
      />

      {/* 3. National Geospatial Dispatch Map */}
      <AdminLiveIncidentMap />

      {/* 4. Active Incident Triage & Pending Verifications Stream */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <AdminRecentIncidents />
        <AdminPendingVerifications />
      </section>
    </div>
  );
}
