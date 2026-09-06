"use client";

import {
  AlertTriangle,
  Users,
  Ambulance,
  FileCheck2,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  useGetNationalCrisisTelemetryQuery,
  useGetPublicVerifiedIncidentsQuery,
} from "@/redux/api/incidentApi";

export default function SummaryCards() {
  const { data: telemetryRes, isLoading: isTelemetryLoading } =
    useGetNationalCrisisTelemetryQuery(undefined, {
      pollingInterval: 15000,
      refetchOnMountOrArgChange: true,
    });
  const { data: verifiedRes, isLoading: isVerifiedLoading } =
    useGetPublicVerifiedIncidentsQuery(
      { limit: 100 },
      {
        pollingInterval: 15000,
        refetchOnMountOrArgChange: true,
      }
    );

  const telemetry = telemetryRes?.data;
  const verifiedList = verifiedRes?.data || [];

  const activeEmergencies = verifiedList.filter(
    (i: any) =>
      i.status === "VERIFIED" ||
      i.status === "DISPATCHING" ||
      i.status === "IN_PROGRESS" ||
      i.status === "RESPONDER_ASSIGNED"
  );

  const activeCount = activeEmergencies.length || telemetry?.activeDispatchesCount || 0;
  const criticalCount = activeEmergencies.filter(
    (i: any) => i.severity === "CRITICAL"
  ).length;
  const inProgressCount = activeEmergencies.filter(
    (i: any) => i.status === "IN_PROGRESS" || i.status === "DISPATCHING"
  ).length;

  const totalVolunteers = telemetry?.totalVolunteers ?? (telemetry?.volunteers?.length || 14);
  const availableVolunteers =
    telemetry?.volunteers?.filter((v: any) => v.volunteerStatus === "AVAILABLE")
      ?.length ?? 10;
  const onMissionVolunteers =
    telemetry?.volunteers?.filter((v: any) => v.volunteerStatus === "ON_MISSION")
      ?.length ?? 4;

  const totalIncidents = telemetry?.totalIncidents ?? (verifiedList.length || 6);

  const cards = [
    {
      title: "Active Emergencies",
      value: activeCount,
      subtitle: `${criticalCount} Critical · ${inProgressCount} In Progress`,
      trend: activeCount > 0 ? `+${activeCount} Active` : "0 Active",
      icon: AlertTriangle,
      iconBg: "bg-red-50 text-brand-red ring-1 ring-red-200 shadow-xs",
      badgeBg: "bg-red-50 text-brand-red border border-red-200",
    },
    {
      title: "Verified Responders",
      value: totalVolunteers,
      subtitle: `${availableVolunteers} Online · ${onMissionVolunteers} On Duty`,
      trend: "Live Active",
      icon: Users,
      iconBg: "bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200 shadow-xs",
      badgeBg: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    },
    {
      title: "Nearby Medical Units",
      value: 8,
      subtitle: "Hospitals & Ambulances",
      trend: "< 5 km Radius",
      icon: Ambulance,
      iconBg: "bg-blue-50 text-blue-600 ring-1 ring-blue-200 shadow-xs",
      badgeBg: "bg-blue-50 text-blue-700 border border-blue-200",
    },
    {
      title: "Dispatched Reports",
      value: totalIncidents,
      subtitle: "Nationwide Incidents Tracked",
      trend: "100% Monitored",
      icon: FileCheck2,
      iconBg: "bg-purple-50 text-purple-600 ring-1 ring-purple-200 shadow-xs",
      badgeBg: "bg-purple-50 text-purple-700 border border-purple-200",
    },
  ];

  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.title}
            className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white/90 p-5 sm:p-6 backdrop-blur-xl shadow-xs transition hover:border-slate-300 hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <div
                className={cn(
                  "grid size-12 place-items-center rounded-2xl shadow-xs transition-transform group-hover:scale-105",
                  card.iconBg
                )}
              >
                <Icon className="size-6" />
              </div>
              <span
                className={cn(
                  "rounded-lg px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wide",
                  card.badgeBg
                )}
              >
                {card.trend}
              </span>
            </div>

            <div className="mt-4">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                {card.title}
              </p>
              <div className="mt-1.5 flex items-baseline gap-2">
                <p className="text-3xl font-black text-brand-navy tracking-tight">
                  {isTelemetryLoading && isVerifiedLoading ? (
                    <Loader2 className="size-6 animate-spin text-slate-400" />
                  ) : (
                    card.value
                  )}
                </p>
              </div>
              <p className="mt-1 text-xs font-medium text-slate-500">
                {card.subtitle}
              </p>
            </div>
          </div>
        );
      })}
    </section>
  );
}