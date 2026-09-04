"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  AlertTriangle,
  Flame,
  HeartPulse,
  MapPin,
  Clock,
  Phone,
  Radio,
  Navigation,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  Power,
  Users,
  ImageIcon,
  ArrowRight,
  Loader2,
  Check,
  ChevronRight,
  ExternalLink,
  Car,
  Flag,
  Award,
  Volume2,
  BellRing,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  useGetVolunteerProfileQuery,
  useUpdateVolunteerStatusMutation,
  useUpdateVolunteerLocationMutation,
  useGetNearbyDispatchesQuery,
  useGetActiveMissionQuery,
  useGetMissionHistoryQuery,
  useAcceptDispatchMutation,
  useDeclineDispatchMutation,
  useUpdateMissionStatusMutation,
} from "@/redux/api/volunteerApi";

/**
 * Web Audio API synthesized high-priority Emergency Dispatch Siren
 * Zero-latency, plays without external mp3 asset dependencies
 */
let audioCtxInstance: any = null;

function getAudioContext() {
  if (typeof window === "undefined") return null;
  if (!audioCtxInstance) {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioCtx) {
      audioCtxInstance = new AudioCtx();
    }
  }
  if (audioCtxInstance && audioCtxInstance.state === "suspended") {
    audioCtxInstance.resume().catch(() => {});
  }
  return audioCtxInstance;
}

function playEmergencyAlertSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    // Siren sweep oscillator
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.exponentialRampToValueAtTime(440, now + 0.25);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.5);
    osc.frequency.exponentialRampToValueAtTime(440, now + 0.75);
    osc.frequency.exponentialRampToValueAtTime(950, now + 1.0);
    osc.frequency.exponentialRampToValueAtTime(520, now + 1.25);

    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 1.35);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 1.35);
  } catch (err) {
    console.warn("Emergency audio chime blocked by browser autoplay policy:", err);
  }
}

