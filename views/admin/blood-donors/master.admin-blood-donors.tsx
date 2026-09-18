"use client";

import { useState } from "react";
import {
  HeartPulse,
  Search,
  CheckCircle2,
  XCircle,
  FileText,
  MapPin,
  Phone,
  Clock,
  Eye,
  ShieldCheck,
  AlertCircle,
  Loader2,
  RefreshCw,
  X,
  ExternalLink,
} from "lucide-react";
import {
  useGetAdminBloodDonorsQuery,
  useReviewBloodDonorMutation,
} from "@/redux/api/bloodApi";
import { AdminDonorItem } from "@/types/blood.types";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export function MasterAdminBloodDonorsComponent() {
  const [search, setSearch] = useState("");
  const [groupFilter, setGroupFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Document Preview Modal State
  const [selectedDocUrl, setSelectedDocUrl] = useState<string | null>(null);

  // Review Modal State
  const [reviewingDonor, setReviewingDonor] = useState<{
    donor: AdminDonorItem;
    action: "APPROVED" | "REJECTED";
  } | null>(null);
  const [reviewNotes, setReviewNotes] = useState("");

  // RTK Query: Admin Blood Donors List
  const {
    data: donorsData,
    isLoading,
    isFetching,
    refetch,
  } = useGetAdminBloodDonorsQuery({
    search: search || undefined,
    bloodGroup: groupFilter === "ALL" ? undefined : groupFilter,
    status: statusFilter === "ALL" ? undefined : statusFilter,
    limit: 100,
  });

  const [reviewBloodDonor, { isLoading: isSubmittingReview }] =
    useReviewBloodDonorMutation();

  const donors: AdminDonorItem[] = donorsData?.data?.donors || [];
  const totalCount = donorsData?.data?.total || 0;
  const verifiedCount = donors.filter((d) => d.verification_status === "APPROVED").length;
  const pendingCount = donors.filter((d) => d.verification_status === "PENDING").length;

  const handleOpenReview = (donor: AdminDonorItem, action: "APPROVED" | "REJECTED") => {
    setReviewingDonor({ donor, action });
    setReviewNotes(
      action === "APPROVED"
        ? "Verified official hospital pathology report"
        : "Incomplete or unclear blood pathology document"
    );
  };

  const handleConfirmReview = async () => {
    if (!reviewingDonor) return;
    try {
      await reviewBloodDonor({
        userId: reviewingDonor.donor.user_id,
        status: reviewingDonor.action,
        notes: reviewNotes,
      }).unwrap();

      if (reviewingDonor.action === "APPROVED") {
        toast.success(
          `Donor "${reviewingDonor.donor.name}" has been verified and granted BLOOD_DONOR role!`
        );
      } else {
        toast.error(`Donor application rejected.`);
      }
      setReviewingDonor(null);
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update verification status");
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* 1. Page Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-black text-brand-navy tracking-tight sm:text-2xl">
            Blood Donor Verification &amp; Registry
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Review hospital pathology reports and verify eligible blood donors across Bangladesh
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-bold text-emerald-700">
            {verifiedCount} Verified Donors
          </span>
          {pendingCount > 0 && (
            <span className="rounded-full bg-amber-50 border border-amber-200 px-3 py-1 text-xs font-bold text-amber-700 animate-pulse">
              {pendingCount} Pending Review
            </span>
          )}
          <button
            type="button"
            onClick={() => refetch()}
            className="grid size-8 place-items-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition cursor-pointer"
            title="Refresh"
          >
            <RefreshCw className={cn("size-3.5", isFetching && "animate-spin text-rose-600")} />
          </button>
        </div>
      </div>

      {/* 2. Filters Bar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative min-w-[260px] flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search donor name, phone, or location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-4 py-2 text-xs font-medium focus:border-brand-navy focus:bg-white focus:outline-none transition"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5">
            {["ALL", "PENDING", "APPROVED", "REJECTED"].map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={cn(
                  "rounded-xl px-3 py-1 text-xs font-bold transition cursor-pointer",
                  statusFilter === st
                    ? "bg-brand-navy text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                )}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Blood Group Filter */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100">
          <span className="text-[11px] font-bold text-slate-400 uppercase mr-1">Group:</span>
          {["ALL", "O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"].map((grp) => (
            <button
              key={grp}
              type="button"
              onClick={() => setGroupFilter(grp)}
              className={cn(
                "rounded-xl px-2.5 py-1 text-xs font-black transition cursor-pointer",
                groupFilter === grp
                  ? "bg-rose-600 text-white shadow-xs scale-105"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              )}
            >
              {grp}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Donors List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="flex h-64 flex-col items-center justify-center rounded-3xl border border-slate-200 bg-white">
            <Loader2 className="size-8 animate-spin text-rose-600" />
            <p className="mt-2 text-xs font-semibold text-slate-400">Loading donor applications...</p>
          </div>
        ) : donors.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-white p-12 text-center">
            <HeartPulse className="size-12 text-slate-300" />
            <h3 className="mt-3 text-sm font-bold text-brand-navy">No Donor Applications Found</h3>
            <p className="mt-1 text-xs text-slate-400 max-w-sm">
              No donors found matching the current search criteria or status filter.
            </p>
          </div>
        ) : (
          donors.map((donor) => (
            <div
              key={donor.user_id}
              className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs transition hover:border-slate-300 hover:shadow-md"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex items-start gap-3.5 min-w-0 flex-1">
                  <div className="grid size-12 shrink-0 place-items-center rounded-2xl bg-rose-50 text-rose-600 font-black text-sm ring-1 ring-rose-200">
                    {donor.blood_group}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm font-bold text-brand-navy">{donor.name}</h3>
                      <span
                        className={cn(
                          "rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase border",
                          donor.verification_status === "PENDING" &&
                            "bg-amber-50 text-amber-700 border-amber-200",
                          donor.verification_status === "APPROVED" &&
                            "bg-emerald-50 text-emerald-700 border-emerald-200",
                          donor.verification_status === "REJECTED" &&
                            "bg-rose-50 text-rose-700 border-rose-200"
                        )}
                      >
                        {donor.verification_status}
                      </span>
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">
                        {donor.availability}
                      </span>
                      {donor.submitted_at && (
                        <span className="text-xs text-slate-400">
                          Submitted {new Date(donor.submitted_at).toLocaleDateString()}
                        </span>
                      )}
                    </div>

                    <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <MapPin className="size-3.5 text-slate-400" />
                        {donor.location}
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <Phone className="size-3.5 text-slate-400" />
                        {donor.phone}
                      </span>
                      <span>·</span>
                      <span>
                        Last Donation:{" "}
                        <strong>
                          {donor.last_donation_date
                            ? new Date(donor.last_donation_date).toLocaleDateString()
                            : "None reported"}
                        </strong>
                      </span>
                    </div>

                    {/* Pathology Report / Attached Document */}
                    {donor.document_url && (
                      <div className="mt-3 flex items-center gap-2">
                        <span className="text-[11px] font-bold text-slate-400">
                          Pathology Proof:
                        </span>
                        <button
                          type="button"
                          onClick={() => setSelectedDocUrl(donor.document_url || null)}
                          className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50/70 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-rose-600 transition cursor-pointer"
                        >
                          <FileText className="size-3.5 text-rose-600" />
                          <span>{donor.hospital_name || "View Pathology Document"}</span>
                          <Eye className="size-3 text-slate-400 ml-1" />
                        </button>
                      </div>
                    )}

                    {donor.notes && (
                      <p className="mt-2 text-xs text-slate-500 italic bg-slate-50 p-2 rounded-xl border border-slate-100">
                        &ldquo;{donor.notes}&rdquo;
                      </p>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 shrink-0">
                  {donor.verification_status === "PENDING" ? (
                    <>
                      <button
                        type="button"
                        onClick={() => handleOpenReview(donor, "APPROVED")}
                        className="flex items-center gap-1.5 rounded-xl bg-rose-600 px-3.5 py-2 text-xs font-bold text-white shadow-xs hover:bg-rose-700 transition cursor-pointer"
                      >
                        <CheckCircle2 className="size-3.5" />
                        <span>Verify Donor</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleOpenReview(donor, "REJECTED")}
                        className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-bold text-brand-red hover:bg-red-100 transition cursor-pointer"
                      >
                        Reject
                      </button>
                    </>
                  ) : donor.verification_status === "APPROVED" ? (
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                        <ShieldCheck className="size-4" />
                        Verified Eligible
                      </span>
                      <button
                        type="button"
                        onClick={() => handleOpenReview(donor, "REJECTED")}
                        className="text-[11px] text-slate-400 hover:text-red-600 font-semibold cursor-pointer underline"
                      >
                        Revoke
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleOpenReview(donor, "APPROVED")}
                      className="text-xs font-bold text-rose-600 hover:underline cursor-pointer"
                    >
                      Re-verify Application
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 4. Document Viewer Modal */}
      {selectedDocUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="size-5 text-rose-600" />
                <h3 className="text-sm font-bold text-brand-navy">Submitted Pathology Report</h3>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={selectedDocUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs font-bold text-rose-600 hover:underline"
                >
                  <ExternalLink className="size-3.5" />
                  <span>Open Full Screen</span>
                </a>
                <button
                  type="button"
                  onClick={() => setSelectedDocUrl(null)}
                  className="grid size-8 place-items-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition cursor-pointer"
                >
                  <X className="size-4" />
                </button>
              </div>
            </div>

            <div className="max-h-[60vh] overflow-auto rounded-2xl border border-slate-100 bg-slate-50 flex items-center justify-center p-2">
              {selectedDocUrl.endsWith(".pdf") ? (
                <iframe src={selectedDocUrl} className="w-full h-96 rounded-xl" title="PDF Document" />
              ) : (
                <img
                  src={selectedDocUrl}
                  alt="Pathology Document"
                  className="max-h-[55vh] w-auto object-contain rounded-xl shadow-xs"
                />
              )}
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setSelectedDocUrl(null)}
                className="rounded-xl bg-slate-100 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-200 transition cursor-pointer"
              >
                Close Viewer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Review Approval / Rejection Confirmation Modal */}
      {reviewingDonor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-2 text-rose-600">
              {reviewingDonor.action === "APPROVED" ? (
                <ShieldCheck className="size-5 text-emerald-600" />
              ) : (
                <XCircle className="size-5 text-red-600" />
              )}
              <h3 className="text-base font-black text-brand-navy">
                {reviewingDonor.action === "APPROVED" ? "Verify Blood Donor" : "Reject Application"}
              </h3>
            </div>

            <p className="text-xs text-slate-500">
              {reviewingDonor.action === "APPROVED"
                ? `Confirming "${reviewingDonor.donor.name}" (${reviewingDonor.donor.blood_group}) will grant the BLOOD_DONOR role and make them eligible for urgent proximity matching.`
                : `Rejecting this application will notify "${reviewingDonor.donor.name}" to upload a valid report.`}
            </p>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">Reviewer Notes (Optional)</label>
              <textarea
                rows={2}
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-800 focus:bg-white focus:border-rose-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setReviewingDonor(null)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmReview}
                disabled={isSubmittingReview}
                className={cn(
                  "flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold text-white shadow-xs transition disabled:opacity-50 cursor-pointer",
                  reviewingDonor.action === "APPROVED"
                    ? "bg-emerald-600 hover:bg-emerald-700"
                    : "bg-red-600 hover:bg-red-700"
                )}
              >
                {isSubmittingReview ? (
                  <Loader2 className="size-3.5 animate-spin" />
                ) : reviewingDonor.action === "APPROVED" ? (
                  <CheckCircle2 className="size-3.5" />
                ) : (
                  <XCircle className="size-3.5" />
                )}
                <span>Confirm {reviewingDonor.action === "APPROVED" ? "Approval" : "Rejection"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
