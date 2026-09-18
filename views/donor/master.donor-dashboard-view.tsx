"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  HeartPulse,
  ShieldCheck,
  Clock,
  MapPin,
  Phone,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Loader2,
  Calendar,
  Building2,
  Navigation,
  Share2,
  Power,
  RefreshCw,
  Plus,
  ArrowRight,
} from "lucide-react";
import {
  useGetMyDonorProfileQuery,
  useUpdateDonorAvailabilityMutation,
  useGetDonorMatchesQuery,
  useRespondToBloodMatchMutation,
  useUpdateDonorProfileMutation,
} from "@/redux/api/bloodApi";
import { BloodRequestMatch } from "@/types/blood.types";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export function MasterDonorDashboardView() {
  const { data: session } = useSession();
  const {
    data: profileData,
    isLoading: isLoadingProfile,
    refetch: refetchProfile,
  } = useGetMyDonorProfileQuery();

  const {
    data: matchesData,
    isLoading: isLoadingMatches,
    refetch: refetchMatches,
  } = useGetDonorMatchesQuery();

  const [updateAvailability, { isLoading: isUpdatingAvailability }] =
    useUpdateDonorAvailabilityMutation();

  const [respondToMatch, { isLoading: isResponding }] =
    useRespondToBloodMatchMutation();

  const [updateProfile] = useUpdateDonorProfileMutation();

  const donorProfile = profileData?.data;
  const matches: BloodRequestMatch[] = matchesData?.data || [];

  // Toggle Availability
  const handleToggleAvailability = async () => {
    if (!donorProfile) return;
    const nextStatus =
      donorProfile.availability === "AVAILABLE" ? "UNAVAILABLE" : "AVAILABLE";
    try {
      await updateAvailability({ availability: nextStatus }).unwrap();
      toast.success(
        `Your donation status is now set to ${nextStatus === "AVAILABLE" ? "READY (Available)" : "PAUSED (Unavailable)"}`
      );
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update availability");
    }
  };

  // Respond to Match (Accept / Decline)
  const handleMatchResponse = async (matchId: number, status: "ACCEPTED" | "DECLINED") => {
    try {
      await respondToMatch({ matchId, status }).unwrap();
      if (status === "ACCEPTED") {
        toast.success("Thank you for stepping up! Requester contact details unlocked.");
      } else {
        toast.info("Match declined.");
      }
      refetchMatches();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update match response");
    }
  };

  // Calculate Next Eligible Donation Date (90 days after last donation)
  const getEligibility = (lastDateStr?: string | null) => {
    if (!lastDateStr) return { isEligible: true, daysRemaining: 0 };
    const lastDate = new Date(lastDateStr);
    const nextEligible = new Date(lastDate.getTime() + 90 * 24 * 60 * 60 * 1000);
    const now = new Date();
    const diffTime = nextEligible.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return {
      isEligible: diffDays <= 0,
      daysRemaining: Math.max(0, diffDays),
      nextEligibleDate: nextEligible.toLocaleDateString(),
    };
  };

  const eligibility = getEligibility(donorProfile?.last_donation_date);

  if (isLoadingProfile) {
    return (
      <div className="flex h-96 flex-col items-center justify-center rounded-3xl border border-slate-200 bg-white">
        <Loader2 className="size-8 animate-spin text-rose-600" />
        <p className="mt-2 text-xs font-semibold text-slate-400">Loading donor profile &amp; radar...</p>
      </div>
    );
  }

  // If user has not registered yet
  if (!donorProfile) {
    return (
      <div className="space-y-6 pb-16">
        <div className="rounded-3xl border border-rose-200 bg-linear-to-r from-rose-50 to-white p-8 sm:p-12 text-center shadow-xs space-y-4">
          <div className="mx-auto grid size-20 place-items-center rounded-3xl bg-rose-100 text-rose-600">
            <HeartPulse className="size-10" />
          </div>
          <h1 className="text-2xl font-black text-brand-navy tracking-tight">
            Register as a Verified Blood Donor
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
            You haven&apos;t set up your blood donor profile yet. Register your blood group and upload a pathology report to start receiving urgent match alerts in your area.
          </p>
          <div className="pt-2">
            <Link
              href="/donor/register"
              className="inline-flex items-center gap-2 rounded-2xl bg-rose-600 px-6 py-3 text-xs sm:text-sm font-bold text-white shadow-lg shadow-rose-600/30 hover:bg-rose-700 transition"
            >
              <Plus className="size-4" />
              <span>Apply to Become a Blood Donor</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-16">
      {/* 1. Header & Verification Status Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-brand-navy tracking-tight">
              Blood Donor Portal &amp; Radar
            </h1>
            <span
              className={cn(
                "rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase border",
                donorProfile.verification_status === "APPROVED" &&
                  "bg-emerald-50 text-emerald-700 border-emerald-200",
                donorProfile.verification_status === "PENDING" &&
                  "bg-amber-50 text-amber-700 border-amber-200",
                donorProfile.verification_status === "REJECTED" &&
                  "bg-rose-50 text-rose-700 border-rose-200"
              )}
            >
              {donorProfile.verification_status}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Manage your availability, donation records, and accept matched emergency requests
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/donor/register"
            className="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
          >
            Update Profile / Report
          </Link>
          <button
            type="button"
            onClick={() => {
              refetchProfile();
              refetchMatches();
              toast.success("Donor data refreshed");
            }}
            className="grid size-9 place-items-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition cursor-pointer"
            title="Refresh"
          >
            <RefreshCw className="size-3.5" />
          </button>
        </div>
      </div>

      {/* Verification Notice Banner */}
      {donorProfile.verification_status === "PENDING" && (
        <div className="flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs font-semibold text-amber-800 shadow-2xs">
          <Clock className="size-4 shrink-0 text-amber-600" />
          <div>
            <span className="font-bold">Medical Verification In Progress:</span> Your pathology report has been submitted and is currently being reviewed by administrators. You will be alerted when approved.
          </div>
        </div>
      )}

      {donorProfile.verification_status === "APPROVED" && (
        <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-semibold text-emerald-800 shadow-2xs">
          <ShieldCheck className="size-4 shrink-0 text-emerald-600" />
          <div>
            <span className="font-bold">Verified Life Saver:</span> Your blood credentials are confirmed. You will receive real-time proximity alerts whenever a patient needs {donorProfile.blood_group_code} blood nearby.
          </div>
        </div>
      )}

      {/* 2. Donor Telemetry Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Blood Group Card */}
        <div className="rounded-3xl border border-slate-200/90 bg-white p-5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Blood Group</p>
            <h2 className="text-3xl font-black text-rose-600 mt-1 tracking-tight">
              {donorProfile.blood_group_code}
            </h2>
            <p className="text-[11px] text-slate-500 font-medium">{donorProfile.blood_group_name}</p>
          </div>
          <div className="grid size-12 place-items-center rounded-2xl bg-rose-50 border border-rose-200 text-rose-600">
            <HeartPulse className="size-6" />
          </div>
        </div>

        {/* Availability Toggle Card */}
        <div className="rounded-3xl border border-slate-200/90 bg-white p-5 shadow-xs flex flex-col justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Donation Status</p>
            <div className="flex items-center gap-2 mt-1">
              <span
                className={cn(
                  "size-2.5 rounded-full",
                  donorProfile.availability === "AVAILABLE" ? "bg-emerald-500 animate-pulse" : "bg-slate-400"
                )}
              />
              <span className="text-base font-black text-brand-navy">
                {donorProfile.availability === "AVAILABLE" ? "Ready to Donate" : "Currently Paused"}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleToggleAvailability}
            disabled={isUpdatingAvailability}
            className={cn(
              "mt-3 flex items-center justify-center gap-1.5 rounded-xl py-2 px-3 text-xs font-bold transition cursor-pointer",
              donorProfile.availability === "AVAILABLE"
                ? "bg-slate-100 text-slate-700 hover:bg-slate-200"
                : "bg-rose-600 text-white hover:bg-rose-700 shadow-xs"
            )}
          >
            <Power className="size-3.5" />
            <span>{donorProfile.availability === "AVAILABLE" ? "Pause Availability" : "Set to Available"}</span>
          </button>
        </div>

        {/* Donation Eligibility Clock */}
        <div className="rounded-3xl border border-slate-200/90 bg-white p-5 shadow-xs flex flex-col justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Eligibility Clock</p>
            <h3 className="text-base font-black text-brand-navy mt-1">
              {eligibility.isEligible ? "Eligible to Donate" : `${eligibility.daysRemaining} Days Recovery`}
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {donorProfile.last_donation_date
                ? `Last: ${new Date(donorProfile.last_donation_date).toLocaleDateString()}`
                : "No past record"}
            </p>
          </div>

          <div className="mt-3">
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[10px] font-bold",
                eligibility.isEligible
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  : "bg-amber-50 text-amber-700 border border-amber-200"
              )}
            >
              <Calendar className="size-3" />
              <span>{eligibility.isEligible ? "100% Cleared" : `Rest until ${eligibility.nextEligibleDate}`}</span>
            </span>
          </div>
        </div>

        {/* Location / Radar Pin */}
        <div className="rounded-3xl border border-slate-200/90 bg-white p-5 shadow-xs flex flex-col justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Radar Geofence</p>
            <h3 className="text-xs sm:text-sm font-bold text-brand-navy mt-1 truncate">
              {donorProfile.address_text || donorProfile.district || "GPS Linked"}
            </h3>
            <p className="text-[10px] font-mono text-slate-400 mt-0.5">
              {donorProfile.latitude ? `${Number(donorProfile.latitude).toFixed(3)}, ${Number(donorProfile.longitude).toFixed(3)}` : "No GPS"}
            </p>
          </div>

          <Link
            href="/crisis-map"
            className="mt-3 flex items-center justify-center gap-1 rounded-xl border border-slate-200 bg-slate-50/70 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 transition"
          >
            <Navigation className="size-3 text-rose-600" />
            <span>Open Crisis Map</span>
          </Link>
        </div>
      </div>

      {/* 3. Urgent Matches Near You (Feature 15) */}
      <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="grid size-9 place-items-center rounded-xl bg-rose-50 text-rose-600 border border-rose-200 shadow-2xs">
              <HeartPulse className="size-4.5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-black text-brand-navy">
                Urgent Blood Matches Near You
              </h2>
              <p className="text-[11px] text-slate-500 font-medium">
                Automated matching requests dispatched based on your blood group and live proximity
              </p>
            </div>
          </div>

          <span className="rounded-full bg-rose-50 border border-rose-200 px-3 py-1 text-xs font-bold text-rose-700">
            {matches.length} Matches Found
          </span>
        </div>

        {isLoadingMatches ? (
          <div className="flex h-40 flex-col items-center justify-center">
            <Loader2 className="size-6 animate-spin text-rose-600" />
            <p className="mt-2 text-xs text-slate-400">Scanning radar for urgent matches...</p>
          </div>
        ) : matches.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 p-8 text-center">
            <ShieldCheck className="size-10 text-emerald-500/80" />
            <h3 className="mt-2 text-xs sm:text-sm font-bold text-brand-navy">No Pending Emergency Matches</h3>
            <p className="mt-1 text-[11px] text-slate-400 max-w-sm">
              You are on standby! When an emergency in your radius needs {donorProfile.blood_group_code} blood, you will be notified immediately.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {matches.map((m) => (
              <div
                key={m.match_id}
                className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-2xl border border-slate-200/80 bg-slate-50/50 p-4 transition hover:bg-white hover:border-rose-200 hover:shadow-xs"
              >
                {/* Left details */}
                <div className="flex items-start gap-3.5 min-w-0 flex-1">
                  <div className="grid size-12 shrink-0 place-items-center rounded-2xl bg-rose-600 text-white font-black text-sm shadow-sm">
                    {m.blood_group_code}
                  </div>

                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-xs sm:text-sm text-brand-navy">
                        {m.hospital_name}
                      </span>
                      <span className="rounded-full bg-rose-50 border border-rose-200 px-2 py-0.5 text-[10px] font-extrabold text-rose-700">
                        {m.required_units} {Number(m.required_units) > 1 ? "Bags" : "Bag"} Needed
                      </span>
                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 text-[10px] font-bold border",
                          m.match_status === "ACCEPTED" && "bg-emerald-50 text-emerald-700 border-emerald-200",
                          m.match_status === "DECLINED" && "bg-slate-100 text-slate-500 border-slate-200",
                          m.match_status === "PENDING" && "bg-amber-50 text-amber-700 border-amber-200 animate-pulse"
                        )}
                      >
                        {m.match_status}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500">
                      {m.distance_km != null && (
                        <span className="flex items-center gap-1 font-bold text-rose-600">
                          <Navigation className="size-3" />
                          {m.distance_km} km from you
                        </span>
                      )}
                      {m.address_text && <span>· {m.address_text}</span>}
                      <span>· Matched {new Date(m.matched_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                    </div>

                    {m.description && (
                      <p className="text-[11px] text-slate-600 italic">
                        &ldquo;{m.description}&rdquo;
                      </p>
                    )}
                  </div>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  {m.match_status === "PENDING" ? (
                    <>
                      <button
                        type="button"
                        onClick={() => handleMatchResponse(m.match_id, "ACCEPTED")}
                        className="flex items-center gap-1.5 rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-rose-700 transition cursor-pointer"
                      >
                        <CheckCircle2 className="size-3.5" />
                        <span>I Can Donate</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMatchResponse(m.match_id, "DECLINED")}
                        className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                      >
                        Decline
                      </button>
                    </>
                  ) : m.match_status === "ACCEPTED" ? (
                    <a
                      href={`tel:${m.contact_phone}`}
                      className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 transition"
                    >
                      <Phone className="size-3.5" />
                      <span>Call Requester ({m.contact_phone})</span>
                    </a>
                  ) : (
                    <span className="text-xs font-medium text-slate-400">Match Declined</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 4. Public Blood Link Footer */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-600">
        <p>Looking for general blood requests across Bangladesh?</p>
        <Link
          href="/blood"
          className="inline-flex items-center gap-1 font-bold text-rose-600 hover:underline"
        >
          <span>Explore Public Blood Directory</span>
          <ArrowRight className="size-3.5" />
        </Link>
      </div>
    </div>
  );
}
