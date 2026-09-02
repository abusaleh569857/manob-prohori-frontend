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
      <h3 className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-brand-navy">
        <Clock className="size-4 text-brand-red" />
        Status &amp; Response Timeline
      </h3>

      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-brand-border">
        {history.map((item, idx) => {
          const isLatest = idx === history.length - 1;
          const isResolved = item.newStatus === "RESOLVED";
          const isCancelled = item.newStatus === "CANCELLED" || item.newStatus === "REJECTED";

          return (
            <div key={item.id} className="relative">
              {/* Dot Icon */}
              <div
                className={`absolute -left-6 top-0.5 grid size-5.5 place-items-center rounded-full border-2 bg-card ${
                  isResolved
                    ? "border-brand-emerald text-brand-emerald"
                    : isCancelled
                    ? "border-destructive text-destructive"
                    : isLatest
                    ? "border-primary bg-accent text-primary"
                    : "border-border text-muted-foreground"
                }`}
              >
                {isResolved ? (
                  <CheckCircle2 className="size-3.5 fill-brand-emerald-soft" />
                ) : (
                  <div className="size-1.5 rounded-full bg-current" />
                )}
              </div>

              {/* Status Details */}
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-extrabold text-foreground">
                    {statusLabels[item.newStatus] || item.newStatus}
                  </span>
                  <span className="text-[10px] font-medium text-muted-foreground">
                    {new Date(item.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>

                {item.note && (
                  <p className="mt-0.5 text-xs text-brand-text-secondary font-medium">
                    {item.note}
                  </p>
                )}

                {item.changedByName && (
                  <span className="mt-0.5 text-[10px] text-muted-foreground">
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
