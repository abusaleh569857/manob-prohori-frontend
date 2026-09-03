"use client";

import { History, Shield, Clock, Search, Terminal, Laptop } from "lucide-react";

const mockAuditLogs = [
  {
    id: 1,
    action: "INCIDENT_DISPATCH_OVERRIDE",
    description: "Dispatched 5 nearest volunteers for Incident #101 (Road Traffic Accident)",
    actor: "Admin (Command Authority)",
    ip: "103.145.120.45",
    time: "6 mins ago",
    type: "CRITICAL",
  },
  {
    id: 2,
    action: "VOLUNTEER_VERIFICATION_APPROVED",
    description: "Approved volunteer profile & certificates for Dr. Rafiqul Islam (Paramedic Level 2)",
    actor: "Admin (Command Authority)",
    ip: "103.145.120.45",
    time: "24 mins ago",
    type: "SUCCESS",
  },
  {
    id: 3,
    action: "RELIEF_APPLICATION_PUBLISHED",
    description: "Verified Burn Unit documents and published bKash payment contact for Relief #1",
    actor: "Admin (Command Authority)",
    ip: "103.145.120.45",
    time: "1 hr ago",
    type: "INFO",
  },
  {
    id: 4,
    action: "DONOR_REPORT_VERIFIED",
    description: "Approved O+ blood pathology report from Square Hospital for Sadia Sultana",
    actor: "Admin (Command Authority)",
    ip: "103.145.120.45",
    time: "2 hrs ago",
    type: "SUCCESS",
  },
];

export function MasterAdminAuditLogsComponent() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-black text-brand-navy tracking-tight sm:text-2xl">
            System Audit & Action Logs
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Traceable security and moderation logs for all administrative actions across the platform
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="rounded-full bg-slate-100 border border-slate-200 px-3 py-1 text-xs font-mono font-bold text-slate-700">
            Immutable Ledger Active
          </span>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs">
        <div className="space-y-3">
          {mockAuditLogs.map((log) => (
            <div
              key={log.id}
              className="group flex flex-col gap-3 rounded-xl border border-slate-100 bg-slate-50/50 p-4 transition hover:border-slate-200 hover:bg-white sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-start gap-3 min-w-0 flex-1">
                <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-white shadow-2xs font-mono font-bold text-xs text-brand-navy">
                  <Terminal className="size-4 text-brand-navy" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded bg-brand-navy text-white px-2 py-0.5 text-[10px] font-mono font-bold">
                      {log.action}
                    </span>
                    <span className="text-xs font-bold text-brand-navy">
                      {log.actor}
                    </span>
                  </div>

                  <p className="mt-1 text-xs text-slate-600">
                    {log.description}
                  </p>

                  <div className="mt-1.5 flex items-center gap-3 text-[11px] text-slate-400">
                    <span className="flex items-center gap-1 font-mono">
                      <Laptop className="size-3" />
                      IP: {log.ip}
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Clock className="size-3" />
                      {log.time}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
