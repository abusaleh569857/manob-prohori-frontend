"use client";

import {
  AlertTriangle,
  Users,
  HeartPulse,
  HandHeart,
  TrendingUp,
  ShieldCheck,
  Building2,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminStatCardsProps {
  stats?: {
    totalIncidents: number;
    activeIncidents: number;
    resolvedIncidents: number;
    totalVolunteers: number;
    verifiedVolunteers: number;
    activeVolunteers: number;
    totalDonors: number;
    verifiedDonors: number;
    reliefRequestsCount: number;
    responseRatePercent: number;
  };
}

export function AdminStatCards({ stats }: AdminStatCardsProps) {
  const cards = [
    {
      title: "Active Emergencies",
      value: stats?.activeIncidents ?? 5,
      subtext: `${stats?.resolvedIncidents ?? 24} Resolved · 94% Resolution`,
      trend: "Live Triage",
      icon: AlertTriangle,
      iconBg: "bg-red-50 text-brand-red ring-1 ring-red-200",
      badgeBg: "bg-red-50 text-brand-red border border-red-200",
    },
    {
      title: "Verified Volunteers",
      value: stats?.verifiedVolunteers ?? 142,
      subtext: `${stats?.activeVolunteers ?? 38} Online Ready · 12 On Duty`,
      trend: "+8 this week",
      icon: Users,
      iconBg: "bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200",
      badgeBg: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    },
    {
      title: "Blood Donor Network",
      value: stats?.verifiedDonors ?? 86,
      subtext: "58 Available · All Blood Groups",
      trend: "98% Matched",
      icon: HeartPulse,
      iconBg: "bg-rose-50 text-rose-600 ring-1 ring-rose-200",
      badgeBg: "bg-rose-50 text-rose-700 border border-rose-200",
    },
    {
      title: "Relief Aid Applications",
      value: stats?.reliefRequestsCount ?? 19,
      subtext: "14 Verified & Published",
      trend: "Direct Aid",
      icon: HandHeart,
      iconBg: "bg-blue-50 text-brand-blue ring-1 ring-blue-200",
      badgeBg: "bg-blue-50 text-blue-700 border border-blue-200",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.title}
            className="group relative overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs transition hover:border-slate-300 hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <div
                className={cn(
                  "grid size-11 place-items-center rounded-2xl shadow-xs transition-transform group-hover:scale-105",
                  card.iconBg
                )}
              >
                <Icon className="size-5.5" />
              </div>
              <span
                className={cn(
                  "rounded-lg px-2 py-0.5 text-[10.5px] font-extrabold uppercase tracking-wide",
                  card.badgeBg
                )}
              >
                {card.trend}
              </span>
            </div>

            <div className="mt-4">
              <p className="text-xs font-bold text-slate-500">{card.title}</p>
              <p className="mt-1 text-2xl font-black text-brand-navy tracking-tight">
                {card.value}
              </p>
              <p className="mt-1 text-[11px] font-medium text-slate-400">
                {card.subtext}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
