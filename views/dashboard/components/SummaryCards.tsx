"use client";

import {
  AlertTriangle,
  Users,
  Ambulance,
  FileCheck2,
  Radio,
} from "lucide-react";
import { cn } from "@/lib/utils";

const summaryCards = [
  {
    title: "Active Emergencies",
    value: "5",
    subtitle: "2 Critical · 3 In Progress",
    trend: "+2 New Dispatches",
    icon: AlertTriangle,
    iconBg: "bg-red-50 text-brand-red ring-1 ring-red-200 shadow-xs",
    badgeBg: "bg-red-50 text-brand-red border border-red-200",
  },
  {
    title: "Verified Responders",
    value: "14",
    subtitle: "10 Online · 4 On Duty",
    trend: "Live Active",
    icon: Users,
    iconBg: "bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200 shadow-xs",
    badgeBg: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  },
  {
    title: "Nearby Medical Units",
    value: "8",
    subtitle: "Hospitals & Ambulances",
    trend: "< 2.5 km Radius",
    icon: Ambulance,
    iconBg: "bg-blue-50 text-blue-600 ring-1 ring-blue-200 shadow-xs",
    badgeBg: "bg-blue-50 text-blue-700 border border-blue-200",
  },
  {
    title: "Dispatched Reports",
    value: "28",
    subtitle: "85% Incident Resolution Rate",
    trend: "+12% Resolved",
    icon: FileCheck2,
    iconBg: "bg-purple-50 text-purple-600 ring-1 ring-purple-200 shadow-xs",
    badgeBg: "bg-purple-50 text-purple-700 border border-purple-200",
  },
];

export default function SummaryCards() {
  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {summaryCards.map((card) => {
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
              <p className="mt-1.5 text-3xl font-black text-brand-navy tracking-tight">
                {card.value}
              </p>
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