"use client";

import Link from "next/link";
import {
  AlertTriangle,
  Flame,
  HeartPulse,
  MapPin,
  Clock,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const accidents = [
  {
    id: 1,
    type: "Road Traffic Accident",
    description: "Bike and private car collision reported. Paramedics dispatched to scene.",
    location: "Dhanmondi 27, Dhaka",
    status: "pending",
    severity: "CRITICAL",
    time: "5 mins ago",
    icon: AlertTriangle,
    iconBg: "bg-red-50 text-brand-red border-red-200 ring-4 ring-red-50/50",
  },
  {
    id: 2,
    type: "Commercial Fire Alarm",
    description: "Smoke emerging from electrical unit. Fire response notified.",
    location: "Kalabagan Bus Stand, Dhaka",
    status: "active",
    severity: "HIGH",
    time: "12 mins ago",
    icon: Flame,
    iconBg: "bg-amber-50 text-amber-600 border-amber-200 ring-4 ring-amber-50/50",
  },
  {
    id: 3,
    type: "Medical Emergency",
    description: "Cardiac patient requires immediate oxygen support and transport.",
    location: "Mohammadpur, Dhaka",
    status: "resolved",
    severity: "MEDIUM",
    time: "25 mins ago",
    icon: HeartPulse,
    iconBg: "bg-emerald-50 text-emerald-600 border-emerald-200 ring-4 ring-emerald-50/50",
  },
];

export default function NearbyAccidents() {
  return (
    <div id="incidents" className="rounded-2xl border border-slate-200/80 bg-white/90 p-5 sm:p-6 backdrop-blur-xl shadow-xs">
      {/* Section Header */}
      <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
        <div>
          <h3 className="text-base font-bold text-brand-navy flex items-center gap-2">
            Recent Nearby Incidents
            <span className="rounded-full bg-red-50 text-brand-red px-2.5 py-0.5 text-[11px] font-bold border border-red-200">
              5 Active
            </span>
          </h3>
          <p className="text-xs sm:text-[13px] text-slate-500 font-medium mt-0.5">
            Emergency dispatches currently tracked by response teams
          </p>
        </div>

        <Link
          href="/incidents/my"
          className="text-xs font-bold text-brand-red hover:underline"
        >
          View All
        </Link>
      </div>

      {/* Incident List */}
      <div className="mt-4 space-y-3">
        {accidents.map((incident) => {
          const Icon = incident.icon;
          return (
            <div
              key={incident.id}
              className="group flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50/70 p-3.5 transition hover:border-slate-200 hover:bg-white hover:shadow-xs"
            >
              <div className="flex items-start gap-3.5 min-w-0 flex-1">
                <div
                  className={cn(
                    "grid size-10.5 shrink-0 place-items-center rounded-xl border shadow-2xs mt-0.5",
                    incident.iconBg
                  )}
                >
                  <Icon className="size-5" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-[13.5px] font-bold text-brand-navy group-hover:text-brand-red transition">
                      {incident.type}
                    </h4>
                    <span
                      className={cn(
                        "rounded px-2 py-0.5 text-[10px] font-black uppercase border",
                        incident.status === "pending" &&
                          "bg-red-50 text-brand-red border-red-200",
                        incident.status === "active" &&
                          "bg-amber-50 text-amber-700 border-amber-200",
                        incident.status === "resolved" &&
                          "bg-emerald-50 text-emerald-700 border-emerald-200"
                      )}
                    >
                      {incident.status === "pending"
                        ? "Urgent"
                        : incident.status === "active"
                        ? "In Progress"
                        : "Resolved"}
                    </span>
                  </div>

                  <p className="mt-1 text-xs text-slate-600 line-clamp-1">
                    {incident.description}
                  </p>

                  <div className="mt-2 flex items-center gap-3 text-xs font-medium text-slate-400">
                    <span className="flex items-center gap-1">
                      <MapPin className="size-3.5 text-slate-400" />
                      {incident.location}
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Clock className="size-3.5 text-slate-400" />
                      {incident.time}
                    </span>
                  </div>
                </div>
              </div>

              <Link
                href={`/incidents/${incident.id}`}
                className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-brand-navy transition shadow-2xs shrink-0"
              >
                <span>Details</span>
                <ChevronRight className="size-3.5 text-slate-400" />
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}