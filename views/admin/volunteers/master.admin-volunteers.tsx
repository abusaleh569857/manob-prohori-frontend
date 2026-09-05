"use client";

import { useState } from "react";
import {
  UserCheck,
  ShieldCheck,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  FileText,
  MapPin,
  Award,
  Phone,
  Mail,
  AlertCircle,
  Clock,
  Eye,
  Loader2,
  ExternalLink,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  useGetAdminVolunteersListQuery,
  useVerifyVolunteerMutation,
  type AdminVolunteerListItem,
} from "@/redux/api/volunteerApi";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export function MasterAdminVolunteersComponent() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [rejectingVolunteer, setRejectingVolunteer] = useState<AdminVolunteerListItem | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [previewDoc, setPreviewDoc] = useState<{ url: string; name: string } | null>(null);

  // Real-time backend volunteer list query with 5s polling
  const { data: volResponse, isLoading, refetch } = useGetAdminVolunteersListQuery(
    {
      status: statusFilter,
      search: search.trim() || undefined,
    },
    { refetchOnMountOrArgChange: true }
  );

  const [verifyVolunteerMutation, { isLoading: isVerifying }] = useVerifyVolunteerMutation();

  const volunteers = volResponse?.data || [];

  const handleApprove = async (userId: number, name: string) => {
    try {
      const res = await verifyVolunteerMutation({
        userId,
        status: "APPROVED",
      }).unwrap();

      if (res.success) {
        toast.success(`Volunteer "${name}" approved successfully as active responder!`);
        refetch();
      }
    } catch (err: any) {
      toast.error(err?.data?.message || err?.message || "Failed to approve volunteer");
    }
  };

  const handleConfirmReject = async () => {
    if (!rejectingVolunteer) return;
    try {
      const res = await verifyVolunteerMutation({
        userId: rejectingVolunteer.userId,
        status: "REJECTED",
        rejectionReason: rejectionReason.trim() || "Verification documents insufficient or invalid.",
      }).unwrap();

      if (res.success) {
        toast.error(`Volunteer "${rejectingVolunteer.name}" application rejected.`);
        setRejectingVolunteer(null);
        setRejectionReason("");
        refetch();
      }
    } catch (err: any) {
      toast.error(err?.data?.message || err?.message || "Failed to reject volunteer");
    }
  };

  const handleSuspend = async (userId: number, name: string) => {
    try {
      const res = await verifyVolunteerMutation({
        userId,
        status: "SUSPENDED",
        rejectionReason: "Temporarily suspended by administrator.",
      }).unwrap();

      if (res.success) {
        toast.info(`Volunteer "${name}" duty access suspended.`);
        refetch();
      }
    } catch (err: any) {
      toast.error(err?.data?.message || err?.message || "Failed to suspend volunteer");
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-black text-brand-navy tracking-tight sm:text-2xl">
            Volunteer Verifications &amp; Responders Directory
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Review submitted training certificates, experience, and verify emergency responders
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-bold text-emerald-700">
            {volunteers.length} Responders Listed
          </span>
        </div>
      </div>

      {/* 2. Search and Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs">
        <div className="relative min-w-[260px] flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search volunteer name, phone, email, or district..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-4 py-2 text-xs font-medium focus:border-brand-navy focus:bg-white focus:outline-none transition"
          />
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          {["ALL", "PENDING", "APPROVED", "REJECTED", "SUSPENDED"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={cn(
                "rounded-xl px-3 py-1.5 text-xs font-bold transition cursor-pointer",
                statusFilter === status
                  ? "bg-brand-navy text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              )}
            >
              {status === "ALL" ? "All Applications" : status}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Volunteer Applications List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="flex h-64 items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-xs">
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="size-7 animate-spin text-brand-red" />
              <span className="text-xs font-bold text-slate-400">Loading Volunteer Applications...</span>
            </div>
          </div>
        ) : volunteers.length === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-xs">
            <UserCheck className="size-10 text-slate-300" />
            <h3 className="mt-3 text-sm font-bold text-brand-navy">No volunteer applications found</h3>
            <p className="mt-1 text-xs text-slate-400 max-w-sm">
              No registered volunteers match the selected filter criteria.
            </p>
          </div>
        ) : (
          volunteers.map((vol) => (
            <div
              key={vol.userId}
              className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs transition hover:border-slate-300"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                {/* Left Profile Details */}
                <div className="flex items-start gap-4 min-w-0">
                  <div className="grid size-12 shrink-0 place-items-center rounded-2xl bg-brand-navy text-white text-base font-black shadow-xs">
                    {vol.name ? vol.name.charAt(0).toUpperCase() : "V"}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <h3 className="text-base font-bold text-brand-navy">{vol.name}</h3>
                      <span
                        className={cn(
                          "rounded-md px-2 py-0.5 text-[10px] font-black uppercase border",
                          vol.verificationStatus === "APPROVED" && "bg-emerald-50 text-emerald-700 border-emerald-200",
                          vol.verificationStatus === "PENDING" && "bg-amber-50 text-amber-700 border-amber-200",
                          vol.verificationStatus === "REJECTED" && "bg-red-50 text-brand-red border-red-200",
                          vol.verificationStatus === "SUSPENDED" && "bg-slate-100 text-slate-600 border-slate-300"
                        )}
                      >
                        {vol.verificationStatus}
                      </span>
                      <span className="text-xs text-slate-400 font-medium">
                        Submitted {new Date(vol.submittedAt).toLocaleDateString()}
                      </span>
                    </div>

                    {vol.bio && (
                      <p className="mt-1 text-xs text-slate-600 font-medium">
                        {vol.bio}
                      </p>
                    )}

                    {vol.rejectionReason && vol.verificationStatus === "REJECTED" && (
                      <p className="mt-1 text-xs text-red-600 font-semibold bg-red-50 p-2 rounded-lg border border-red-100">
                        Rejection Reason: {vol.rejectionReason}
                      </p>
                    )}

                    {/* Metadata Grid */}
                    <div className="mt-2.5 flex flex-wrap items-center gap-4 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <MapPin className="size-3.5 text-slate-400" />
                        {vol.location || "Bangladesh"} ({vol.serviceRadius || "10 km"} radius)
                      </span>
                      <span className="flex items-center gap-1">
                        <Phone className="size-3.5 text-slate-400" />
                        {vol.phone}
                      </span>
                      <span className="flex items-center gap-1">
                        <Mail className="size-3.5 text-slate-400" />
                        {vol.email}
                      </span>
                      <span className="flex items-center gap-1 font-semibold text-brand-navy">
                        <Award className="size-3.5 text-amber-500" />
                        {vol.experienceYears || "1 yr Experience"}
                      </span>
                    </div>

                    {/* Skills Tags */}
                    {vol.skills && vol.skills.length > 0 && (
                      <div className="mt-3 flex flex-wrap items-center gap-1.5">
                        <span className="text-[11px] font-bold text-slate-400 mr-1">
                          Skills:
                        </span>
                        {vol.skills.map((skill, sIdx) => (
                          <span
                            key={sIdx}
                            className="rounded-lg bg-slate-100 border border-slate-200 px-2 py-0.5 text-[11px] font-bold text-slate-700"
                          >
                            {skill.name} · <strong className="text-brand-navy">{skill.level}</strong>
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Attached Documents */}
                    {vol.documents && vol.documents.length > 0 && (
                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        <span className="text-[11px] font-bold text-slate-400 mr-1">
                          Attached Proofs:
                        </span>
                        {vol.documents.map((doc, dIdx) => (
                          <button
                            key={dIdx}
                            type="button"
                            onClick={() => setPreviewDoc({ url: doc.url, name: doc.name || doc.notes || `Proof #${dIdx + 1}` })}
                            className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:border-slate-300 transition cursor-pointer"
                          >
                            <FileText className="size-3 text-brand-red" />
                            <span className="truncate max-w-[160px]">{doc.notes || doc.name || "Certificate.pdf"}</span>
                            <Eye className="size-3 text-slate-400 ml-1" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Action Buttons */}
                <div className="flex items-center gap-2 border-t border-slate-100 pt-3 lg:border-t-0 lg:pt-0 shrink-0">
                  {vol.verificationStatus === "PENDING" ? (
                    <>
                      <button
                        onClick={() => handleApprove(vol.userId, vol.name)}
                        disabled={isVerifying}
                        className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 transition cursor-pointer"
                      >
                        <CheckCircle2 className="size-3.5" />
                        Approve Responder
                      </button>
                      <button
                        onClick={() => setRejectingVolunteer(vol)}
                        disabled={isVerifying}
                        className="flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2 text-xs font-bold text-brand-red hover:bg-red-100 transition cursor-pointer"
                      >
                        <XCircle className="size-3.5" />
                        Reject
                      </button>
                    </>
                  ) : vol.verificationStatus === "APPROVED" ? (
                    <button
                      onClick={() => handleSuspend(vol.userId, vol.name)}
                      disabled={isVerifying}
                      className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-600 hover:bg-red-50 hover:text-brand-red hover:border-red-200 transition cursor-pointer"
                    >
                      Suspend Access
                    </button>
                  ) : (
                    <button
                      onClick={() => handleApprove(vol.userId, vol.name)}
                      disabled={isVerifying}
                      className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700 hover:bg-emerald-100 transition cursor-pointer"
                    >
                      Re-Approve
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Reject Reason Modal */}
      {rejectingVolunteer && (
        <Dialog open={true} onOpenChange={() => setRejectingVolunteer(null)}>
          <DialogContent className="max-w-md rounded-3xl p-6 relative">
            <button
              type="button"
              onClick={() => setRejectingVolunteer(null)}
              className="absolute right-5 top-5 grid size-8 place-items-center rounded-xl bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-brand-navy transition cursor-pointer"
              title="Close"
            >
              <X className="size-4" />
            </button>

            <DialogHeader className="pr-8">
              <DialogTitle className="text-lg font-black text-brand-navy">
                Reject Volunteer Application
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500">
                Specify a reason for rejecting <strong>{rejectingVolunteer.name}</strong>. This feedback will be displayed to the volunteer.
              </DialogDescription>
            </DialogHeader>

            <div className="mt-4 space-y-3">
              <label className="block text-xs font-bold text-slate-700">
                Rejection Reason / Required Action
              </label>
              <textarea
                rows={3}
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="e.g. Please re-upload a higher resolution copy of your CPR certificate."
                className="w-full rounded-xl border border-slate-200 p-3 text-xs focus:border-brand-red focus:outline-none"
              />
            </div>

            <div className="mt-5 flex items-center justify-end gap-2.5">
              <button
                onClick={() => setRejectingVolunteer(null)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReject}
                disabled={isVerifying}
                className="rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white hover:bg-red-700 shadow-xs"
              >
                Confirm Rejection
              </button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Document Preview Modal */}
      {previewDoc && (
        <Dialog open={true} onOpenChange={() => setPreviewDoc(null)}>
          <DialogContent className="max-w-3xl rounded-3xl p-6 relative">
            <button
              type="button"
              onClick={() => setPreviewDoc(null)}
              className="absolute right-5 top-5 grid size-9 place-items-center rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-brand-navy transition cursor-pointer z-30"
              title="Close Preview"
            >
              <X className="size-4.5" />
            </button>

            <DialogHeader className="pb-3 pr-14 border-b border-slate-100 flex flex-row items-center justify-between">
              <div>
                <DialogTitle className="text-base font-bold text-brand-navy">
                  Document Preview: {previewDoc.name}
                </DialogTitle>
              </div>
              <a
                href={previewDoc.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:underline mr-2"
              >
                Open in New Tab <ExternalLink className="size-3.5" />
              </a>
            </DialogHeader>

            <div className="mt-4 max-h-[70vh] overflow-auto flex items-center justify-center bg-slate-50 rounded-2xl p-4">
              {previewDoc.url.toLowerCase().endsWith(".pdf") ? (
                <iframe src={previewDoc.url} className="w-full h-[60vh] rounded-xl" />
              ) : (
                <img
                  src={previewDoc.url}
                  alt={previewDoc.name}
                  className="max-h-[60vh] max-w-full object-contain rounded-xl shadow-xs"
                />
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