export function MasterVolunteerDashboardComponent() {
  const [resolutionNote, setResolutionNote] = useState("");
  const [isResolvingModalOpen, setIsResolvingModalOpen] = useState(false);
  const [incomingAlertIncident, setIncomingAlertIncident] = useState<any>(null);
  const [dismissedAlertIds, setDismissedAlertIds] = useState<number[]>([]);
  const prevDispatchIdsRef = useRef<number[]>([]);
  const hasInitializedRef = useRef<boolean>(false);

  // RTK Query with fast real-time polling (3s) for profile, verification & emergency dispatches
  const { data: profileRes, refetch: refetchProfile } = useGetVolunteerProfileQuery(undefined, {
    pollingInterval: 3000,
    refetchOnMountOrArgChange: true,
  });
  const {
    data: dispatchesRes,
    isLoading: isLoadingDispatches,
    refetch: refetchDispatches,
  } = useGetNearbyDispatchesQuery(undefined, { pollingInterval: 3000, refetchOnMountOrArgChange: true });

  const {
    data: activeMissionRes,
    isLoading: isLoadingMission,
    refetch: refetchActiveMission,
  } = useGetActiveMissionQuery(undefined, { pollingInterval: 3000, refetchOnMountOrArgChange: true });

  const { data: historyRes } = useGetMissionHistoryQuery();

  const [updateStatusMutation, { isLoading: isUpdatingStatus }] =
    useUpdateVolunteerStatusMutation();
  const [updateLocationMutation] = useUpdateVolunteerLocationMutation();
  const [acceptDispatchMutation, { isLoading: isAccepting }] =
    useAcceptDispatchMutation();
  const [declineDispatchMutation] = useDeclineDispatchMutation();
  const [updateMissionStatusMutation, { isLoading: isUpdatingMission }] =
    useUpdateMissionStatusMutation();

  const profile = profileRes?.data;
  const isAvailable = profile?.volunteerStatus === "AVAILABLE";
  const activeMission = activeMissionRes?.data;
  const dispatches = dispatchesRes?.data || [];
  const completedMissions = historyRes?.data || [];

  // Verification states
  const isApproved = profile?.verificationStatus === "APPROVED";
  const isRejected = profile?.verificationStatus === "REJECTED";
  const hasApplied = Boolean(
    profile?.hasApplied ||
    (profile?.verificationDocsCount && profile.verificationDocsCount > 0) ||
    (profile?.skillsCount && profile.skillsCount > 0) ||
    (profile?.bio && profile.bio.trim().length > 0)
  );

  // 1. Audio & Notification unlock on first user click/touch
  useEffect(() => {
    const unlockUserInteraction = () => {
      getAudioContext();
      if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "default") {
        Notification.requestPermission().catch(() => {});
      }
    };
    window.addEventListener("click", unlockUserInteraction, { once: true });
    window.addEventListener("touchstart", unlockUserInteraction, { once: true });
    return () => {
      window.removeEventListener("click", unlockUserInteraction);
      window.removeEventListener("touchstart", unlockUserInteraction);
    };
  }, []);

  // 2. Trigger Emergency Audio Alert & Auto-Open Modal on Incoming Dispatches
  useEffect(() => {
    if (dispatches.length > 0) {
      const currentIds = dispatches.map((d: any) => d.id);

      // Check if there is an explicit pending dispatch request for this volunteer or a new dispatch
      const pendingDispatch = dispatches.find(
        (d: any) => d.myRequestStatus === "PENDING" && !dismissedAlertIds.includes(d.id)
      );

      const targetToAlert = pendingDispatch || (
        hasInitializedRef.current
          ? dispatches.find((d: any) => !prevDispatchIdsRef.current.includes(d.id) && !dismissedAlertIds.includes(d.id))
          : null
      );

      if (targetToAlert && !activeMission) {
        setIncomingAlertIncident(targetToAlert);
        playEmergencyAlertSound();

        // Browser Desktop Push Notification
        if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
          try {
            new Notification(`🚨 EMERGENCY DISPATCH: ${targetToAlert.title}`, {
              body: `${targetToAlert.severity} severity incident reported at ${targetToAlert.addressText || targetToAlert.areaName || "your area"}. Tap to accept.`,
              icon: "/favicon.ico",
            });
          } catch (e) {}
        }

        toast.error(`🚨 EMERGENCY BROADCAST: ${targetToAlert.title} dispatched in your area!`, {
          duration: 10000,
          icon: "🚨",
        });
      }

      hasInitializedRef.current = true;
      prevDispatchIdsRef.current = currentIds;
    }
  }, [dispatches, activeMission, dismissedAlertIds]);

  // 3. Sync Live Browser GPS Coordinates on Mount
  useEffect(() => {
    if (typeof window !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          updateLocationMutation({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          });
        },
        (err) => {
          console.warn("Volunteer location access denied/unavailable:", err);
        },
        { enableHighAccuracy: true }
      );
    }
  }, [updateLocationMutation]);

  // 2. Toggle Duty Status
  const handleToggleStatus = async () => {
    try {
      const newStatus = isAvailable ? "UNAVAILABLE" : "AVAILABLE";
      await updateStatusMutation({ status: newStatus }).unwrap();
      refetchProfile();
      toast.success(
        newStatus === "AVAILABLE"
          ? "🟢 You are now ON-DUTY and ready for emergency dispatches!"
          : "⚪ You are now OFF-DUTY."
      );
    } catch (e: any) {
      toast.error(e?.data?.message || "Failed to update duty status.");
    }
  };

  // 3. Accept Emergency Dispatch
  const handleAcceptDispatch = async (incidentId: number) => {
    if (!isApproved) {
      if (!hasApplied) {
        toast.error("Verification required! Please complete your volunteer verification before accepting emergency dispatches.");
      } else {
        toast.warning("Your verification application is currently under review by Admin. You can accept emergency missions once approved!");
      }
      return;
    }

    try {
      await acceptDispatchMutation(incidentId).unwrap();
      toast.success("🚨 Emergency Accepted! Mission Cockpit is now active.");
      refetchActiveMission();
      refetchDispatches();
    } catch (e: any) {
      toast.error(e?.data?.message || "Failed to accept dispatch.");
    }
  };

  // 4. Decline Dispatch
  const handleDeclineDispatch = async (incidentId: number) => {
    try {
      await declineDispatchMutation({ incidentId, reason: "Unavailable" }).unwrap();
      toast.info("Dispatch declined.");
      refetchDispatches();
    } catch (e: any) {
      toast.error(e?.data?.message || "Failed to decline dispatch.");
    }
  };

  // 5. Update Mission Progress Stage
  const handleAdvanceMission = async (
    nextStatus: "EN_ROUTE" | "ON_SCENE" | "COMPLETED",
    note?: string
  ) => {
    if (!activeMission) return;
    try {
      await updateMissionStatusMutation({
        incidentId: activeMission.incidentId,
        status: nextStatus,
        note,
      }).unwrap();

      if (nextStatus === "COMPLETED") {
        toast.success("🎉 Rescue Mission Completed & Incident Resolved!");
        setIsResolvingModalOpen(false);
        setResolutionNote("");
      } else if (nextStatus === "EN_ROUTE") {
        toast.success("🚗 Marked En Route! Drive safely.");
      } else if (nextStatus === "ON_SCENE") {
        toast.success("📍 Marked On-Scene! Assistance in progress.");
      }

      refetchActiveMission();
      refetchDispatches();
    } catch (e: any) {
      toast.error(e?.data?.message || "Failed to update mission progress.");
    }
  };

  // Category Icon helper
  const getCategoryIcon = (categoryName: string) => {
    const lower = (categoryName || "").toLowerCase();
    if (lower.includes("fire")) return Flame;
    if (lower.includes("blood") || lower.includes("medical")) return HeartPulse;
    if (lower.includes("accident") || lower.includes("traffic")) return AlertTriangle;
    return ShieldCheck;
  };

  return (
    <div className="space-y-6">
      {/* ------------------------------------------------------------------
          1. HEADER & DUTY AVAILABILITY COCKPIT
          ------------------------------------------------------------------ */}
      <div className="flex flex-col gap-4 rounded-3xl border border-slate-200/90 bg-white/95 p-6 backdrop-blur-xl shadow-xs sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="grid size-14 place-items-center rounded-2xl bg-brand-red-soft text-brand-red border border-red-200 shadow-2xs">
              <ShieldCheck className="size-8" />
            </div>
            <span
              className={cn(
                "absolute -bottom-1 -right-1 size-4 rounded-full border-2 border-white ring-1 ring-slate-200",
                isAvailable ? "bg-emerald-500 animate-pulse" : "bg-slate-300"
              )}
            />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-brand-navy tracking-tight">
                {profile?.fullName || "Volunteer Responder"}
              </h1>
              <span
                className={cn(
                  "rounded-full border px-2.5 py-0.5 text-[11px] font-extrabold uppercase",
                  isApproved
                    ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                    : isRejected
                    ? "bg-red-50 border-red-200 text-brand-red"
                    : hasApplied
                    ? "bg-amber-50 border-amber-200 text-amber-800"
                    : "bg-slate-100 border-slate-200 text-slate-700"
                )}
              >
                {isApproved
                  ? "✓ Verified Responder"
                  : isRejected
                  ? "✗ Verification Rejected"
                  : hasApplied
                  ? "⏳ Application Under Review"
                  : "⚠️ Verification Required"}
              </span>
            </div>
            <p className="mt-0.5 text-xs sm:text-[13px] font-medium text-slate-500">
              Service Radius: <strong>{profile?.serviceRadiusKm || 10} km</strong> · Emergency Fast Response Console
            </p>
          </div>
        </div>

        {/* Verification App Link & Duty Toggle */}
        <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-center">
          <Link
            href="/volunteer/verification"
            className="flex items-center gap-1.5 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-bold text-brand-navy hover:bg-slate-100 hover:border-slate-300 transition cursor-pointer shadow-2xs"
          >
            <Award className="size-4 text-brand-red" />
            <span>Verification &amp; Skills</span>
          </Link>

          <button
            onClick={handleToggleStatus}
            disabled={isUpdatingStatus}
            className={cn(
              "flex items-center gap-2.5 rounded-2xl px-5 py-2.5 text-xs sm:text-sm font-extrabold transition shadow-md cursor-pointer",
              isAvailable
                ? "bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-600/20"
                : "bg-slate-800 text-white hover:bg-slate-900 shadow-slate-800/20"
            )}
          >
            <Power className="size-4" />
            <span>{isAvailable ? "ON-DUTY" : "OFF-DUTY"}</span>
          </button>
        </div>
      </div>

      {/* Verification Attention Banner (When Not Approved) */}
      {!isApproved && (
        <div
          className={cn(
            "flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border p-4 shadow-xs",
            isRejected
              ? "bg-red-50/80 border-red-200 text-red-900"
              : hasApplied
              ? "bg-amber-50/80 border-amber-200 text-amber-900"
              : "bg-blue-50/80 border-blue-200 text-blue-950"
          )}
        >
          <div className="flex items-start gap-3">
            <AlertTriangle
              className={cn(
                "size-5 shrink-0 mt-0.5",
                isRejected
                  ? "text-brand-red"
                  : hasApplied
                  ? "text-amber-600"
                  : "text-blue-600"
              )}
            />
            <div>
              <p className="text-xs sm:text-sm font-extrabold">
                {isRejected
                  ? "Verification Application Action Required"
                  : hasApplied
                  ? "Volunteer Verification Application Under Review"
                  : "Action Required: Complete Your Volunteer Verification"}
              </p>
              <p className="text-xs font-medium text-slate-600 mt-0.5">
                {isRejected
                  ? `Admin Note: ${profile?.rejectionReason || "Please re-upload clearer certification documents and re-apply."}`
                  : hasApplied
                  ? "Your volunteer responder application and submitted documents are awaiting Admin review. You will be able to accept emergency dispatches once approved."
                  : "You have not submitted your volunteer verification application yet. You must complete your profile with emergency skills & certificates to participate in and accept emergency incident dispatches."}
              </p>
            </div>
          </div>

          <Link
            href="/volunteer/verification"
            className={cn(
              "shrink-0 self-start sm:self-center rounded-xl px-4 py-2 text-xs font-bold transition cursor-pointer shadow-xs",
              isRejected
                ? "bg-brand-red text-white hover:bg-red-700"
                : hasApplied
                ? "bg-amber-800 text-white hover:bg-amber-900"
                : "bg-brand-navy text-white hover:bg-slate-800"
            )}
          >
            {isRejected
              ? "Re-apply with Documents"
              : hasApplied
              ? "View / Edit Application"
              : "Complete Verification"}
          </Link>
        </div>
      )}

      {/* ------------------------------------------------------------------
          1.5 PENDING EMERGENCY DISPATCH ALERT BANNER (High Visibility)
          ------------------------------------------------------------------ */}
      {dispatches.length > 0 && !activeMission && (
        <div className="relative overflow-hidden rounded-3xl border-2 border-red-500 bg-linear-to-r from-red-600 via-brand-red to-red-600 p-5 text-white shadow-xl animate-pulse">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="grid size-12 place-items-center rounded-2xl bg-white/20 backdrop-blur-xs text-white shrink-0">
                <BellRing className="size-6 animate-bounce" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="rounded bg-white px-2 py-0.5 text-[10px] font-black uppercase text-brand-red">
                    Broadcast Received
                  </span>
                  <span className="text-xs font-mono font-bold text-red-100">
                    High Priority Incident
                  </span>
                </div>
                <p className="text-base sm:text-lg font-black mt-0.5 text-white">
                  {dispatches[0]?.title || "Emergency Incident Alert Dispatched"}
                </p>
                <p className="text-xs text-red-100 font-medium mt-0.5">
                  {dispatches[0]?.addressText || dispatches[0]?.areaName || "Near your location"} · {dispatches[0]?.distanceKm ? `${dispatches[0]?.distanceKm} km away` : "Nearby (< 100m)"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-center">
              <button
                type="button"
                onClick={() => setIncomingAlertIncident(dispatches[0])}
                className="rounded-2xl bg-white px-5 py-3 text-xs sm:text-sm font-black text-brand-red hover:bg-red-50 shadow-md cursor-pointer transition"
              >
                ⚡ View &amp; Accept Mission
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------
          2. ACTIVE EMERGENCY MISSION COCKPIT (STICKY TOP BANNER)
          Displayed when the volunteer has accepted an incident
          ------------------------------------------------------------------ */}
      {activeMission && (
        <div className="rounded-3xl border-2 border-brand-red bg-linear-to-b from-red-50/70 via-white to-white p-6 sm:p-7 shadow-[0_20px_50px_rgba(220,38,38,0.12)]">
          {/* Header */}
          <div className="flex flex-col gap-3 pb-5 border-b border-red-100 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-red px-3 py-1 text-xs font-black text-white shadow-xs animate-pulse">
                <Radio className="size-3.5" /> ACTIVE EMERGENCY MISSION
              </span>
              <h2 className="mt-2 text-xl sm:text-2xl font-black text-brand-navy leading-tight">
                {activeMission.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1">
                {activeMission.description}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "rounded-xl px-3 py-1 text-xs font-black uppercase tracking-wide border",
                  activeMission.severity === "CRITICAL" && "bg-red-50 text-brand-red border-red-200",
                  activeMission.severity === "HIGH" && "bg-amber-50 text-amber-700 border-amber-200",
                  activeMission.severity === "MEDIUM" && "bg-blue-50 text-brand-blue border-blue-200"
                )}
              >
                {activeMission.severity} Severity
              </span>
            </div>
          </div>

          {/* Stepper Progress */}
          <div className="my-6 grid grid-cols-3 gap-2 sm:gap-4">
            <div
              className={cn(
                "flex flex-col items-center rounded-2xl p-3 border text-center transition",
                activeMission.missionStatus === "ACCEPTED"
                  ? "bg-red-50 border-brand-red text-brand-red shadow-xs font-bold"
                  : "bg-slate-50 border-slate-200 text-slate-400"
              )}
            >
              <span className="text-[10.5px] font-black uppercase">Step 1</span>
              <span className="text-xs sm:text-sm font-extrabold mt-0.5">Accepted</span>
            </div>

            <div
              className={cn(
                "flex flex-col items-center rounded-2xl p-3 border text-center transition",
                activeMission.missionStatus === "EN_ROUTE"
                  ? "bg-amber-50 border-amber-500 text-amber-800 shadow-xs font-bold"
                  : activeMission.missionStatus === "ON_SCENE"
                  ? "bg-emerald-50 border-emerald-300 text-emerald-700 font-bold"
                  : "bg-slate-50 border-slate-200 text-slate-400"
              )}
            >
              <span className="text-[10.5px] font-black uppercase">Step 2</span>
              <span className="text-xs sm:text-sm font-extrabold mt-0.5">En Route</span>
            </div>

            <div
              className={cn(
                "flex flex-col items-center rounded-2xl p-3 border text-center transition",
                activeMission.missionStatus === "ON_SCENE"
                  ? "bg-emerald-50 border-emerald-500 text-emerald-800 shadow-xs font-bold animate-pulse"
                  : "bg-slate-50 border-slate-200 text-slate-400"
              )}
            >
              <span className="text-[10.5px] font-black uppercase">Step 3</span>
              <span className="text-xs sm:text-sm font-extrabold mt-0.5">On-Scene Arrived</span>
            </div>
          </div>

          {/* Location, Caller, & Action Triggers */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 pt-2">
            {/* Left: Location & Contact */}
            <div className="space-y-3 rounded-2xl bg-white p-4 border border-slate-200/90 shadow-2xs">
              <div className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                <MapPin className="size-5 text-brand-red shrink-0 mt-0.5" />
                <div>
                  <span className="font-extrabold text-brand-navy">Incident Location:</span>
                  <p className="mt-0.5 font-medium">
                    {activeMission.addressText || activeMission.areaName || "Dhaka, Bangladesh"}
                  </p>
                </div>
              </div>

              {activeMission.reporterPhone && (
                <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-700">
                    <Phone className="size-4 text-emerald-600" />
                    <span>Caller: <strong>{activeMission.reporterName || "User"}</strong></span>
                  </div>
                  <a
                    href={`tel:${activeMission.reporterPhone}`}
                    className="flex items-center gap-1.5 rounded-xl bg-emerald-50 border border-emerald-200 px-3 py-1.5 text-xs font-extrabold text-emerald-700 hover:bg-emerald-100 transition"
                  >
                    <Phone className="size-3.5" />
                    <span>Call Caller</span>
                  </a>
                </div>
              )}

              {activeMission.imageUrls && activeMission.imageUrls.length > 0 && (
                <div className="border-t border-slate-100 pt-3">
                  <p className="text-xs font-bold text-slate-500 mb-2 flex items-center gap-1">
                    <ImageIcon className="size-3.5" /> Incident Photo Evidence ({activeMission.imageUrls.length})
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {activeMission.imageUrls.map((url, i) => (
                      <a key={i} href={url} target="_blank" rel="noreferrer" className="relative aspect-video rounded-lg overflow-hidden border border-slate-200">
                        <img src={url} alt="Evidence" className="h-full w-full object-cover" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right: GPS Navigation & Next Action Triggers */}
            <div className="flex flex-col justify-between gap-3 rounded-2xl bg-white p-4 border border-slate-200/90 shadow-2xs">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                  Mission Action Controls
                </span>
                <p className="text-xs text-slate-500 font-medium mt-1">
                  Use Google Maps for turn-by-turn route, then advance stage when you arrive.
                </p>

                {/* 1-Click Turn-by-Turn GPS Navigation */}
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${activeMission.latitude},${activeMission.longitude}`}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-4 py-3 text-xs sm:text-sm font-extrabold text-white shadow-md shadow-blue-600/20 hover:bg-blue-700 transition"
                >
                  <Navigation className="size-4" />
                  <span>Start Turn-by-Turn GPS Navigation</span>
                  <ExternalLink className="size-3.5 opacity-70" />
                </a>
              </div>

              {/* Advance Mission Stage Buttons */}
              <div className="space-y-2 pt-2">
                {activeMission.missionStatus === "ACCEPTED" && (
                  <button
                    onClick={() => handleAdvanceMission("EN_ROUTE")}
                    disabled={isUpdatingMission}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-brand-navy px-4 py-3 text-xs sm:text-sm font-extrabold text-white hover:bg-slate-800 transition cursor-pointer shadow-md"
                  >
                    <Car className="size-4" />
                    <span>I am Heading to Scene (Mark En Route)</span>
                  </button>
                )}

                {activeMission.missionStatus === "EN_ROUTE" && (
                  <button
                    onClick={() => handleAdvanceMission("ON_SCENE")}
                    disabled={isUpdatingMission}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-4 py-3 text-xs sm:text-sm font-extrabold text-white hover:bg-emerald-700 transition cursor-pointer shadow-md shadow-emerald-600/20"
                  >
                    <MapPin className="size-4" />
                    <span>I Have Arrived (Mark On-Scene)</span>
                  </button>
                )}

                {activeMission.missionStatus === "ON_SCENE" && (
                  <button
                    onClick={() => setIsResolvingModalOpen(true)}
                    disabled={isUpdatingMission}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-4 py-3.5 text-xs sm:text-sm font-extrabold text-white hover:bg-emerald-700 transition cursor-pointer shadow-lg shadow-emerald-600/25"
                  >
                    <CheckCircle2 className="size-5" />
                    <span>Complete Rescue &amp; Resolve Emergency</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------
          3. NEARBY EMERGENCY DISPATCHES RADAR (5KM RADIUS)
          ------------------------------------------------------------------ */}
      <div className="rounded-3xl border border-slate-200/90 bg-white/95 p-6 sm:p-7 backdrop-blur-xl shadow-xs">
        <div className="flex flex-col gap-2 pb-5 border-b border-slate-100 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-black text-brand-navy tracking-tight">
                Nearby Emergency Dispatches Radar
              </h2>
              <span className="rounded-full bg-red-50 text-brand-red border border-red-200 px-2.5 py-0.5 text-xs font-bold">
                <Radio className="inline-block size-2.5 mr-1 animate-pulse" />
                Live Feed
              </span>
            </div>
            <p className="mt-0.5 text-xs sm:text-[13px] text-slate-500 font-medium">
              Verified emergencies in your service zone awaiting responder assistance
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center">
            <button
              type="button"
              onClick={() => {
                playEmergencyAlertSound();
                toast.success("🔊 Siren Audio Test: Emergency alert chime is loud and active!");
              }}
              className="flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50/70 px-3.5 py-2 text-xs font-bold text-brand-red hover:bg-red-100 transition shadow-2xs cursor-pointer"
              title="Test emergency audio alarm sound"
            >
              <Volume2 className="size-3.5 animate-pulse" />
              <span>Test Audio Alarm</span>
            </button>

            <button
              onClick={() => refetchDispatches()}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition shadow-2xs cursor-pointer"
            >
              <span>Refresh Radar</span>
            </button>
          </div>
        </div>

        {/* Dispatches List */}
        {isLoadingDispatches ? (
          <div className="flex flex-col items-center justify-center p-12">
            <Loader2 className="size-8 animate-spin text-brand-red" />
            <p className="mt-3 text-xs font-bold text-slate-400">Scanning 5km emergency radius...</p>
          </div>
        ) : dispatches.length === 0 ? (
          <div className="p-12 text-center">
            <div className="mx-auto grid size-12 place-items-center rounded-2xl bg-emerald-50 text-emerald-600 mb-3 border border-emerald-200">
              <ShieldCheck className="size-6" />
            </div>
            <h3 className="text-sm font-bold text-brand-navy">All clear in your area</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              No active unassigned emergencies nearby. You will be alerted automatically when an incident is dispatched.
            </p>
          </div>
        ) : (
          <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-2">
            {dispatches.map((inc) => {
              const Icon = getCategoryIcon(inc.categoryName);
              const locationText = inc.addressText || inc.areaName || inc.district || "Dhaka";
              const isLocked = Boolean(activeMission);

              return (
                <div
                  key={inc.id}
                  className="flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs hover:border-red-300 hover:shadow-md transition"
                >
                  <div>
                    {/* Top Row: Severity & Distance */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            "rounded px-2 py-0.5 text-[10px] font-black uppercase border",
                            inc.severity === "CRITICAL" && "bg-red-50 text-brand-red border-red-200",
                            inc.severity === "HIGH" && "bg-amber-50 text-amber-700 border-amber-200",
                            inc.severity === "MEDIUM" && "bg-blue-50 text-brand-blue border-blue-200"
                          )}
                        >
                          {inc.severity}
                        </span>
                        <span className="text-xs font-mono font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                          #{inc.id}
                        </span>
                      </div>

                      <span className="inline-flex items-center gap-1 rounded-full bg-red-50 border border-red-200 px-2.5 py-0.5 text-[11px] font-extrabold text-brand-red">
                        <MapPin className="size-3" />
                        {inc.distanceKm < 0.05
                          ? "Nearby (< 50m)"
                          : inc.distanceKm < 1
                          ? `${Math.round(inc.distanceKm * 1000)}m away`
                          : `${inc.distanceKm} km away`}
                      </span>
                    </div>

                    {/* Title & Description */}
                    <div className="mt-3">
                      <span className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400">
                        {inc.categoryName || "Emergency"}
                      </span>
                      <h3 className="text-base font-bold text-brand-navy leading-snug mt-0.5">
                        {inc.title}
                      </h3>
                      <p className="mt-1 text-xs text-slate-600 line-clamp-2">
                        {inc.description}
                      </p>
                    </div>

                    {/* Location & Photo thumbnails */}
                    <div className="mt-3 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100 pt-3">
                      <div className="flex items-center gap-1.5 truncate">
                        <MapPin className="size-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{locationText}</span>
                      </div>
                      <div className="flex items-center gap-1 shrink-0 text-slate-400 font-medium">
                        <Clock className="size-3.5" />
                        <span>{new Date(inc.reportedAt || inc.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>

                    {inc.imageUrls && inc.imageUrls.length > 0 && (
                      <div className="mt-2.5 flex items-center gap-2">
                        {inc.imageUrls.slice(0, 3).map((url, i) => (
                          <div key={i} className="relative size-12 rounded-lg overflow-hidden border border-slate-200">
                            <img src={url} alt="Thumbnail" className="h-full w-full object-cover" />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Actions: 1-Click Accept & Decline */}
                  <div className="mt-4 flex items-center gap-2 pt-3 border-t border-slate-100">
                    <button
                      onClick={() => handleAcceptDispatch(inc.id)}
                      disabled={isAccepting || isLocked}
                      className={cn(
                        "flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-extrabold transition shadow-xs cursor-pointer",
                        isLocked
                          ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                          : "bg-brand-red text-white hover:bg-brand-red-dark shadow-brand-red/25"
                      )}
                    >
                      <Check className="size-4" />
                      <span>{isLocked ? "Complete Active Mission First" : "Accept Emergency Response"}</span>
                    </button>

                    {!isLocked && (
                      <button
                        onClick={() => handleDeclineDispatch(inc.id)}
                        className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
                      >
                        Decline
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ------------------------------------------------------------------
          4. COMPLETED MISSIONS & IMPACT LOG
          ------------------------------------------------------------------ */}
      {completedMissions.length > 0 && (
        <div className="rounded-3xl border border-slate-200/90 bg-white/95 p-6 backdrop-blur-xl shadow-xs">
          <h3 className="text-base font-bold text-brand-navy">
            Your Completed Rescue Missions ({completedMissions.length})
          </h3>
          <div className="mt-4 space-y-2.5">
            {completedMissions.map((m) => (
              <div
                key={m.responseId}
                className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/70 p-3.5 text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="grid size-8 place-items-center rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200">
                    <CheckCircle2 className="size-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-brand-navy">{m.title}</h4>
                    <p className="text-slate-400">{m.addressText || m.areaName || "Dhaka"}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    Resolved
                  </span>
                  <p className="text-[10.5px] text-slate-400 mt-1">
                    {new Date(m.completedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------
          5. COMPLETE RESCUE MODAL
          ------------------------------------------------------------------ */}
      {isResolvingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="grid size-10 place-items-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200">
                <CheckCircle2 className="size-6" />
              </div>
              <div>
                <h3 className="text-base font-black text-brand-navy">Complete Rescue Mission</h3>
                <p className="text-xs text-slate-500 font-medium">Record final field notes before resolving</p>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              <label className="block text-xs font-bold text-slate-700">
                Rescue Summary / Field Notes
              </label>
              <textarea
                rows={3}
                placeholder="e.g. Victim provided with first aid and transported to hospital. Scene secured."
                value={resolutionNote}
                onChange={(e) => setResolutionNote(e.target.value)}
                className="w-full rounded-xl border border-slate-200 p-3 text-xs focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div className="mt-5 flex items-center justify-end gap-2.5">
              <button
                onClick={() => setIsResolvingModalOpen(false)}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleAdvanceMission("COMPLETED", resolutionNote)}
                disabled={isUpdatingMission}
                className="rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-extrabold text-white hover:bg-emerald-700 shadow-md shadow-emerald-600/20"
              >
                Confirm Resolution
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------
          6. INCOMING EMERGENCY DISPATCH BROADCAST MODAL (AUTO-POPUPS)
          ------------------------------------------------------------------ */}
      {incomingAlertIncident && !activeMission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 sm:p-7 shadow-[0_25px_60px_rgba(220,38,38,0.35)] border-4 border-brand-red">
            {/* Header Badge */}
            <div className="flex items-center justify-between border-b border-red-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="relative grid size-12 place-items-center rounded-2xl bg-brand-red text-white shadow-lg shadow-brand-red/30 animate-bounce">
                  <BellRing className="size-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-0.5 text-[10px] font-black uppercase text-brand-red">
                      <Radio className="size-2.5 animate-pulse" /> Live Broadcast
                    </span>
                    <span
                      className={cn(
                        "rounded px-2 py-0.5 text-[10px] font-black uppercase border",
                        incomingAlertIncident.severity === "CRITICAL" && "bg-red-50 text-brand-red border-red-200",
                        incomingAlertIncident.severity === "HIGH" && "bg-amber-50 text-amber-700 border-amber-200",
                        incomingAlertIncident.severity === "MEDIUM" && "bg-blue-50 text-brand-blue border-blue-200"
                      )}
                    >
                      {incomingAlertIncident.severity}
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-black text-brand-navy mt-1">
                    Incoming Emergency Dispatch Alert
                  </h3>
                </div>
              </div>

              <button
                onClick={() => {
                  setDismissedAlertIds((prev) => [...prev, incomingAlertIncident.id]);
                  setIncomingAlertIncident(null);
                }}
                className="grid size-8 place-items-center rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition cursor-pointer"
                title="Dismiss popup"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Incident Main Body */}
            <div className="mt-4 space-y-3">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  {incomingAlertIncident.categoryName || "Incident"}
                </span>
                <h4 className="text-lg font-black text-brand-navy leading-tight mt-0.5">
                  {incomingAlertIncident.title}
                </h4>
                <p className="mt-1 text-xs sm:text-sm text-slate-600">
                  {incomingAlertIncident.description}
                </p>
              </div>

              {/* Distance and Location Box */}
              <div className="rounded-2xl bg-red-50/70 border border-red-100 p-3.5 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700 flex items-center gap-1.5">
                    <MapPin className="size-4 text-brand-red shrink-0" />
                    {incomingAlertIncident.addressText || incomingAlertIncident.areaName || "Dhaka, Bangladesh"}
                  </span>
                  <span className="font-extrabold text-brand-red bg-white px-2 py-0.5 rounded-lg border border-red-200">
                    {incomingAlertIncident.distanceKm < 0.05
                      ? "Nearby (< 50m)"
                      : incomingAlertIncident.distanceKm < 1
                      ? `${Math.round(incomingAlertIncident.distanceKm * 1000)}m away`
                      : `${incomingAlertIncident.distanceKm} km away`}
                  </span>
                </div>

                {incomingAlertIncident.reporterPhone && (
                  <div className="flex items-center justify-between border-t border-red-100/80 pt-2 text-xs">
                    <span className="text-slate-600">Caller: <strong>{incomingAlertIncident.reporterName || "Citizen"}</strong></span>
                    <a
                      href={`tel:${incomingAlertIncident.reporterPhone}`}
                      className="font-bold text-emerald-700 hover:underline flex items-center gap-1"
                    >
                      <Phone className="size-3" />
                      {incomingAlertIncident.reporterPhone}
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Actions: Loud Accept or Decline */}
            <div className="mt-6 flex flex-col sm:flex-row items-center gap-2.5">
              <button
                onClick={() => {
                  handleAcceptDispatch(incomingAlertIncident.id);
                  setIncomingAlertIncident(null);
                }}
                disabled={isAccepting}
                className="flex w-full sm:flex-1 items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3.5 text-xs sm:text-sm font-black text-white hover:bg-emerald-700 transition shadow-lg shadow-emerald-600/30 cursor-pointer"
              >
                {isAccepting ? <Loader2 className="size-4 animate-spin" /> : <Check className="size-4" />}
                <span>⚡ ACCEPT MISSION &amp; RESPOND NOW</span>
              </button>

              <button
                onClick={() => {
                  handleDeclineDispatch(incomingAlertIncident.id);
                  setDismissedAlertIds((prev) => [...prev, incomingAlertIncident.id]);
                  setIncomingAlertIncident(null);
                }}
                className="w-full sm:w-auto rounded-2xl border border-slate-200 bg-slate-100 px-4 py-3.5 text-xs font-bold text-slate-700 hover:bg-slate-200 transition cursor-pointer"
              >
                Decline
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
