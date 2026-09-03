"use client";

import { useState } from "react";
import { PhoneCall, ShieldAlert, Ambulance, Flame, Shield, Plus, Phone } from "lucide-react";
import { cn } from "@/lib/utils";

const emergencyDirectories = [
  {
    id: 1,
    name: "National Emergency Helpline (999)",
    serviceType: "NATIONAL_EMERGENCY",
    hotline: "999",
    coverage: "Nationwide (All 64 Districts)",
    icon: ShieldAlert,
    iconBg: "bg-red-50 text-brand-red border-red-200",
  },
  {
    id: 2,
    name: "Fire Service & Civil Defense Central Control",
    serviceType: "FIRE",
    hotline: "+8802223355555",
    coverage: "Central Command, Dhaka",
    icon: Flame,
    iconBg: "bg-amber-50 text-amber-600 border-amber-200",
  },
  {
    id: 3,
    name: "Red Crescent Emergency Ambulance Service",
    serviceType: "AMBULANCE",
    hotline: "+8801811458524",
    coverage: "Dhaka Metropolitan Area",
    icon: Ambulance,
    iconBg: "bg-emerald-50 text-emerald-600 border-emerald-200",
  },
  {
    id: 4,
    name: "Dhaka Metropolitan Police (DMP) Control",
    serviceType: "POLICE",
    hotline: "+8802996688888",
    coverage: "Dhaka City Zone",
    icon: Shield,
    iconBg: "bg-blue-50 text-brand-blue border-blue-200",
  },
];

export function MasterAdminEmergencyServicesComponent() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-black text-brand-navy tracking-tight sm:text-2xl">
            Emergency Hotlines & Agency Directory
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Maintain national hotline numbers, police, ambulance, and fire control agency contacts
          </p>
        </div>

        <button className="flex items-center gap-1.5 rounded-xl bg-brand-red px-3.5 py-2 text-xs font-bold text-white shadow-xs hover:bg-brand-red-dark transition cursor-pointer">
          <Plus className="size-4" />
          Add Emergency Contact
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {emergencyDirectories.map((dir) => {
          const Icon = dir.icon;
          return (
            <div
              key={dir.id}
              className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs transition hover:border-slate-300 hover:shadow-md"
            >
              <div className="flex items-start gap-3.5">
                <div className={cn("grid size-12 shrink-0 place-items-center rounded-2xl border shadow-2xs", dir.iconBg)}>
                  <Icon className="size-6" />
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-bold text-brand-navy">
                    {dir.name}
                  </h3>
                  <p className="mt-1 text-xs text-slate-500 font-medium">
                    Coverage: {dir.coverage}
                  </p>

                  <div className="mt-3 flex items-center justify-between">
                    <a
                      href={`tel:${dir.hotline}`}
                      className="flex items-center gap-1.5 rounded-xl bg-slate-100 px-3 py-1.5 text-xs font-mono font-bold text-brand-navy hover:bg-brand-red-soft hover:text-brand-red transition"
                    >
                      <Phone className="size-3.5 text-brand-red" />
                      <span>{dir.hotline}</span>
                    </a>

                    <button className="text-xs font-bold text-slate-500 hover:text-brand-navy transition cursor-pointer">
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
