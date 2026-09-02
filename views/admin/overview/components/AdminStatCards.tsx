"use client";

import {
  AlertTriangle,
  Users,
  HeartPulse,
  HandHeart,
  ShieldCheck,
  Building2,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminStatCardsProps {
  metrics?: {
    totalIncidents: number;
    pendingVerification: number;
    activeDispatches: number;
    resolvedIncidents: number;
    criticalActive: number;
    verifiedVolunteers: number;
    verifiedDonors: number;
    totalHospitals: number;
  };
}

export function AdminStatCards({ metrics }: AdminStatCardsProps) {
  const cards = [
    {
      title: "Pending Verifications",
      value: metrics?.pendingVerification ?? 0,
      subtext: `${metrics?.activeDispatches ?? 0} Dispatches · ${metrics?.criticalActive ?? 0} Critical`,
      trend: "Live Triage",
      icon: AlertTriangle,
      iconBg: "bg-red-50 text-brand-red ring-1 ring-red-200",
      badgeBg: "bg-red-50 text-brand-red border border-red-200",
    },
    {
      title: "Active Emergencies",
      value: metrics?.activeDispatches ?? 0,
      subtext: `${metrics?.resolvedIncidents ?? 0} Resolved Total`,
      trend: "In Action",
      icon: ShieldCheck,
      iconBg: "bg-amber-50 text-amber-600 ring-1 ring-amber-200",
      badgeBg: "bg-amber-50 text-amber-700 border border-amber-200",
    },
    {
      title: "Verified Volunteers",
      value: metrics?.verifiedVolunteers ?? 0,
      subtext: "Field Responders Available",
      trend: "Ready 5km",
      icon: Users,
      iconBg: "bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200",
      badgeBg: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    },
    {
      title: "Blood Donors Registered",
      value: metrics?.verifiedDonors ?? 0,
      subtext: `${metrics?.totalHospitals ?? 0} Medical Emergency Hubs`,
      trend: "Live Network",
      icon: HeartPulse,
      iconBg: "bg-rose-50 text-rose-600 ring-1 ring-rose-200",
      badgeBg: "bg-rose-50 text-rose-700 border border-rose-200",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.title}
            className="group relative overflow-hidden rounded-2xl border border-slate-200/90 bg-white/90 p-5 backdrop-blur-xl shadow-xs transition hover:border-slate-300 hover:shadow-md"
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
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{card.title}</p>
              <p className="mt-1 text-3xl font-black text-brand-navy tracking-tight">
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
