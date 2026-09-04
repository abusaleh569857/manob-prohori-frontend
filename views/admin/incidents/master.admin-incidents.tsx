"use client";

import { useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  Flame,
  HeartPulse,
  MapPin,
  Clock,
  Search,
  CheckCircle2,
  XCircle,
  Users,
  ExternalLink,
  Radio,
  Phone,
  User,
  ShieldCheck,
  Eye,
  Check,
  Loader2,
  ImageIcon,
  Layers,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { IncidentTriageModal } from "./components/incident-triage-modal";
import {
  useGetAllIncidentsQuery,
  useUpdateIncidentStatusMutation,
} from "@/redux/api/incidentApi";

export function MasterAdminIncidentsComponent() {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"ALL" | "REPORTED" | "DISPATCHING" | "IN_PROGRESS" | "RESOLVED" | "REJECTED">("REPORTED");
  const [selectedIncident, setSelectedIncident] = useState<any | null>(null);
  const [modalInitialTab, setModalInitialTab] = useState<"DETAILS" | "RADAR" | "RESPONDERS">("DETAILS");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // RTK Query with 5s polling for real-time live telemetry
  const {
    data: apiResponse,
    isLoading,
    isFetching,
    refetch,
  } = useGetAllIncidentsQuery(undefined, {
    pollingInterval: 5000,
    refetchOnMountOrArgChange: true,
  });

  const [updateStatusMutation] = useUpdateIncidentStatusMutation();

  const incidentsList = apiResponse?.data || [];

  // Tab counts
  const reportedCount = incidentsList.filter((i: any) => i.status === "REPORTED").length;
  const activeCount = incidentsList.filter(
    (i: any) => i.status === "DISPATCHING" || i.status === "IN_PROGRESS" || i.status === "RESPONDER_ASSIGNED"
  ).length;
  const resolvedCount = incidentsList.filter((i: any) => i.status === "RESOLVED").length;

  const filteredIncidents = incidentsList.filter((item: any) => {
    const matchesSearch =
      item.title?.toLowerCase().includes(search.toLowerCase()) ||
      item.addressText?.toLowerCase().includes(search.toLowerCase()) ||
      item.areaName?.toLowerCase().includes(search.toLowerCase()) ||
      item.categoryName?.toLowerCase().includes(search.toLowerCase()) ||
      item.reporterName?.toLowerCase().includes(search.toLowerCase()) ||
      item.reporterPhone?.toLowerCase().includes(search.toLowerCase());

    const matchesTab =
      activeTab === "ALL" ||
      (activeTab === "DISPATCHING" &&
        (item.status === "DISPATCHING" || item.status === "IN_PROGRESS" || item.status === "RESPONDER_ASSIGNED")) ||
      item.status === activeTab;

    return matchesSearch && matchesTab;
  });

  const handleStatusUpdate = async (id: number | string, newStatus: string, note?: string) => {
    try {
      await updateStatusMutation({
        id,
        status: newStatus as any,
        note,
      }).unwrap();
      toast.success(`Incident #${id} updated to ${newStatus}`);
      refetch();
    } catch (e: any) {
      toast.error(e?.data?.message || "Failed to update incident status.");
    }
  };

  const openTriageModal = (incident: any, tab: "DETAILS" | "RADAR" | "RESPONDERS" = "DETAILS") => {
    setSelectedIncident(incident);
    setModalInitialTab(tab);
    setIsModalOpen(true);
  };

  const getCategoryIcon = (categoryName: string) => {
    const lower = (categoryName || "").toLowerCase();
    if (lower.includes("fire")) return Flame;
    if (lower.includes("blood") || lower.includes("medical") || lower.includes("health")) return HeartPulse;
    if (lower.includes("accident") || lower.includes("traffic") || lower.includes("crash")) return AlertTriangle;
    return ShieldCheck;
  };

  return (
    <div className="space-y-6">
      {/* 1. Header & Live Alert Badge */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-navy tracking-tight">
            Incident Verification &amp; Dispatch Console
          </h1>
          <p className="text-sm font-medium text-slate-500 mt-1">
            Real-time emergency moderation, 1-click caller verification, and 5km responder dispatch
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/admin/categories"
            className="flex items-center gap-1.5 rounded-2xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-brand-navy hover:bg-slate-50 transition shadow-2xs cursor-pointer"
          >
            <Layers className="size-4 text-brand-red" />
            <span>Manage Categories</span>
          </Link>

          <span className="inline-flex items-center gap-2 rounded-full bg-red-50 border border-red-200/80 px-3.5 py-1.5 text-xs font-bold text-brand-red shadow-xs">
            <Radio className="size-3.5 animate-pulse" /> Live Telemetry Feed
          </span>
          {isFetching && <Loader2 className="size-4 animate-spin text-slate-400" />}
        </div>
      </div>

      {/* 2. Primary Tabs (Pending Verification, Active Dispatches, Resolved, All) */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-1">
        <button
          onClick={() => setActiveTab("REPORTED")}
          className={cn(
            "flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition cursor-pointer relative",
            activeTab === "REPORTED"
              ? "bg-brand-red text-white shadow-md shadow-brand-red/25"
              : "bg-white/80 text-slate-600 hover:bg-slate-100 hover:text-brand-navy border border-slate-200/80"
          )}
        >
          <span>Pending Verification</span>
          {reportedCount > 0 && (
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-[10px] font-black",
                activeTab === "REPORTED"
                  ? "bg-white text-brand-red animate-pulse"
                  : "bg-brand-red text-white"
              )}
            >
              {reportedCount} Urgent
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab("DISPATCHING")}
          className={cn(
            "flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition cursor-pointer",
            activeTab === "DISPATCHING"
              ? "bg-brand-navy text-white shadow-md shadow-brand-navy/25"
              : "bg-white/80 text-slate-600 hover:bg-slate-100 hover:text-brand-navy border border-slate-200/80"
          )}
        >
          <span>Active Dispatches</span>
          {activeCount > 0 && (
            <span className="rounded-full bg-amber-100 text-amber-800 px-2 py-0.5 text-[10px] font-bold">
              {activeCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab("RESOLVED")}
          className={cn(
            "flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition cursor-pointer",
            activeTab === "RESOLVED"
              ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/25"
              : "bg-white/80 text-slate-600 hover:bg-slate-100 hover:text-brand-navy border border-slate-200/80"
          )}
        >
          <span>Resolved Incidents</span>
          <span className="rounded-full bg-emerald-100 text-emerald-800 px-2 py-0.5 text-[10px] font-bold">
            {resolvedCount}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("ALL")}
          className={cn(
            "rounded-xl px-4 py-2.5 text-xs font-bold transition cursor-pointer",
            activeTab === "ALL"
              ? "bg-slate-800 text-white shadow-xs"
              : "bg-white/80 text-slate-600 hover:bg-slate-100 hover:text-brand-navy border border-slate-200/80"
          )}
        >
          All Incident History ({incidentsList.length})
        </button>
      </div>

      {/* 3. Search Bar */}
      <div className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white/80 p-3.5 backdrop-blur-xl shadow-xs">
        <Search className="size-4.5 text-slate-400 ml-1.5" />
        <input
          type="text"
          placeholder="Search by incident title, location, category, reporter name or phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-transparent text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none"
        />
      </div>

      {/* 4. Incidents List & Fast Triage Cards */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center p-16 bg-white/80 rounded-3xl border border-slate-200">
          <Loader2 className="size-8 animate-spin text-brand-red" />
          <p className="mt-3 text-sm font-bold text-slate-500">Loading live emergency incident data...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredIncidents.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white/80 backdrop-blur-md p-12 text-center">
              <p className="text-base font-bold text-slate-500">
                No incidents matching the selected tab
              </p>
            </div>
          ) : (
            filteredIncidents.map((incident: any) => {
              const Icon = getCategoryIcon(incident.categoryName);
              const isPending = incident.status === "REPORTED";
              const locationText = incident.addressText || incident.areaName || incident.district || "Dhaka, Bangladesh";

              return (
                <div
                  key={incident.id}
                  className={cn(
                    "group rounded-2xl border bg-white/90 p-5 sm:p-6 backdrop-blur-xl shadow-xs transition hover:border-slate-300 hover:shadow-md",
                    isPending ? "border-brand-red/40 ring-2 ring-brand-red/10" : "border-slate-200/80"
                  )}
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    {/* Left Info Column */}
                    <div className="flex items-start gap-4 min-w-0 flex-1">
                      <div className="grid size-12 shrink-0 place-items-center rounded-2xl border shadow-xs mt-0.5 bg-red-50 text-brand-red border-red-200 ring-4 ring-red-50/50">
                        <Icon className="size-6" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs font-mono font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                            #{incident.id}
                          </span>
                          <h3 className="text-base font-bold text-brand-navy leading-snug">
                            {incident.title}
                          </h3>
                          <span
                            className={cn(
                              "rounded-md px-2.5 py-0.5 text-xs font-black uppercase tracking-wide border",
                              incident.severity === "CRITICAL" && "bg-red-50 text-brand-red border-red-200",
                              incident.severity === "HIGH" && "bg-amber-50 text-amber-700 border-amber-200",
                              incident.severity === "MEDIUM" && "bg-blue-50 text-brand-blue border-blue-200",
                              incident.severity === "LOW" && "bg-slate-50 text-slate-700 border-slate-200"
                            )}
                          >
                            {incident.severity}
                          </span>
                          <span
                            className={cn(
                              "rounded-full px-3 py-0.5 text-xs font-bold border shadow-2xs",
                              incident.status === "REPORTED" && "bg-purple-50 text-purple-700 border-purple-200 animate-pulse",
                              incident.status === "DISPATCHING" && "bg-amber-50 text-amber-700 border-amber-200",
                              incident.status === "IN_PROGRESS" && "bg-blue-50 text-brand-blue border-blue-200",
                              incident.status === "RESOLVED" && "bg-emerald-50 text-emerald-700 border-emerald-200",
                              incident.status === "REJECTED" && "bg-red-50 text-brand-red border-red-200"
                            )}
                          >
                            {incident.status === "REPORTED" ? "Waiting Verification" : incident.status}
                          </span>
                        </div>

                        <p className="mt-1 text-xs sm:text-sm text-slate-600 line-clamp-1">
                          {incident.description}
                        </p>

                        {/* Detail Metrics */}
                        <div className="mt-2.5 flex flex-wrap items-center gap-4 text-xs sm:text-[13px] text-slate-600">
                          <span className="flex items-center gap-1.5 font-medium">
                            <MapPin className="size-4 text-slate-400" />
                            {locationText}
                          </span>
                          <span>·</span>
                          <span className="flex items-center gap-1.5 font-medium">
                            <Clock className="size-4 text-slate-400" />
                            {new Date(incident.reportedAt || incident.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          <span>·</span>
                          <span className="flex items-center gap-1.5 font-medium">
                            <User className="size-4 text-slate-400" />
                            Reporter: <strong className="text-brand-navy">{incident.reporterName || "User"}</strong> ({incident.reporterPhone || "No Phone"})
                          </span>

                          {incident.imageUrls && incident.imageUrls.length > 0 && (
                            <>
                              <span>·</span>
                              <span className="font-bold text-blue-600 flex items-center gap-1 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                                <ImageIcon className="size-3.5" />
                                {incident.imageUrls.length} Photo Evidence
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right Actions: 1-Click Fast Verification & Call */}
                    <div className="flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3 lg:border-t-0 lg:pt-0 shrink-0">
                      {/* 1-Click Call Reporter */}
                      {incident.reporterPhone && (
                        <a
                          href={`tel:${incident.reporterPhone}`}
                          title="Call Reporter to verify"
                          className="flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700 hover:bg-emerald-100 transition shadow-2xs"
                        >
                          <Phone className="size-3.5" />
                          <span>Call Caller</span>
                        </a>
                      )}

                      {/* Open Geo-Radar & Dispatch Button */}
                      <button
                        onClick={() => openTriageModal(incident, "RADAR")}
                        className="flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50/80 px-3 py-2 text-xs font-black text-brand-red hover:bg-red-100 hover:border-red-300 transition shadow-2xs cursor-pointer"
                        title="Scan nearby volunteers and dispatch emergency alert"
                      >
                        <Radio className="size-3.5 text-brand-red animate-pulse" />
                        <span>Radar &amp; Dispatch</span>
                      </button>

                      {/* 1-Click Verify & Fast Dispatch */}
                      {incident.status === "REPORTED" && (
                        <button
                          onClick={() => handleStatusUpdate(incident.id, "DISPATCHING", "Verified by Admin")}
                          className="flex items-center gap-1.5 rounded-xl bg-brand-red px-3 py-2 text-xs font-extrabold text-white shadow-md shadow-brand-red/25 hover:bg-brand-red-dark transition cursor-pointer"
                        >
                          <Check className="size-3.5" />
                          <span>Verify</span>
                        </button>
                      )}

                      {incident.status !== "RESOLVED" && incident.status !== "REJECTED" && (
                        <button
                          onClick={() => handleStatusUpdate(incident.id, "RESOLVED", "Resolved by Admin")}
                          className="flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700 hover:bg-emerald-100 transition cursor-pointer"
                        >
                          <CheckCircle2 className="size-3.5" />
                          <span>Resolve</span>
                        </button>
                      )}

                      {/* Open Detailed Triage Drawer */}
                      <button
                        onClick={() => openTriageModal(incident, "DETAILS")}
                        className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-brand-navy transition shadow-2xs cursor-pointer"
                      >
                        <Eye className="size-3.5 text-slate-400" />
                        <span>Inspect</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* 5. Detailed Triage Modal Component */}
      <IncidentTriageModal
        incident={selectedIncident}
        isOpen={isModalOpen}
        initialTab={modalInitialTab}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedIncident(null);
        }}
        onStatusChange={handleStatusUpdate}
      />
    </div>
  );
}
