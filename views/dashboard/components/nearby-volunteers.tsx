"use client";

import { Users, Phone, MapPin, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

const volunteers = [
  {
    id: 1,
    name: "Tanvir Hossain",
    badge: "Senior Volunteer",
    bloodGroup: "O+",
    location: "Dhanmondi, Dhaka",
    distance: "0.8 km away",
    status: "online",
    verified: true,
  },
  {
    id: 2,
    name: "Nusrat Jahan",
    badge: "Paramedic Volunteer",
    bloodGroup: "A+",
    location: "Kalabagan, Dhaka",
    distance: "1.4 km away",
    status: "on-duty",
    verified: true,
  },
  {
    id: 3,
    name: "Rakibul Islam",
    badge: "Rescue Responder",
    bloodGroup: "B+",
    location: "Mohammadpur, Dhaka",
    distance: "2.1 km away",
    status: "standby",
    verified: true,
  },
];

export default function NearbyVolunteers() {
  return (
    <div id="volunteers" className="rounded-2xl border border-slate-200/80 bg-white/90 p-5 sm:p-6 backdrop-blur-xl shadow-xs">
      {/* Section Header */}
      <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
        <div>
          <h3 className="text-base font-bold text-brand-navy flex items-center gap-2">
            Nearby Verified Responders
            <span className="rounded-full bg-emerald-50 text-emerald-700 px-2.5 py-0.5 text-[11px] font-bold border border-emerald-200">
              12 Active
            </span>
          </h3>
          <p className="text-xs sm:text-[13px] text-slate-500 font-medium mt-0.5">
            Emergency volunteers available within your immediate radius
          </p>
        </div>

        <button className="text-xs font-bold text-brand-red hover:underline cursor-pointer">
          View All
        </button>
      </div>

      {/* Volunteer List */}
      <div className="mt-4 space-y-3">
        {volunteers.map((vol) => (
          <div
            key={vol.id}
            className="group flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50/70 p-3.5 transition hover:border-slate-200 hover:bg-white hover:shadow-xs"
          >
            <div className="flex items-center gap-3.5">
              <div className="grid size-11 place-items-center rounded-xl bg-emerald-50 text-emerald-700 font-black text-sm ring-1 ring-emerald-200 shadow-2xs">
                {vol.name.charAt(0)}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-[13.5px] font-bold text-brand-navy">
                    {vol.name}
                  </h4>
                  {vol.verified && (
                    <ShieldCheck className="size-4 text-emerald-600" />
                  )}
                  <span className="rounded bg-rose-50 border border-rose-200 px-1.5 py-0.2 text-[10px] font-black text-rose-600">
                    {vol.bloodGroup}
                  </span>
                </div>

                <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                  <span className="flex items-center gap-1 font-medium">
                    <MapPin className="size-3.5 text-slate-400" />
                    {vol.location}
                  </span>
                  <span>·</span>
                  <span className="font-bold text-brand-navy">{vol.distance}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold border",
                  vol.status === "online" &&
                    "bg-emerald-50 text-emerald-700 border-emerald-200",
                  vol.status === "on-duty" &&
                    "bg-amber-50 text-amber-700 border-amber-200",
                  vol.status === "standby" &&
                    "bg-slate-100 text-slate-600 border-slate-200"
                )}
              >
                <span
                  className={cn(
                    "size-2 rounded-full",
                    vol.status === "online" && "bg-emerald-500 animate-pulse",
                    vol.status === "on-duty" && "bg-amber-500",
                    vol.status === "standby" && "bg-slate-400"
                  )}
                />
                {vol.status === "online"
                  ? "Online"
                  : vol.status === "on-duty"
                  ? "On Duty"
                  : "Standby"}
              </span>

              <button className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-brand-navy transition shadow-2xs cursor-pointer">
                <Phone className="size-3.5 text-emerald-600" />
                Contact
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}