"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import NearbyVolunteer from "@/views/nearby_volunteer/master.nearbyVolunteer";
import { useGetAdminVolunteersListQuery } from "@/redux/api/volunteerApi";
import { Loader2 } from "lucide-react";

function NearbyVolunteerContent() {
  const searchParams = useSearchParams();
  const searchName = searchParams.get("search_name") || "";

  const { data: volRes, isLoading } = useGetAdminVolunteersListQuery(
    { status: "ALL", search: searchName || undefined },
    { refetchOnMountOrArgChange: true }
  );

  const rawVolunteers = volRes?.data || [];

  const volunteers = rawVolunteers.map((v, index) => {
    const loc = [v.upazila, v.district].filter(Boolean).join(", ") || "ঢাকা, বাংলাদেশ";
    return {
      volunteer_id: v.userId,
      photo_path: (v as any).profilePhotoUrl || null,
      location_text: loc,
      availability_status: (v.volunteerStatus === "AVAILABLE" ? "online" : "offline") as "online" | "offline",
      rating: 4.8,
      name: v.name,
      phone: v.phone,
      distance: Number((0.8 + index * 0.4).toFixed(1)),
    };
  });

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f7fafc]">
        <Loader2 className="size-8 text-[#b51822] animate-spin" />
        <span className="ml-3 text-sm font-bold text-slate-600">নিকটবর্তী ভলান্টিয়ারদের খোঁজা হচ্ছে...</span>
      </div>
    );
  }

  return <NearbyVolunteer volunteers={volunteers} />;
}

export default function NearbyVolunteerPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-brand-canvas" />}>
      <NearbyVolunteerContent />
    </Suspense>
  );
}