"use client";

import { useState } from "react";
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
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface IncidentTriageModalProps {
  incident: any | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusChange: (id: number | string, newStatus: string, note?: string) => void;
}

export function IncidentTriageModal({
  incident,
  isOpen,
  onClose,
  onStatusChange,
}: IncidentTriageModalProps) {
  const [rejectReason, setRejectReason] = useState("False Alarm / Prank Report");
  const [showRejectBox, setShowRejectBox] = useState(false);
  const [customNote, setCustomNote] = useState("");

  if (!isOpen || !incident) return null;

  const handleVerifyAndDispatch = () => {
    onStatusChange(incident.id, "DISPATCHING", "Verified by Operations Admin. Dispatched 5km radius volunteers.");
    toast.success(`Incident #${incident.id} Verified & 5km Responder Matching Triggered!`);
    onClose();
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

  const googleMapsUrl = incident.latitude && incident.longitude
    ? `https://www.google.com/maps?q=${incident.latitude},${incident.longitude}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(incident.location || "Dhaka")}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative z-10 flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-slate-50/70">
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

        {/* Content Body */}
        <div className="overflow-y-auto p-6 space-y-6">
          {/* 1. Title & Description */}
          <div>
            <h2 className="text-xl font-bold text-brand-navy leading-snug">
              {incident.title}
            </h2>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed bg-slate-50/70 p-3.5 rounded-xl border border-slate-100">
              {incident.description || "No additional description provided by reporter."}
            </p>
          </div>

          {/* 2. Reporter Profile & Direct Call Action (Crucial for Triage) */}
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
                  <span>Call to Verify Now</span>
                </a>
              )}
            </div>
          </div>

          {/* 3. Location & GPS Telemetry */}
          <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Incident Location & GPS
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
              <span>{incident.location || "Dhaka, Bangladesh"}</span>
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 font-mono pt-1">
              <span>Lat: {incident.latitude || "23.8103"}</span>
              <span>·</span>
              <span>Lng: {incident.longitude || "90.4125"}</span>
              <span>·</span>
              <span className="text-emerald-600 font-bold">5 km Matching Radius Active</span>
            </div>
          </div>

          {/* 4. Incident Photo Evidence Gallery (if available) */}
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

          {/* 4. Reject Details Box (if toggled) */}
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

        {/* Footer Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 px-6 py-4 bg-slate-50/70">
          <div className="flex items-center gap-2">
            {!showRejectBox && incident.status !== "REJECTED" && (
              <button
                type="button"
                onClick={() => setShowRejectBox(true)}
                className="flex items-center gap-1.5 rounded-xl border border-red-200 bg-white px-3.5 py-2.5 text-xs font-bold text-brand-red hover:bg-red-50 transition cursor-pointer"
              >
                <XCircle className="size-4" />
                Reject Report
              </button>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            {incident.status === "REPORTED" && (
              <button
                type="button"
                onClick={handleVerifyAndDispatch}
                className="flex items-center gap-2 rounded-xl bg-brand-red px-5 py-2.5 text-xs font-extrabold text-white shadow-lg shadow-brand-red/25 hover:bg-brand-red-dark transition cursor-pointer"
              >
                <CheckCircle2 className="size-4" />
                <span>Verify & Auto-Dispatch (5 km)</span>
              </button>
            )}

            {incident.status === "DISPATCHING" && (
              <button
                type="button"
                onClick={() => {
                  onStatusChange(incident.id, "IN_PROGRESS", "Responders arrived on-scene.");
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
