"use client";

import Link from "next/link";
import { AlertTriangle, Flame, HeartPulse, MapPin, Clock, ArrowRight, Radio, Check, Phone, ShieldCheck, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  useGetAllIncidentsQuery,
  useUpdateIncidentStatusMutation,
} from "@/redux/api/incidentApi";

export function AdminRecentIncidents() {
  const { data: apiResponse, isLoading, refetch } = useGetAllIncidentsQuery(
    { limit: 5 },
    { pollingInterval: 5000 }
  );
  const [updateStatusMutation] = useUpdateIncidentStatusMutation();

  const incidents = apiResponse?.data || [];

  const handleVerify = async (id: number | string) => {
    try {
      await updateStatusMutation({
        id,
        status: "DISPATCHING",
        note: "Verified by Admin on Overview Dashboard",
      }).unwrap();
      toast.success(`Incident #${id} Verified & Auto-Dispatched to 5km radius volunteers!`);
      refetch();
    } catch (e: any) {
      toast.error(e?.data?.message || "Failed to update incident.");
    }
  };

  const getCategoryIcon = (categoryName: string) => {
    const lower = (categoryName || "").toLowerCase();
    if (lower.includes("fire")) return Flame;
    if (lower.includes("blood") || lower.includes("medical")) return HeartPulse;
    if (lower.includes("accident") || lower.includes("traffic")) return AlertTriangle;
    return ShieldCheck;
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

        {isLoading ? (
          <div className="flex items-center justify-center p-10">
            <Loader2 className="size-6 animate-spin text-brand-red" />
          </div>
        ) : incidents.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs font-bold">
            No active emergencies in queue. All systems normal.
          </div>
        ) : (
          <div className="mt-4 space-y-3">
            {incidents.slice(0, 4).map((inc: any) => {
              const Icon = getCategoryIcon(inc.categoryName);
              const isPending = inc.status === "REPORTED";
              const locationText = inc.addressText || inc.areaName || inc.district || "Dhaka, Bangladesh";

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
                      <div className="grid size-10 shrink-0 place-items-center rounded-xl border shadow-2xs mt-0.5 bg-red-50 text-brand-red border-red-200 ring-4 ring-red-50/50">
                        <Icon className="size-5" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-slate-400">
                            #{inc.id}
                          </span>
                          <h4 className="text-[13.5px] font-bold text-brand-navy group-hover:text-brand-red transition truncate">
                            {inc.title}
                          </h4>
                          <span
                            className={cn(
                              "rounded px-1.5 py-0.2 text-[10px] font-black uppercase border",
                              inc.severity === "CRITICAL" && "bg-red-50 text-brand-red border-red-200",
                              inc.severity === "HIGH" && "bg-amber-50 text-amber-700 border-amber-200",
                              inc.severity === "MEDIUM" && "bg-blue-50 text-brand-blue border-blue-200"
                            )}
                          >
                            {inc.severity}
                          </span>
                          <span
                            className={cn(
                              "rounded-full px-2 py-0.2 text-[10px] font-bold border",
                              inc.status === "REPORTED" && "bg-purple-50 text-purple-700 border-purple-200 animate-pulse",
                              inc.status === "DISPATCHING" && "bg-amber-50 text-amber-700 border-amber-200",
                              inc.status === "IN_PROGRESS" && "bg-blue-50 text-brand-blue border-blue-200",
                              inc.status === "RESOLVED" && "bg-emerald-50 text-emerald-700 border-emerald-200"
                            )}
                          >
                            {inc.status}
                          </span>
                        </div>

                        <p className="mt-1 text-xs text-slate-600 line-clamp-1">
                          {inc.description}
                        </p>

                        <div className="mt-1.5 flex items-center gap-3 text-xs text-slate-400 font-medium">
                          <span className="flex items-center gap-1">
                            <MapPin className="size-3.5 text-slate-400" />
                            {locationText}
                          </span>
                          <span>·</span>
                          <span className="flex items-center gap-1">
                            <Clock className="size-3.5 text-slate-400" />
                            {new Date(inc.reportedAt || inc.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
                          Verify &amp; Dispatch
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
        )}
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
