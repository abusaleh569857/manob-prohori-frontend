'use client';

import React, { useState } from 'react';
import {
  History,
  Shield,
  Clock,
  Search,
  Terminal,
  Laptop,
  Loader2,
  Filter,
  Eye,
  X,
  Code2,
  RefreshCw,
} from 'lucide-react';
import { useGetAdminAuditLogsQuery } from '@/redux/api/adminApi';

export function MasterAdminAuditLogsComponent() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEntity, setSelectedEntity] = useState('ALL');
  const [inspectLog, setInspectLog] = useState<any | null>(null);

  const { data, isLoading, isFetching, refetch } = useGetAdminAuditLogsQuery({
    search: searchTerm,
    entityType: selectedEntity,
    limit: 50,
  });

  const logs = data?.logs || [];
  const total = data?.total || 0;

  const entityFilters = [
    { label: 'All Events', value: 'ALL' },
    { label: 'Incidents', value: 'INCIDENT' },
    { label: 'Volunteers', value: 'VOLUNTEER_VERIFICATION' },
    { label: 'Relief Campaigns', value: 'RELIEF_REQUEST' },
    { label: 'Blood Donors', value: 'BLOOD_DONOR' },
    { label: 'Users', value: 'USER' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold mb-2 font-mono">
            <Terminal className="w-3.5 h-3.5 text-brand-navy" />
            <span>Immutable Security Ledger Active</span>
          </div>
          <h1 className="text-xl font-black text-brand-navy tracking-tight sm:text-2xl">
            System Audit & Action Logs
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Traceable security and moderation logs for all administrative actions across the platform ({total} records)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 transition shadow-2xs cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? 'animate-spin' : ''}`} />
            <span>Refresh Ledger</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by action, actor name, entity type, or IP address..."
              className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-navy/30"
            />
          </div>
        </div>

        {/* Entity Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-1 mr-1" />
          {entityFilters.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setSelectedEntity(tab.value)}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition cursor-pointer ${
                selectedEntity === tab.value
                  ? 'bg-brand-navy text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Logs Table / Card List */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs">
        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 text-brand-navy animate-spin" />
            <p className="text-xs font-semibold text-slate-500">Loading audit records...</p>
          </div>
        ) : logs.length === 0 ? (
          <div className="py-16 text-center text-slate-400">
            <History className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-700">No audit records found</p>
            <p className="text-xs text-slate-500 mt-1">Actions performed by administrators will be permanently logged here.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {logs.map((log: any) => (
              <div
                key={log.id}
                className="group flex flex-col gap-3 rounded-2xl border border-slate-100 bg-slate-50/60 p-4 transition hover:border-slate-200 hover:bg-white sm:flex-row sm:items-center sm:justify-between shadow-2xs"
              >
                <div className="flex items-start gap-3.5 min-w-0 flex-1">
                  <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-white shadow-2xs border border-slate-200 text-brand-navy">
                    <Terminal className="size-4.5 text-brand-navy" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-lg bg-brand-navy text-white px-2.5 py-0.5 text-[11px] font-mono font-bold tracking-tight">
                        {log.action}
                      </span>
                      <span className="text-xs font-bold text-slate-900">
                        {log.actorName}
                      </span>
                      {log.entityType && (
                        <span className="rounded-md bg-blue-50 border border-blue-200/80 text-blue-700 px-2 py-0.5 text-[10px] font-bold">
                          {log.entityType} {log.entityId ? `#${log.entityId}` : ''}
                        </span>
                      )}
                    </div>

                    <div className="mt-2 flex flex-wrap items-center gap-3 text-[11px] text-slate-400">
                      <span className="flex items-center gap-1 font-mono text-slate-500">
                        <Laptop className="size-3" />
                        IP: {log.ipAddress || '127.0.0.1'}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-slate-500">
                        <Clock className="size-3" />
                        {new Date(log.createdAt).toLocaleString(undefined, {
                          dateStyle: 'medium',
                          timeStyle: 'short',
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Inspect Button */}
                <div className="flex items-center gap-2 sm:self-center">
                  {(log.oldValues || log.newValues) && (
                    <button
                      onClick={() => setInspectLog(log)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-brand-navy transition cursor-pointer shadow-2xs"
                    >
                      <Code2 className="size-3.5" />
                      <span>Inspect Payload</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* JSON Payload Inspection Modal */}
      {inspectLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-xl rounded-3xl bg-slate-950 text-slate-200 border border-white/15 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2 font-mono text-xs font-bold text-white">
                <Terminal className="size-4 text-emerald-400" />
                <span>Audit Payload: {inspectLog.action}</span>
              </div>
              <button
                onClick={() => setInspectLog(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              {inspectLog.oldValues && (
                <div>
                  <span className="font-bold text-amber-400 block mb-1">Previous Values (Before Action):</span>
                  <pre className="p-3 rounded-xl bg-slate-900 border border-white/10 overflow-x-auto text-amber-200/90 font-mono text-[11px]">
                    {typeof inspectLog.oldValues === 'string'
                      ? inspectLog.oldValues
                      : JSON.stringify(inspectLog.oldValues, null, 2)}
                  </pre>
                </div>
              )}

              {inspectLog.newValues && (
                <div>
                  <span className="font-bold text-emerald-400 block mb-1">Committed Payload (New State):</span>
                  <pre className="p-3 rounded-xl bg-slate-900 border border-white/10 overflow-x-auto text-emerald-300 font-mono text-[11px]">
                    {typeof inspectLog.newValues === 'string'
                      ? inspectLog.newValues
                      : JSON.stringify(inspectLog.newValues, null, 2)}
                  </pre>
                </div>
              )}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setInspectLog(null)}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-bold text-white transition"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
