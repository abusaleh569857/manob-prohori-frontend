"use client";

import { useState, useEffect } from "react";
import {
  X,
  Phone,
  MapPin,
  Clock,
  Radio,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ExternalLink,
  Shield,
  FileText,
  User,
  Navigation,
  Send,
  Loader2,
  Users,
  Award,
  Check,
  ChevronRight,
  RefreshCw,
  Activity,
  Flame,
  HeartPulse,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  useGetNearbyVolunteersForIncidentQuery,
  useDispatchIncidentToVolunteersMutation,
  useGetIncidentDispatchedRespondersQuery,
} from "@/redux/api/incidentApi";

interface IncidentTriageModalProps {
  incident: any | null;
  isOpen: boolean;
  initialTab?: "DETAILS" | "RADAR" | "RESPONDERS";
  onClose: () => void;
  onStatusChange: (id: number | string, newStatus: string, note?: string) => void;
}

const RADIUS_OPTIONS = [2, 3, 5, 10, 15];

export function IncidentTriageModal({
  incident,
  isOpen,
  initialTab = "DETAILS",
  onClose,
  onStatusChange,
}: IncidentTriageModalProps) {
  const [activeTab, setActiveTab] = useState<"DETAILS" | "RADAR" | "RESPONDERS">(initialTab);
  const [selectedRadius, setSelectedRadius] = useState<number>(5);
  const [selectedVolunteerIds, setSelectedVolunteerIds] = useState<number[]>([]);
  const [rejectReason, setRejectReason] = useState("False Alarm / Prank Report");
  const [showRejectBox, setShowRejectBox] = useState(false);
  const [customNote, setCustomNote] = useState("");
  const [dispatchNote, setDispatchNote] = useState("");

  // Sync activeTab when modal is opened with specific initialTab
  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  // RTK Query: Nearby Volunteer Radar
  const {
    data: radarRes,
    isLoading: isLoadingRadar,
    isFetching: isFetchingRadar,
    refetch: refetchRadar,
  } = useGetNearbyVolunteersForIncidentQuery(
    { incidentId: incident?.id, radius: selectedRadius },
    { skip: !incident?.id || !isOpen }
  );

  // RTK Query: Dispatched Responders Tracking
  const {
    data: respondersRes,
    isLoading: isLoadingResponders,
    refetch: refetchResponders,
  } = useGetIncidentDispatchedRespondersQuery(incident?.id, {
    skip: !incident?.id || !isOpen,
    pollingInterval: 20000,
  });

  const [dispatchMutation, { isLoading: isDispatching }] = useDispatchIncidentToVolunteersMutation();

  if (!isOpen || !incident) return null;

  const radarData = radarRes?.data;
  const nearbyVolunteers = radarData?.volunteers || [];
  const matchedWithinRadius = nearbyVolunteers.filter((v) => v.isWithinRadius);
  const dispatchedResponders = respondersRes?.data || [];

  // Toggle selection of all within radius
  const handleSelectAllWithinRadius = () => {
    const idsWithinRadius = matchedWithinRadius.map((v) => v.userId);
    const allSelected = idsWithinRadius.every((id) => selectedVolunteerIds.includes(id));

    if (allSelected) {
      setSelectedVolunteerIds([]);
    } else {
      setSelectedVolunteerIds(idsWithinRadius);
    }
  };

  // Toggle individual volunteer selection
  const handleToggleVolunteer = (userId: number) => {
    if (selectedVolunteerIds.includes(userId)) {
      setSelectedVolunteerIds(selectedVolunteerIds.filter((id) => id !== userId));
    } else {
      setSelectedVolunteerIds([...selectedVolunteerIds, userId]);
    }
  };

  // Dispatch Emergency Alert to Selected / All Matched Volunteers
  const handleDispatchEmergency = async (targetIds?: number[]) => {
    const idsToDispatch =
      targetIds || (selectedVolunteerIds.length > 0 ? selectedVolunteerIds : matchedWithinRadius.map((v) => v.userId));

    if (idsToDispatch.length === 0) {
      toast.warning(`No verified volunteers found within ${selectedRadius} km radius to dispatch.`);
      return;
    }

    try {
      const res = await dispatchMutation({
        incidentId: incident.id,
        volunteerUserIds: idsToDispatch,
        note: dispatchNote.trim() || `Emergency alert broadcast dispatched to ${idsToDispatch.length} responders within ${selectedRadius}km`,
      }).unwrap();

      if (res.success) {
        toast.success(
          `🚨 Emergency Alert Dispatched to ${idsToDispatch.length} Nearby Responders!`
        );
        onStatusChange(incident.id, "DISPATCHING", res.message);
        setActiveTab("RESPONDERS");
        refetchRadar();
        refetchResponders();
      }
    } catch (err: any) {
      toast.error(err?.data?.message || err?.message || "Failed to dispatch emergency alerts.");
    }
  };

  const handleRejectConfirm = () => {
    const finalReason = customNote ? `${rejectReason}: ${customNote}` : rejectReason;
    onStatusChange(incident.id, "REJECTED", finalReason);
    toast.error(`Incident #${incident.id} marked as REJECTED (${rejectReason}).`);
    onClose();
  };

  const handleResolve = () => {
    onStatusChange(incident.id, "RESOLVED", "Incident emergency resolved and closed.");
    toast.success(`Incident #${incident.id} marked as RESOLVED.`);
    onClose();
  };

  const googleMapsUrl =
    incident.latitude && incident.longitude
      ? `https://www.google.com/maps?q=${incident.latitude},${incident.longitude}`
      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(incident.location || "Dhaka")}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative z-10 flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-2xl">
        {/* 1. Header */}
        <div className="flex flex-col gap-3 border-b border-slate-100 bg-slate-50/80 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="rounded-lg bg-slate-200 px-2.5 py-1 text-xs font-mono font-bold text-brand-navy">
                #{incident.id}
              </span>
              <span
                className={cn(
                  "rounded-md px-2.5 py-0.5 text-xs font-black uppercase tracking-wide border",
                  incident.severity === "CRITICAL" && "bg-red-50 text-brand-red border-red-200",
                  incident.severity === "HIGH" && "bg-amber-50 text-amber-700 border-amber-200",
                  incident.severity === "MEDIUM" && "bg-blue-50 text-brand-blue border-blue-200"
                )}
              >
                {incident.severity}
              </span>
              <span
                className={cn(
                  "rounded-full px-3 py-0.5 text-xs font-bold border",
                  incident.status === "REPORTED" && "bg-purple-50 text-purple-700 border-purple-200",
                  incident.status === "DISPATCHING" && "bg-amber-50 text-amber-700 border-amber-200 animate-pulse",
                  incident.status === "IN_PROGRESS" && "bg-blue-50 text-brand-blue border-blue-200",
                  incident.status === "RESOLVED" && "bg-emerald-50 text-emerald-700 border-emerald-200",
                  incident.status === "REJECTED" && "bg-red-50 text-brand-red border-red-200"
                )}
              >
                {incident.status}
              </span>
            </div>

            <button
              onClick={onClose}
              className="grid size-8 place-items-center rounded-xl bg-white border border-slate-200 text-slate-400 hover:bg-slate-100 hover:text-brand-navy transition cursor-pointer"
            >
              <X className="size-4" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1.5 pt-1">
            <button
              type="button"
              onClick={() => setActiveTab("DETAILS")}
              className={cn(
                "flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-extrabold transition cursor-pointer",
                activeTab === "DETAILS"
                  ? "bg-brand-navy text-white shadow-xs"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              )}
            >
              <FileText className="size-3.5" />
              <span>Incident Details</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("RADAR")}
              className={cn(
                "flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-extrabold transition cursor-pointer relative",
                activeTab === "RADAR"
                  ? "bg-brand-red text-white shadow-xs"
                  : "bg-white text-brand-red hover:bg-red-50 border border-red-200"
              )}
            >
              <Radio className="size-3.5 animate-pulse" />
              <span>Emergency Radar ({matchedWithinRadius.length} Nearby)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("RESPONDERS")}
              className={cn(
                "flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-extrabold transition cursor-pointer",
                activeTab === "RESPONDERS"
                  ? "bg-emerald-700 text-white shadow-xs"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              )}
            >
              <Users className="size-3.5" />
              <span>Dispatched Responders ({dispatchedResponders.length})</span>
            </button>
          </div>
        </div>

        {/* 2. Content Body */}
        <div className="overflow-y-auto p-6 space-y-6">
          {/* ================================================================
              TAB 1: INCIDENT DETAILS & TRIAGE
              ================================================================ */}
          {activeTab === "DETAILS" && (
            <div className="space-y-6">
              {/* Title & Description */}
              <div>
                <h2 className="text-xl font-bold text-brand-navy leading-snug">
                  {incident.title}
                </h2>
                <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed bg-slate-50/70 p-3.5 rounded-2xl border border-slate-100">
                  {incident.description || "No additional description provided by reporter."}
                </p>
              </div>

              {/* Reporter Profile & Direct Call Action */}
              <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="grid size-10 place-items-center rounded-xl bg-brand-navy text-white font-bold text-sm">
                      {incident.reporterName?.charAt(0) || <User className="size-5" />}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-brand-navy">
                        {incident.reporterName || "Anonymous Reporter"}
                      </h4>
                      <p className="text-xs text-slate-500 font-medium">
                        Phone: <strong className="text-brand-navy font-mono">{incident.reporterPhone || "N/A"}</strong>
                      </p>
                    </div>
                  </div>

                  {incident.reporterPhone && (
                    <a
                      href={`tel:${incident.reporterPhone}`}
                      className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-700 transition"
                    >
                      <Phone className="size-3.5 animate-bounce" />
                      <span>Call Reporter to Verify</span>
                    </a>
                  )}
                </div>
              </div>

              {/* Location & GPS */}
              <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Incident Location &amp; GPS
                  </span>
                  <a
                    href={googleMapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-xs font-bold text-brand-red hover:underline"
                  >
                    <span>Open in Google Maps</span>
                    <ExternalLink className="size-3" />
                  </a>
                </div>

                <p className="text-sm font-bold text-brand-navy flex items-center gap-1.5">
                  <MapPin className="size-4 text-brand-red shrink-0" />
                  <span>{incident.addressText || incident.areaName || incident.district || "Dhaka, Bangladesh"}</span>
                </p>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 font-mono pt-1">
                  <span>Lat: {incident.latitude || "23.8103"}</span>
                  <span>·</span>
                  <span>Lng: {incident.longitude || "90.4125"}</span>
                  <span>·</span>
                  <span className="text-emerald-600 font-bold">Auto-Radar Active</span>
                </div>
              </div>

              {/* Attached Media Photos */}
              {incident.imageUrls && incident.imageUrls.length > 0 && (
                <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs space-y-2">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Photo Evidence Attached ({incident.imageUrls.length})
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
                    {incident.imageUrls.map((url: string, idx: number) => (
                      <a
                        key={idx}
                        href={url}
                        target="_blank"
                        rel="noreferrer"
                        className="group relative aspect-video overflow-hidden rounded-xl border border-slate-200 bg-slate-100 hover:border-brand-navy transition"
                      >
                        <img
                          src={url}
                          alt={`Evidence ${idx + 1}`}
                          className="h-full w-full object-cover transition group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                          <ExternalLink className="size-4 text-white" />
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Reject Reason Box */}
              {showRejectBox && (
                <div className="rounded-2xl border border-red-200 bg-red-50/70 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-brand-red uppercase tracking-wider flex items-center gap-1.5">
                      <AlertTriangle className="size-3.5" />
                      Select Rejection Reason
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowRejectBox(false)}
                      className="text-xs font-bold text-slate-500 hover:text-slate-700"
                    >
                      Cancel
                    </button>
                  </div>

                  <select
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    className="w-full rounded-xl border border-red-200 bg-white px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-400"
                  >
                    <option value="False Alarm / Prank Report">False Alarm / Prank Report</option>
                    <option value="Duplicate Incident Report">Duplicate Incident Report</option>
                    <option value="Resolved Before Dispatch">Resolved Before Dispatch</option>
                    <option value="Insufficient / Unreachable Reporter">Insufficient / Unreachable Reporter</option>
                    <option value="Out of Response Area">Out of Response Area</option>
                  </select>

                  <input
                    type="text"
                    placeholder="Optional explanation / note..."
                    value={customNote}
                    onChange={(e) => setCustomNote(e.target.value)}
                    className="w-full rounded-xl border border-red-200 bg-white px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none"
                  />

                  <button
                    type="button"
                    onClick={handleRejectConfirm}
                    className="w-full rounded-xl bg-brand-red py-2.5 text-xs font-bold text-white shadow-md shadow-brand-red/20 hover:bg-brand-red-dark transition cursor-pointer"
                  >
                    Confirm Rejection
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ================================================================
              TAB 2: GEO-FENCED VOLUNTEER RADAR & DISPATCH CONSOLE
              ================================================================ */}
          {activeTab === "RADAR" && (
            <div className="space-y-5">
              {/* Radar Control & Radius Filter Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl bg-linear-to-r from-red-50/70 to-slate-50 border border-red-200/80 p-4">
                <div>
                  <h3 className="text-xs font-black uppercase tracking-wider text-brand-red flex items-center gap-1.5">
                    <Radio className="size-4 animate-pulse text-brand-red" />
                    <span>Geo-Spatial Emergency Radar</span>
                  </h3>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Matching verified responders relative to incident GPS coordinates
                  </p>
                </div>

                {/* Radius Selector Chips */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[11px] font-bold text-slate-400 mr-1">Radius:</span>
                  {RADIUS_OPTIONS.map((radius) => (
                    <button
                      key={radius}
                      type="button"
                      onClick={() => setSelectedRadius(radius)}
                      className={cn(
                        "rounded-xl px-2.5 py-1 text-xs font-black transition cursor-pointer",
                        selectedRadius === radius
                          ? "bg-brand-red text-white shadow-xs"
                          : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
                      )}
                    >
                      {radius} km
                    </button>
                  ))}
                </div>
              </div>

              {/* Matched Responders List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-brand-navy">
                      Detected Responders ({matchedWithinRadius.length} within {selectedRadius} km)
                    </span>
                    {isFetchingRadar && <Loader2 className="size-3.5 animate-spin text-brand-red" />}
                  </div>

                  {matchedWithinRadius.length > 0 && (
                    <button
                      type="button"
                      onClick={handleSelectAllWithinRadius}
                      className="text-xs font-bold text-brand-red hover:underline cursor-pointer"
                    >
                      {matchedWithinRadius.every((v) => selectedVolunteerIds.includes(v.userId))
                        ? "Deselect All"
                        : "Select All Within Radius"}
                    </button>
                  )}
                </div>

                {isLoadingRadar ? (
                  <div className="flex h-48 flex-col items-center justify-center rounded-2xl border border-slate-200 bg-slate-50/50">
                    <Loader2 className="size-6 animate-spin text-brand-red" />
                    <span className="mt-2 text-xs font-bold text-slate-400">Scanning Radar Area...</span>
                  </div>
                ) : nearbyVolunteers.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center">
                    <Users className="mx-auto size-8 text-slate-300" />
                    <p className="mt-2 text-xs font-bold text-slate-600">
                      No verified volunteers available in this region.
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Increase the radar radius to 10km or 15km to scan a wider area.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2.5 max-h-[340px] overflow-y-auto pr-1">
                    {nearbyVolunteers.map((vol) => {
                      const isSelected = selectedVolunteerIds.includes(vol.userId);
                      const isAvailable = vol.volunteerStatus === "AVAILABLE";

                      return (
                        <div
                          key={vol.userId}
                          onClick={() => handleToggleVolunteer(vol.userId)}
                          className={cn(
                            "flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border p-3.5 transition cursor-pointer",
                            isSelected
                              ? "bg-red-50/60 border-brand-red shadow-2xs"
                              : vol.isWithinRadius
                              ? "bg-white border-slate-200 hover:border-slate-300"
                              : "bg-slate-50/70 border-slate-200 opacity-60"
                          )}
                        >
                          <div className="flex items-start gap-3 min-w-0">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => {}}
                              className="mt-1 size-4 rounded accent-brand-red cursor-pointer"
                            />

                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="text-xs sm:text-sm font-bold text-brand-navy truncate">
                                  {vol.name}
                                </span>

                                <span
                                  className={cn(
                                    "rounded-md px-2 py-0.5 text-[10px] font-black uppercase border",
                                    isAvailable
                                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                      : "bg-slate-100 text-slate-600 border-slate-200"
                                  )}
                                >
                                  {isAvailable ? "🟢 ON-DUTY" : "⚪ OFF-DUTY"}
                                </span>

                                {vol.isDispatched && (
                                  <span className="rounded-md bg-amber-50 border border-amber-200 px-2 py-0.5 text-[10px] font-black text-amber-800 uppercase">
                                    ⚡ {vol.dispatchStatus || "Dispatched"}
                                  </span>
                                )}
                              </div>

                              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
                                <span className="flex items-center gap-1 font-semibold text-slate-700">
                                  <Phone className="size-3 text-slate-400" />
                                  {vol.phone}
                                </span>
                                <span className="flex items-center gap-1">
                                  <MapPin className="size-3 text-slate-400" />
                                  {vol.upazila ? `${vol.upazila}, ` : ""}{vol.district || "Bangladesh"}
                                </span>
                              </div>

                              {vol.skills && vol.skills.length > 0 && (
                                <div className="flex flex-wrap items-center gap-1.5 mt-2">
                                  {vol.skills.map((s, i) => (
                                    <span
                                      key={i}
                                      className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold text-slate-600"
                                    >
                                      {s.name}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Distance Chip */}
                          <div className="flex sm:flex-col items-center sm:items-end justify-between shrink-0">
                            <span
                              className={cn(
                                "rounded-xl px-2.5 py-1 text-xs font-black border",
                                vol.isWithinRadius
                                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                  : "bg-slate-100 text-slate-500 border-slate-200"
                              )}
                            >
                              📍 {vol.distanceKm} km away
                            </span>
                            <span className="text-[10.5px] text-slate-400 mt-1">
                              Max Radius: {vol.serviceRadiusKm} km
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Broadcast Alert Actions */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 space-y-3">
                <input
                  type="text"
                  placeholder="Optional dispatch alert note to responders (e.g. Critical Fire Rescue, Bring First Aid kit)..."
                  value={dispatchNote}
                  onChange={(e) => setDispatchNote(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs font-medium text-slate-800 focus:outline-none focus:border-brand-red"
                />

                <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                  <span className="text-xs text-slate-500 font-medium">
                    {selectedVolunteerIds.length > 0
                      ? `🎯 ${selectedVolunteerIds.length} volunteer(s) specifically selected`
                      : `⚡ Auto-broadcast to all ${matchedWithinRadius.length} responders in ${selectedRadius}km`}
                  </span>

                  <button
                    type="button"
                    onClick={() => handleDispatchEmergency()}
                    disabled={isDispatching || matchedWithinRadius.length === 0}
                    className="flex items-center gap-2 rounded-xl bg-brand-red px-5 py-2.5 text-xs font-extrabold text-white shadow-lg shadow-brand-red/25 hover:bg-brand-red-dark transition cursor-pointer disabled:opacity-50"
                  >
                    {isDispatching ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <Send className="size-4" />
                    )}
                    <span>
                      {selectedVolunteerIds.length > 0
                        ? `Dispatch Alert (${selectedVolunteerIds.length} Selected)`
                        : `Broadcast Alert (${matchedWithinRadius.length} Responders)`}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================
              TAB 3: DISPATCHED RESPONDERS LIVE TRACKER
              ================================================================ */}
          {activeTab === "RESPONDERS" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-brand-navy flex items-center gap-2">
                    <Activity className="size-4 text-emerald-600 animate-pulse" />
                    <span>Live Responders Dispatch Tracker</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Real-time status of volunteers notified for incident #{incident.id}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => refetchResponders()}
                  className="flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-brand-navy"
                >
                  <RefreshCw className="size-3.5" />
                  <span>Refresh</span>
                </button>
              </div>

              {isLoadingResponders ? (
                <div className="flex h-48 items-center justify-center">
                  <Loader2 className="size-6 animate-spin text-brand-red" />
                </div>
              ) : dispatchedResponders.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center space-y-3">
                  <Users className="mx-auto size-8 text-slate-300" />
                  <p className="text-xs font-bold text-slate-600">
                    No emergency dispatch alerts have been sent for this incident yet.
                  </p>
                  <button
                    type="button"
                    onClick={() => setActiveTab("RADAR")}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-brand-red px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-brand-red-dark transition cursor-pointer"
                  >
                    <Radio className="size-3.5" />
                    <span>Open Geo-Radar to Dispatch Responders</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {dispatchedResponders.map((resp: any) => {
                    const isAccepted = resp.requestStatus === "ACCEPTED" || resp.missionStatus;
                    const isDeclined = resp.requestStatus === "DECLINED";

                    return (
                      <div
                        key={resp.requestId}
                        className={cn(
                          "flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border p-4 shadow-2xs",
                          isAccepted
                            ? "bg-emerald-50/70 border-emerald-200"
                            : isDeclined
                            ? "bg-red-50/70 border-red-200"
                            : "bg-white border-slate-200"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={cn(
                              "grid size-10 shrink-0 place-items-center rounded-xl font-bold text-sm",
                              isAccepted
                                ? "bg-emerald-600 text-white"
                                : isDeclined
                                ? "bg-red-500 text-white"
                                : "bg-brand-navy text-white"
                            )}
                          >
                            {resp.volunteerName?.charAt(0) || "V"}
                          </div>

                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-bold text-brand-navy">
                                {resp.volunteerName}
                              </h4>
                              <span
                                className={cn(
                                  "rounded-md px-2 py-0.5 text-[10px] font-black uppercase border",
                                  resp.missionStatus === "COMPLETED"
                                    ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                                    : resp.missionStatus === "ON_SCENE"
                                    ? "bg-blue-100 text-blue-800 border-blue-300 animate-pulse"
                                    : resp.missionStatus === "EN_ROUTE"
                                    ? "bg-amber-100 text-amber-800 border-amber-300"
                                    : isAccepted
                                    ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                                    : isDeclined
                                    ? "bg-red-100 text-brand-red border-red-200"
                                    : "bg-slate-100 text-slate-700 border-slate-200"
                                )}
                              >
                                {resp.missionStatus
                                  ? `Mission: ${resp.missionStatus}`
                                  : resp.requestStatus === "PENDING" || resp.requestStatus === "NOTIFIED"
                                  ? "⏳ Alert Dispatched"
                                  : resp.requestStatus}
                              </span>
                            </div>

                            <p className="text-xs text-slate-500 mt-0.5">
                              Phone: <strong className="text-brand-navy">{resp.volunteerPhone}</strong> · Dispatched{" "}
                              {new Date(resp.respondedAt).toLocaleTimeString()}
                            </p>
                          </div>
                        </div>

                        {resp.volunteerPhone && (
                          <a
                            href={`tel:${resp.volunteerPhone}`}
                            className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-brand-navy hover:bg-slate-50 transition shadow-2xs self-start sm:self-center"
                          >
                            <Phone className="size-3 text-emerald-600" />
                            <span>Call Responder</span>
                          </a>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* 3. Footer Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 px-6 py-4 bg-slate-50/80">
          <div className="flex items-center gap-2">
            {!showRejectBox && incident.status !== "REJECTED" && (
              <button
                type="button"
                onClick={() => {
                  setActiveTab("DETAILS");
                  setShowRejectBox(true);
                }}
                className="flex items-center gap-1.5 rounded-xl border border-red-200 bg-white px-3.5 py-2 text-xs font-bold text-brand-red hover:bg-red-50 transition cursor-pointer"
              >
                <XCircle className="size-4" />
                <span>Reject Report</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            {incident.status === "REPORTED" && activeTab !== "RADAR" && (
              <button
                type="button"
                onClick={() => setActiveTab("RADAR")}
                className="flex items-center gap-2 rounded-xl bg-brand-red px-5 py-2.5 text-xs font-extrabold text-white shadow-lg shadow-brand-red/25 hover:bg-brand-red-dark transition cursor-pointer"
              >
                <Radio className="size-4 animate-pulse" />
                <span>Open Geo-Radar &amp; Dispatch</span>
              </button>
            )}

            {incident.status === "DISPATCHING" && (
              <button
                type="button"
                onClick={() => {
                  onStatusChange(incident.id, "IN_PROGRESS", "Responders marked on-scene by Admin.");
                  toast.success(`Incident #${incident.id} marked IN_PROGRESS.`);
                  onClose();
                }}
                className="flex items-center gap-2 rounded-xl bg-brand-navy px-5 py-2.5 text-xs font-extrabold text-white shadow-md hover:bg-slate-800 transition cursor-pointer"
              >
                <CheckCircle2 className="size-4" />
                <span>Mark Responders On-Scene</span>
              </button>
            )}

            {incident.status !== "RESOLVED" && incident.status !== "REJECTED" && (
              <button
                type="button"
                onClick={handleResolve}
                className="flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-xs font-bold text-emerald-700 hover:bg-emerald-100 transition cursor-pointer"
              >
                <CheckCircle2 className="size-4" />
                <span>Resolve Incident</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
