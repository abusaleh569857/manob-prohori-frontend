"use client";

import { useState } from "react";
import Link from "next/link";
import { AlertTriangle, Flame, HeartPulse, MapPin, Clock, ArrowRight, Radio, Check, Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const mockOverviewIncidents = [
  {
    id: 101,
    category: "Road Traffic Accident",
    title: "Massive Truck and Bus Collision",
    location: "Dhanmondi 27 Bridge, Dhaka",
    severity: "CRITICAL",
    status: "REPORTED",
    time: "4 mins ago",
    reporterPhone: "+8801711223344",
    icon: AlertTriangle,
    iconBg: "bg-red-50 text-brand-red border-red-200 ring-4 ring-red-50/50",
  },
  {
    id: 102,
    category: "Commercial High-Rise Fire",
    title: "4-Story Building Fire Alarm",
    location: "Kalabagan Bus Stand, Dhaka",
    severity: "HIGH",
    status: "DISPATCHING",
    time: "18 mins ago",
    reporterPhone: "+8801819876543",
    icon: Flame,
    iconBg: "bg-amber-50 text-amber-600 border-amber-200 ring-4 ring-amber-50/50",
  },
  {
    id: 103,
    category: "Medical Trauma Dispatch",
    title: "Severe Chest Pain & Breathing Emergency",
    location: "Mohammadpur, Dhaka",
    severity: "HIGH",
    status: "IN_PROGRESS",
    time: "32 mins ago",
    reporterPhone: "+8801912345678",
    icon: HeartPulse,
    iconBg: "bg-rose-50 text-rose-600 border-rose-200 ring-4 ring-rose-50/50",
  },
];

export function AdminRecentIncidents() {
  const [incidents, setIncidents] = useState(mockOverviewIncidents);

  const handleVerify = (id: number) => {
    setIncidents((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: "DISPATCHING" } : item))
    );
    toast.success(`Incident #${id} Verified & Auto-Dispatched to 5km radius volunteers!`);
  };

  return (
    <div className="flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white/90 p-5 sm:p-6 backdrop-blur-xl shadow-xs">
      <div>
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-brand-navy flex items-center gap-2">
              Incoming Incidents Triage Queue
              <span className="rounded-full bg-red-50 text-brand-red border border-red-200 px-2.5 py-0.5 text-[11px] font-bold">
                <Radio className="inline-block size-2.5 mr-1 animate-pulse" />
                Live Feed
              </span>
            </h3>
            <p className="text-xs sm:text-[13px] text-slate-500 font-medium mt-0.5">
              Newly reported emergencies awaiting admin verification and responder dispatch
            </p>
          </div>
          <div className="grid size-9 place-items-center rounded-xl bg-slate-100/80 text-slate-600">
            <AlertTriangle className="size-4.5 text-brand-red" />
          </div>
        </div>

        <div className="mt-4 space-y-3">
          {incidents.map((inc) => {
            const Icon = inc.icon;
            const isPending = inc.status === "REPORTED";

            return (
              <div
                key={inc.id}
                className={cn(
                  "group rounded-xl border p-3.5 transition hover:border-slate-300 hover:bg-white hover:shadow-xs",
                  isPending ? "bg-red-50/30 border-red-200/80" : "bg-slate-50/70 border-slate-100"
                )}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    <div className={cn("grid size-10 shrink-0 place-items-center rounded-xl border shadow-2xs mt-0.5", inc.iconBg)}>
                      <Icon className="size-5" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-slate-400">
                          #{inc.id}
                        </span>
                        <h4 className="text-[13.5px] font-bold text-brand-navy group-hover:text-brand-red transition truncate">
                          {inc.category}
                        </h4>
                        <span
                          className={cn(
                            "rounded px-1.5 py-0.2 text-[10px] font-black uppercase border",
                            inc.severity === "CRITICAL" && "bg-red-50 text-brand-red border-red-200",
                            inc.severity === "HIGH" && "bg-amber-50 text-amber-700 border-amber-200"
                          )}
                        >
                          {inc.severity}
                        </span>
                        <span
                          className={cn(
                            "rounded-full px-2 py-0.2 text-[10px] font-bold border",
                            inc.status === "REPORTED" && "bg-purple-50 text-purple-700 border-purple-200 animate-pulse",
                            inc.status === "DISPATCHING" && "bg-amber-50 text-amber-700 border-amber-200",
                            inc.status === "IN_PROGRESS" && "bg-blue-50 text-brand-blue border-blue-200"
                          )}
                        >
                          {inc.status}
                        </span>
                      </div>

                      <p className="mt-1 text-xs text-slate-600 line-clamp-1">
                        {inc.title}
                      </p>

                      <div className="mt-1.5 flex items-center gap-3 text-xs text-slate-400 font-medium">
                        <span className="flex items-center gap-1">
                          <MapPin className="size-3.5 text-slate-400" />
                          {inc.location}
                        </span>
                        <span>·</span>
                        <span className="flex items-center gap-1">
                          <Clock className="size-3.5 text-slate-400" />
                          {inc.time}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 1-Click Fast Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    {inc.reporterPhone && (
                      <a
                        href={`tel:${inc.reporterPhone}`}
                        title="Call Reporter"
                        className="grid size-8.5 place-items-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 hover:text-emerald-700 transition"
                      >
                        <Phone className="size-3.5 text-emerald-600" />
                      </a>
                    )}

                    {inc.status === "REPORTED" ? (
                      <button
                        onClick={() => handleVerify(inc.id)}
                        className="flex items-center gap-1.5 rounded-xl bg-brand-red px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-brand-red-dark transition cursor-pointer"
                      >
                        <Check className="size-3.5" />
                        Verify & Dispatch
                      </button>
                    ) : (
                      <Link
                        href="/admin/incidents"
                        className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100 transition"
                      >
                        <span>Console</span>
                        <ArrowRight className="size-3 text-slate-400" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-4 pt-3.5 border-t border-slate-100">
        <Link
          href="/admin/incidents"
          className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50/80 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100 hover:text-brand-navy transition shadow-2xs"
        >
          <span>Open Full Incident Triage Console</span>
          <ArrowRight className="size-3.5" />
        </Link>
      </div>
    </div>
  );
}
