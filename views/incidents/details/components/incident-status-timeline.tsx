"use client";

import { CheckCircle2, Clock, ShieldCheck, AlertCircle } from "lucide-react";
import type { IncidentStatusHistoryItem, IncidentStatus } from "@/types/incident.types";

interface IncidentStatusTimelineProps {
  history: IncidentStatusHistoryItem[];
  currentStatus: IncidentStatus;
}

const statusOrder: IncidentStatus[] = [
  "REPORTED",
  "VERIFIED",
  "DISPATCHING",
  "RESPONDER_ASSIGNED",
  "IN_PROGRESS",
  "RESOLVED",
];

const statusLabels: Record<IncidentStatus, string> = {
  REPORTED: "Reported",
  VERIFIED: "Verified by Admin",
  DISPATCHING: "Dispatching Responders",
  RESPONDER_ASSIGNED: "Responder Assigned",
  IN_PROGRESS: "Rescue In Progress",
  RESOLVED: "Incident Resolved",
  CANCELLED: "Incident Cancelled",
  REJECTED: "Incident Rejected",
};

export function IncidentStatusTimeline({
  history,
  currentStatus,
}: IncidentStatusTimelineProps) {
  return (
    <div className="space-y-4">
      <h3 className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-800">
        <Clock className="size-4 text-red-500" />
        Status &amp; Response Timeline
      </h3>

      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
        {history.map((item, idx) => {
          const isLatest = idx === history.length - 1;
          const isResolved = item.newStatus === "RESOLVED";
          const isCancelled = item.newStatus === "CANCELLED" || item.newStatus === "REJECTED";

          return (
            <div key={item.id} className="relative">
              {/* Dot Icon */}
              <div
                className={`absolute -left-6 top-0.5 grid size-5.5 place-items-center rounded-full border-2 bg-white ${
                  isResolved
                    ? "border-emerald-500 text-emerald-600"
                    : isCancelled
                    ? "border-red-500 text-red-600"
                    : isLatest
                    ? "border-red-600 bg-red-50 text-red-600"
                    : "border-slate-300 text-slate-400"
                }`}
              >
                {isResolved ? (
                  <CheckCircle2 className="size-3.5 fill-emerald-100" />
                ) : (
                  <div className="size-1.5 rounded-full bg-current" />
                )}
              </div>

              {/* Status Details */}
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-extrabold text-[#10233f]">
                    {statusLabels[item.newStatus] || item.newStatus}
                  </span>
                  <span className="text-[10px] font-medium text-slate-400">
                    {new Date(item.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>

                {item.note && (
                  <p className="mt-0.5 text-xs text-slate-600 font-medium">
                    {item.note}
                  </p>
                )}

                {item.changedByName && (
                  <span className="mt-0.5 text-[10px] text-slate-400">
                    Updated by: {item.changedByName}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
