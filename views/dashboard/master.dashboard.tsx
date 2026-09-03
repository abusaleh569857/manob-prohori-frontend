"use client";

import dynamic from "next/dynamic";
import SummaryCards from "./components/SummaryCards";
import NotificationPanel from "./components/notification-panel";
import NearbyVolunteers from "./components/nearby-volunteers";
import NearbyAccidents from "./components/nearby-accidents";

const DashboardMap = dynamic(() => import("./components/dashboard-map"), {
  ssr: false,
  loading: () => (
    <div className="flex h-80 w-full flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
      <div className="size-6 animate-spin rounded-full border-2 border-brand-red border-t-transparent" />
      <span className="mt-3 text-xs font-bold text-slate-400">
        Loading Live Telemetry Map...
      </span>
    </div>
  ),
});

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* 1. Metric Overview Summary Cards */}
      <SummaryCards />

      {/* 2. Real-Time Telemetry Map & Alert Stream */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-[1.65fr_1fr]">
        <DashboardMap />
        <NotificationPanel />
      </section>

      {/* 3. Lower Section: Nearby Volunteers & Incident Feed */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <NearbyVolunteers />
        <NearbyAccidents />
      </section>
    </div>
  );
}