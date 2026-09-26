"use client";

import Link from "next/link";
import { UserCheck, HeartPulse, ShieldCheck, ArrowRight, Check, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  useGetAdminVolunteersListQuery,
  useVerifyVolunteerMutation,
} from "@/redux/api/volunteerApi";
import {
  useGetAdminBloodDonorsQuery,
  useReviewBloodDonorMutation,
} from "@/redux/api/bloodApi";

interface UnifiedPendingItem {
  id: string;
  userId: number;
  type: "VOLUNTEER" | "BLOOD_DONOR";
  name: string;
  detail: string;
  submittedAt: string;
  badge: string;
  badgeColor: string;
}

export function AdminPendingVerifications() {
  // 1. Fetch pending volunteers from Database
  const {
    data: volPendingRes,
    isLoading: isVolLoading,
    refetch: refetchVolunteers,
  } = useGetAdminVolunteersListQuery(
    { status: "PENDING" },
    { refetchOnMountOrArgChange: true }
  );

  // 2. Fetch pending blood donors from Database
  const {
    data: donorPendingRes,
    isLoading: isDonorLoading,
    refetch: refetchDonors,
  } = useGetAdminBloodDonorsQuery(
    { status: "PENDING" },
    { refetchOnMountOrArgChange: true }
  );

  const [verifyVolunteer, { isLoading: isVerifyingVol }] = useVerifyVolunteerMutation();
  const [reviewBloodDonor, { isLoading: isVerifyingDonor }] = useReviewBloodDonorMutation();

  const rawVolunteers = volPendingRes?.data || [];
  const rawDonors = donorPendingRes?.data?.donors || [];

  // Combine real database records
  const pendingItems: UnifiedPendingItem[] = [];

  rawVolunteers.forEach((v) => {
    const docNote = v.documents?.[0]?.notes || v.bio || "Volunteer Training & Experience Verification";
    const skillBadge = v.skills?.[0]?.name ? `${v.skills[0].name.toUpperCase()}` : "PARAMEDIC";

    pendingItems.push({
      id: `vol-${v.userId}`,
      userId: v.userId,
      type: "VOLUNTEER",
      name: v.name,
      detail: docNote,
      submittedAt: "15 mins ago",
      badge: skillBadge,
      badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    });
  });

  rawDonors.forEach((d) => {
    const bgName = d.blood_group || "BLOOD";
    const docNote = d.notes || d.hospital_name || "Pathology Blood Test & Verification Document";

    pendingItems.push({
      id: `donor-${d.user_id}`,
      userId: d.user_id,
      type: "BLOOD_DONOR",
      name: d.name,
      detail: docNote,
      submittedAt: "25 mins ago",
      badge: `${bgName} DONOR`,
      badgeColor: "bg-rose-50 text-rose-700 border-rose-200",
    });
  });

  const totalPending = pendingItems.length;

  const handleApprove = async (item: UnifiedPendingItem) => {
    try {
      if (item.type === "VOLUNTEER") {
        await verifyVolunteer({
          userId: item.userId,
          status: "APPROVED",
        }).unwrap();
        toast.success(`Volunteer "${item.name}" verified & approved!`);
        refetchVolunteers();
      } else {
        await reviewBloodDonor({
          userId: item.userId,
          status: "APPROVED",
          notes: "Approved by Admin on Overview Dashboard",
        }).unwrap();
        toast.success(`Blood donor "${item.name}" verified & approved!`);
        refetchDonors();
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to approve verification");
    }
  };

  const handleReject = async (item: UnifiedPendingItem) => {
    try {
      if (item.type === "VOLUNTEER") {
        await verifyVolunteer({
          userId: item.userId,
          status: "REJECTED",
          rejectionReason: "Incomplete documentation submitted.",
        }).unwrap();
        toast.info(`Volunteer "${item.name}" application rejected.`);
        refetchVolunteers();
      } else {
        await reviewBloodDonor({
          userId: item.userId,
          status: "REJECTED",
          notes: "Incomplete blood group test proof.",
        }).unwrap();
        toast.info(`Blood donor "${item.name}" application rejected.`);
        refetchDonors();
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to reject verification");
    }
  };

  const isLoading = isVolLoading || isDonorLoading;
  const isBusy = isVerifyingVol || isVerifyingDonor;

  return (
    <div className="flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs">
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-brand-navy flex items-center gap-2">
              Pending Verifications Queue
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 text-[10px] font-bold border",
                  totalPending > 0
                    ? "bg-amber-50 text-amber-700 border-amber-200"
                    : "bg-emerald-50 text-emerald-700 border-emerald-200"
                )}
              >
                {totalPending > 0 ? `${totalPending} Pending` : "Queue Up to Date"}
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Applications requiring admin document inspection &amp; approval
            </p>
          </div>
          <div className="grid size-8.5 place-items-center rounded-xl bg-slate-100 text-slate-600">
            <UserCheck className="size-4 text-brand-blue" />
          </div>
        </div>

        <div className="mt-3.5 space-y-3">
          {isLoading ? (
            <div className="flex items-center justify-center py-8 text-xs text-slate-400">
              <Loader2 className="size-4 animate-spin mr-2 text-brand-red" />
              Loading live verification queue...
            </div>
          ) : pendingItems.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400 font-medium">
              No pending applications in queue. All volunteers &amp; donors are verified!
            </div>
          ) : (
            pendingItems.map((item) => (
              <div
                key={item.id}
                className="group rounded-xl border border-slate-100 bg-slate-50/60 p-3.5 transition hover:border-slate-200 hover:bg-white hover:shadow-xs"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-white shadow-2xs font-bold text-xs text-brand-navy">
                      {item.type === "VOLUNTEER" ? (
                        <ShieldCheck className="size-4.5 text-emerald-600" />
                      ) : (
                        <HeartPulse className="size-4.5 text-rose-600" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-bold text-brand-navy truncate">
                          {item.name}
                        </h4>
                        <span
                          className={cn(
                            "rounded px-1.5 py-0.2 text-[9.5px] font-extrabold uppercase border",
                            item.badgeColor
                          )}
                        >
                          {item.badge}
                        </span>
                      </div>
                      <p className="mt-1 text-[11px] text-slate-600 line-clamp-1">
                        {item.detail}
                      </p>
                      <p className="mt-1 text-[10px] font-medium text-slate-400">
                        Submitted {item.submittedAt}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => handleApprove(item)}
                      disabled={isBusy}
                      title="Approve"
                      className="grid size-7.5 place-items-center rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition cursor-pointer disabled:opacity-50"
                    >
                      <Check className="size-3.5" />
                    </button>
                    <button
                      onClick={() => handleReject(item)}
                      disabled={isBusy}
                      title="Reject"
                      className="grid size-7.5 place-items-center rounded-lg border border-red-200 bg-red-50 text-brand-red hover:bg-red-100 transition cursor-pointer disabled:opacity-50"
                    >
                      <X className="size-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100">
        <Link
          href="/admin/volunteers"
          className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 hover:text-brand-navy transition"
        >
          <span>View All Pending Applications</span>
          <ArrowRight className="size-3.5" />
        </Link>
      </div>
    </div>
  );
}
