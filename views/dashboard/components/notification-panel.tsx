"use client";

import Link from "next/link";
import {
  Bell,
  MapPin,
  Clock,
  AlertTriangle,
  Flame,
  HeartPulse,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const notifications = [
  {
    id: 1,
    type: "Road Traffic Accident",
    description: "Multiple vehicle collision reported near Dhanmondi 27 bridge.",
    location: "Dhanmondi, Dhaka",
    time: "5 mins ago",
    severity: "CRITICAL",
    icon: AlertTriangle,
    iconBg: "bg-red-50 text-brand-red border-red-200 ring-4 ring-red-50/50",
  },
  {
    id: 2,
    type: "Fire Emergency",
    description: "Electrical short circuit smoke noticed on 4th floor.",
    location: "Kalabagan, Dhaka",
    time: "14 mins ago",
    severity: "HIGH",
    icon: Flame,
    iconBg: "bg-amber-50 text-amber-600 border-amber-200 ring-4 ring-amber-50/50",
  },
  {
    id: 3,
    type: "Emergency Blood Requirement",
    description: "Immediate O+ blood donors needed at Square Hospital.",
    location: "Panthapath, Dhaka",
    time: "28 mins ago",
    severity: "URGENT",
    icon: HeartPulse,
    iconBg: "bg-rose-50 text-rose-600 border-rose-200 ring-4 ring-rose-50/50",
  },
];

export default function NotificationPanel() {
  return (
    <div className="flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white/90 p-5 sm:p-6 backdrop-blur-xl shadow-xs">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-brand-navy">
              Live Alert Notifications
            </h3>
            <p className="text-xs sm:text-[13px] text-slate-500 font-medium mt-0.5">
              Dispatched emergency broadcasts in your vicinity
            </p>
          </div>
          <div className="grid size-9 place-items-center rounded-xl bg-slate-100/80 text-slate-600">
            <Bell className="size-4.5 text-brand-red" />
          </div>
        </div>

        {/* Notifications Stream */}
        <div className="mt-4 space-y-3">
          {notifications.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className="group relative rounded-xl border border-slate-100 bg-slate-50/70 p-3.5 transition hover:border-slate-200 hover:bg-white hover:shadow-xs"
              >
                <div className="flex items-start gap-3.5">
                  <div className={cn("grid size-9.5 shrink-0 place-items-center rounded-xl border shadow-2xs mt-0.5", item.iconBg)}>
                    <Icon className="size-4.5" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-[13.5px] font-bold text-brand-navy group-hover:text-brand-red transition">
                        {item.type}
                      </p>
                      <span className="text-[10px] font-black uppercase text-brand-red bg-red-50 px-2 py-0.5 rounded-md border border-red-200">
                        {item.severity}
                      </span>
                    </div>

                    <p className="mt-1 text-xs text-slate-600 leading-relaxed line-clamp-2">
                      {item.description}
                    </p>

                    <div className="mt-2.5 flex items-center justify-between text-xs font-medium text-slate-400">
                      <span className="flex items-center gap-1.5">
                        <MapPin className="size-3.5 text-slate-400" />
                        {item.location}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="size-3.5 text-slate-400" />
                        {item.time}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* View All Action */}
      <div className="mt-4 pt-3.5 border-t border-slate-100">
        <Link
          href="/incidents/my"
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50/80 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100 hover:text-brand-navy transition shadow-2xs"
        >
          <span>View All Dispatches</span>
          <ChevronRight className="size-4" />
        </Link>
      </div>
    </div>
  );
}