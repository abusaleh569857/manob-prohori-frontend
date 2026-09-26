"use client";

import { useState } from "react";
import Link from "next/link";
import {
  HeartHandshake,
  Search,
  CheckCircle2,
  XCircle,
  FileText,
  MapPin,
  Phone,
  Eye,
  ShieldCheck,
  AlertCircle,
  Loader2,
  RefreshCw,
  X,
  ExternalLink,
  CreditCard,
} from "lucide-react";
import {
  useGetAdminReliefRequestsQuery,
  useReviewReliefRequestMutation,
} from "@/redux/api/reliefApi";
import { ReliefCampaign } from "@/types/relief.types";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export function MasterAdminReliefView() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Document Viewer Modal State
  const [selectedDocUrl, setSelectedDocUrl] = useState<string | null>(null);

  // Review Modal State
  const [reviewingRequest, setReviewingRequest] = useState<{
    campaign: ReliefCampaign;
    action: "APPROVED" | "REJECTED";
  } | null>(null);
  const [reviewNotes, setReviewNotes] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");

  const {
    data: requestsData,
    isLoading,
    isFetching,
    refetch,
  } = useGetAdminReliefRequestsQuery({
    search: search || undefined,
    status: statusFilter === "ALL" ? undefined : statusFilter,
    limit: 50,
  });

  const [reviewReliefRequest, { isLoading: isSubmittingReview }] =
    useReviewReliefRequestMutation();

  const requests: ReliefCampaign[] = requestsData?.data?.requests || [];
  const totalCount = requestsData?.data?.total || 0;
  const pendingCount = requests.filter((r) => r.status === "PENDING").length;
  const approvedCount = requests.filter((r) => r.status === "APPROVED").length;

  const handleOpenReview = (campaign: ReliefCampaign, action: "APPROVED" | "REJECTED") => {
    setReviewingRequest({ campaign, action });
    setReviewNotes(
      action === "APPROVED"
        ? "Verified damage photos and victim mobile financial accounts"
        : "Insufficient or unverified documentation"
    );
    setRejectionReason(
      action === "REJECTED" ? "Supporting evidence could not be authenticated." : ""
    );
  };

  const handleConfirmReview = async () => {
    if (!reviewingRequest) return;

    try {
      await reviewReliefRequest({
        id: reviewingRequest.campaign.id,
        status: reviewingRequest.action,
        publicVisibility: reviewingRequest.action === "APPROVED",
        notes: reviewNotes,
        rejectionReason: reviewingRequest.action === "REJECTED" ? rejectionReason : undefined,
      }).unwrap();

      if (reviewingRequest.action === "APPROVED") {
        toast.success(
          `Relief Campaign "${reviewingRequest.campaign.title}" is now APPROVED and published publicly!`
        );
      } else {
        toast.error(`Relief application rejected.`);
      }

      setReviewingRequest(null);
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update review status");
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* 1. Page Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-black text-brand-navy tracking-tight sm:text-2xl">
            Emergency Relief Review &amp; Verification
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Review disaster proof, verify victim financial accounts, and authorize public relief campaigns
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-bold text-emerald-700">
            {approvedCount} Active Campaigns
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
            <RefreshCw className={cn("size-3.5", isFetching && "animate-spin text-emerald-600")} />
          </button>
        </div>
      </div>

      {/* 2. Filters Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs">
        <div className="relative min-w-[260px] flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search campaigns, victims, phone, or location..."
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

      {/* 3. Requests List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="flex h-64 flex-col items-center justify-center rounded-3xl border border-slate-200 bg-white">
            <Loader2 className="size-8 animate-spin text-emerald-600" />
            <p className="mt-2 text-xs font-semibold text-slate-400">Loading relief requests...</p>
          </div>
        ) : requests.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-white p-12 text-center">
            <HeartHandshake className="size-12 text-slate-300" />
            <h3 className="mt-3 text-sm font-bold text-brand-navy">No Relief Requests Found</h3>
            <p className="mt-1 text-xs text-slate-400 max-w-sm">
              No applications match your search or status filter.
            </p>
          </div>
        ) : (
          requests.map((r) => (
            <div
              key={r.id}
              className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs transition hover:border-slate-300 hover:shadow-md"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                {/* Details */}
                <div className="min-w-0 flex-1 space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={cn(
                        "rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase border",
                        r.status === "PENDING" && "bg-amber-50 text-amber-700 border-amber-200",
                        r.status === "APPROVED" && "bg-emerald-50 text-emerald-700 border-emerald-200",
                        r.status === "REJECTED" && "bg-rose-50 text-rose-700 border-rose-200"
                      )}
                    >
                      {r.status}
                    </span>
                    <span className="text-xs text-slate-400">
                      Submitted {new Date(r.submitted_at).toLocaleDateString()}
                    </span>
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">
                      Goal: ৳{Number(r.required_amount).toLocaleString()}
                    </span>
                    {r.current_amount > 0 && (
                      <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                        Raised: ৳{Number(r.current_amount).toLocaleString()}
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-brand-navy">{r.title}</h3>
                    <p className="mt-1 text-xs text-slate-600 leading-relaxed max-w-3xl">
                      {r.description}
                    </p>
                  </div>

                  {/* Requester & Location info */}
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                    <span>
                      Applicant: <strong>{r.requester_name}</strong>
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Phone className="size-3.5 text-slate-400" />
                      {r.contact_phone}
                    </span>
                    {r.address_text && (
                      <>
                        <span>·</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="size-3.5 text-slate-400" />
                          {r.address_text}
                        </span>
                      </>
                    )}
                  </div>

                  {/* Payment Accounts */}
                  <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] font-semibold">
                    {r.bkash_number && (
                      <span className="rounded-lg bg-pink-50 border border-pink-200 px-2.5 py-1 text-pink-700">
                        bKash: {r.bkash_number}
                      </span>
                    )}
                    {r.nagad_number && (
                      <span className="rounded-lg bg-orange-50 border border-orange-200 px-2.5 py-1 text-orange-700">
                        Nagad: {r.nagad_number}
                      </span>
                    )}
                    {r.rocket_number && (
                      <span className="rounded-lg bg-purple-50 border border-purple-200 px-2.5 py-1 text-purple-700">
                        Rocket: {r.rocket_number}
                      </span>
                    )}
                  </div>

                  {/* Attached Documents */}
                  {r.documents && r.documents.length > 0 && (
                    <div className="flex items-center gap-2 pt-1">
                      <span className="text-[11px] font-bold text-slate-400">Attached Proof:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {r.documents.map((doc) => (
                          <button
                            key={doc.id}
                            type="button"
                            onClick={() => setSelectedDocUrl(doc.file_url)}
                            className="flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-emerald-700 transition cursor-pointer"
                          >
                            <FileText className="size-3 text-emerald-600" />
                            <span>{doc.document_type}</span>
                            <Eye className="size-3 text-slate-400 ml-0.5" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {r.rejection_reason && (
                    <p className="text-xs text-red-600 bg-red-50 p-2.5 rounded-xl border border-red-100">
                      Rejection Reason: {r.rejection_reason}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0 self-start sm:self-center">
                  {r.status === "PENDING" ? (
                    <>
                      <button
                        type="button"
                        onClick={() => handleOpenReview(r, "APPROVED")}
                        className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 transition cursor-pointer"
                      >
                        <CheckCircle2 className="size-3.5" />
                        <span>Verify &amp; Publish</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleOpenReview(r, "REJECTED")}
                        className="rounded-xl border border-red-200 bg-red-50 px-3.5 py-2 text-xs font-bold text-brand-red hover:bg-red-100 transition cursor-pointer"
                      >
                        Reject
                      </button>
                    </>
                  ) : r.status === "APPROVED" ? (
                    <div className="flex items-center gap-2">
                      <Link
                        href="/relief"
                        target="_blank"
                        className="flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100 transition"
                      >
                        <ExternalLink className="size-3" />
                        <span>View Live</span>
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleOpenReview(r, "REJECTED")}
                        className="text-[11px] text-slate-400 hover:text-red-600 font-semibold cursor-pointer underline"
                      >
                        Revoke
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleOpenReview(r, "APPROVED")}
                      className="text-xs font-bold text-emerald-600 hover:underline cursor-pointer"
                    >
                      Re-approve Campaign
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
                <FileText className="size-5 text-emerald-600" />
                <h3 className="text-sm font-bold text-brand-navy">Disaster Proof Document</h3>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={selectedDocUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs font-bold text-emerald-600 hover:underline"
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
                  alt="Proof Document"
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

      {/* 5. Review Confirmation Modal */}
      {reviewingRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-2 text-emerald-600">
              {reviewingRequest.action === "APPROVED" ? (
                <ShieldCheck className="size-5 text-emerald-600" />
              ) : (
                <XCircle className="size-5 text-red-600" />
              )}
              <h3 className="text-base font-black text-brand-navy">
                {reviewingRequest.action === "APPROVED" ? "Approve & Publish Campaign" : "Reject Application"}
              </h3>
            </div>

            <p className="text-xs text-slate-500">
              {reviewingRequest.action === "APPROVED"
                ? `Confirming "${reviewingRequest.campaign.title}" will make it visible on the public relief hub with direct bKash/Nagad donation capabilities.`
                : `Rejecting will decline this relief campaign and record your rejection reason.`}
            </p>

            {reviewingRequest.action === "REJECTED" && (
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">Rejection Reason</label>
                <input
                  type="text"
                  placeholder="e.g. Incomplete damage evidence or unreachable phone"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-800 focus:bg-white focus:border-red-500 focus:outline-none"
                  required
                />
              </div>
            )}

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">Reviewer Notes (Optional)</label>
              <textarea
                rows={2}
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-800 focus:bg-white focus:border-emerald-600 focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setReviewingRequest(null)}
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
                  reviewingRequest.action === "APPROVED"
                    ? "bg-emerald-600 hover:bg-emerald-700"
                    : "bg-red-600 hover:bg-red-700"
                )}
              >
                {isSubmittingReview ? (
                  <Loader2 className="size-3.5 animate-spin" />
                ) : reviewingRequest.action === "APPROVED" ? (
                  <CheckCircle2 className="size-3.5" />
                ) : (
                  <XCircle className="size-3.5" />
                )}
                <span>Confirm {reviewingRequest.action === "APPROVED" ? "Approval" : "Rejection"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
