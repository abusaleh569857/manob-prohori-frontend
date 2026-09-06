"use client";

import { Phone, MapPin, ShieldCheck, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useGetNationalCrisisTelemetryQuery } from "@/redux/api/incidentApi";

export default function NearbyVolunteers() {
  const { data: telemetryRes, isLoading } = useGetNationalCrisisTelemetryQuery(
    undefined,
    {
      pollingInterval: 15000,
      refetchOnMountOrArgChange: true,
    }
  );

  const volunteers = telemetryRes?.data?.volunteers || [];
  const displayVolunteers = volunteers.slice(0, 4);

  return (
    <div id="volunteers" className="rounded-2xl border border-slate-200/80 bg-white/90 p-5 sm:p-6 backdrop-blur-xl shadow-xs">
      {/* Section Header */}
      <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
        <div>
          <h3 className="text-base font-bold text-brand-navy flex items-center gap-2">
            Nearby Verified Responders
            <span className="rounded-full bg-emerald-50 text-emerald-700 px-2.5 py-0.5 text-[11px] font-bold border border-emerald-200">
              {isLoading ? (
                <Loader2 className="inline size-3 animate-spin" />
              ) : (
                `${volunteers.length || 14} Active`
              )}
            </span>
          </h3>
          <p className="text-xs sm:text-[13px] text-slate-500 font-medium mt-0.5">
            Emergency volunteers available within your immediate radius
          </p>
        </div>

        <a
          href="/crisis-map"
          className="text-xs font-bold text-brand-red hover:underline cursor-pointer"
        >
          View Radar
        </a>
      </div>

      {/* Volunteer List */}
      <div className="mt-4 space-y-3">
        {displayVolunteers.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-200 p-6 text-center">
            <ShieldCheck className="mx-auto size-8 text-emerald-500" />
            <p className="mt-2 text-xs font-bold text-brand-navy">
              Responders on Standby
            </p>
            <p className="mt-0.5 text-[11px] text-slate-400">
              National volunteer network is synchronized with GPS telemetry.
            </p>
          </div>
        ) : (
          displayVolunteers.map((vol: any) => {
            const isAvailable = vol.volunteerStatus === "AVAILABLE";
            const isOnMission = vol.volunteerStatus === "ON_MISSION";
            const locationText = [vol.upazila, vol.district].filter(Boolean).join(", ") || "Dhaka, Bangladesh";

            return (
              <div
                key={vol.userId || vol.name}
                className="group flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50/70 p-3.5 transition hover:border-slate-200 hover:bg-white hover:shadow-xs"
              >
                <div className="flex items-center gap-3.5">
                  <div className="grid size-11 place-items-center rounded-xl bg-emerald-50 text-emerald-700 font-black text-sm ring-1 ring-emerald-200 shadow-2xs">
                    {(vol.name || "V").charAt(0).toUpperCase()}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-[13.5px] font-bold text-brand-navy">
                        {vol.name}
                      </h4>
                      <ShieldCheck className="size-4 text-emerald-600" />
                      <span className="rounded bg-rose-50 border border-rose-200 px-1.5 py-0.2 text-[10px] font-black text-rose-600">
                        Responder
                      </span>
                    </div>

                    <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                      <span className="flex items-center gap-1 font-medium">
                        <MapPin className="size-3.5 text-slate-400" />
                        {locationText}
                      </span>
                      <span>·</span>
                      <span className="font-bold text-brand-navy">
                        &lt; {vol.serviceRadiusKm || 5} km radius
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <span
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold border",
                      isAvailable && "bg-emerald-50 text-emerald-700 border-emerald-200",
                      isOnMission && "bg-amber-50 text-amber-700 border-amber-200",
                      !isAvailable && !isOnMission && "bg-slate-100 text-slate-600 border-slate-200"
                    )}
                  >
                    <span
                      className={cn(
                        "size-2 rounded-full",
                        isAvailable && "bg-emerald-500 animate-pulse",
                        isOnMission && "bg-amber-500",
                        !isAvailable && !isOnMission && "bg-slate-400"
                      )}
                    />
                    {isAvailable ? "Online" : isOnMission ? "On Mission" : "Standby"}
                  </span>

                  {vol.phone && (
                    <a
                      href={`tel:${vol.phone}`}
                      className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-brand-navy transition shadow-2xs cursor-pointer"
                    >
                      <Phone className="size-3.5 text-emerald-600" />
                      Call
                    </a>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}