"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  HeartPulse,
  Search,
  MapPin,
  Phone,
  Clock,
  Plus,
  AlertTriangle,
  CheckCircle2,
  Navigation,
  Share2,
  Users,
  ShieldCheck,
  Building2,
  Calendar,
  X,
  Loader2,
  Filter,
} from "lucide-react";
import {
  useGetBloodRequestsQuery,
  useGetBloodGroupsQuery,
  useCreateBloodRequestMutation,
  useSearchVerifiedDonorsQuery,
} from "@/redux/api/bloodApi";
import { BloodRequest } from "@/types/blood.types";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export function MasterBloodDirectoryView() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState<"requests" | "donors">("requests");
  const [selectedGroup, setSelectedGroup] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State for creating urgent blood request
  const [formData, setFormData] = useState({
    bloodGroupId: 7, // default to O+
    requiredUnits: 1,
    hospitalName: "",
    contactPhone: "",
    neededBy: "",
    description: "",
    addressText: "",
    latitude: 23.8103, // default Dhaka coordinates
    longitude: 90.4125,
  });

  // Fetch Blood Groups
  const { data: groupsData } = useGetBloodGroupsQuery();
  const bloodGroups = groupsData?.data || [];

  // Fetch Blood Requests
  const {
    data: requestsData,
    isLoading: isLoadingRequests,
    refetch: refetchRequests,
  } = useGetBloodRequestsQuery({
    bloodGroup: selectedGroup === "ALL" ? undefined : selectedGroup,
    search: searchQuery || undefined,
    latitude: userCoords?.lat,
    longitude: userCoords?.lng,
    limit: 50,
  });

  // Fetch Verified Donors
  const {
    data: donorsData,
    isLoading: isLoadingDonors,
    refetch: refetchDonors,
  } = useSearchVerifiedDonorsQuery({
    bloodGroup: selectedGroup === "ALL" ? undefined : selectedGroup,
    search: searchQuery || undefined,
    limit: 50,
  });

  const [createBloodRequest, { isLoading: isSubmittingRequest }] =
    useCreateBloodRequestMutation();

  const bloodRequests: BloodRequest[] = requestsData?.data?.requests || [];
  const donorsList = donorsData?.data?.donors || [];

  const [isLocatingModal, setIsLocatingModal] = useState(false);

  // GPS Locate Near Me (Directory Filter)
  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserCoords(coords);
        setIsLocating(false);
        toast.success("Nearby requests sorted by your GPS location!");
      },
      (err) => {
        console.error("GPS error:", err);
        setIsLocating(false);
        toast.error("Could not fetch your GPS location. Please allow permissions.");
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // Auto-detect GPS specifically for Blood Request Creation Modal
  const handleDetectModalGPS = async () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }
    setIsLocatingModal(true);
    toast.info("Detecting your live GPS location...");

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        let detectedAddress = `📍 Live GPS (${lat.toFixed(4)}, ${lng.toFixed(4)})`;

        try {
          // Reverse geocoding via OpenStreetMap
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
            { headers: { "Accept-Language": "en,bn" } }
          );
          if (res.ok) {
            const data = await res.json();
            if (data?.display_name) {
              const parts = data.display_name.split(",").slice(0, 3).map((s: string) => s.trim()).join(", ");
              detectedAddress = parts || data.display_name;
            }
          }
        } catch {
          // Fallback to formatted coords
        }

        setFormData((prev) => ({
          ...prev,
          latitude: lat,
          longitude: lng,
          addressText: detectedAddress,
        }));
        setIsLocatingModal(false);
        toast.success(`📍 লোকেশন শনাক্ত হয়েছে: ${detectedAddress}`);
      },
      (err) => {
        setIsLocatingModal(false);
        console.error("GPS error:", err);
        if (err.code === err.PERMISSION_DENIED) {
          toast.error("লোকেশন পারমিশন ব্লক করা আছে। ব্রাউজার সেটিংসে গিয়ে Allow করুন।");
        } else {
          toast.error("জিপিএস লোকেশন পাওয়া সম্ভব হয়নি। অনুগ্রহ করে ম্যানুয়ালি লিখুন।");
        }
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // Open Create Request Modal
  const handleOpenModal = () => {
    if (!session) {
      toast.error("Please sign in to publish an emergency blood request");
      return;
    }
    setFormData((prev) => ({
      ...prev,
      contactPhone: session.user?.phone || prev.contactPhone,
    }));
    setIsModalOpen(true);
  };

  // Submit Blood Request
  const handleSubmitRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.hospitalName.trim()) {
      toast.error("Please enter the hospital name");
      return;
    }
    if (!formData.contactPhone.trim()) {
      toast.error("Please provide a contact phone number");
      return;
    }

    try {
      const res = await createBloodRequest({
        bloodGroupId: Number(formData.bloodGroupId),
        requiredUnits: Number(formData.requiredUnits),
        hospitalName: formData.hospitalName,
        contactPhone: formData.contactPhone,
        neededBy: formData.neededBy || undefined,
        description: formData.description || undefined,
        addressText: formData.addressText || undefined,
        latitude: formData.latitude,
        longitude: formData.longitude,
      }).unwrap();

      toast.success(
        `Blood request published! Alerted ${res.data.matchedDonorsCount} compatible donors nearby.`
      );
      setIsModalOpen(false);
      refetchRequests();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to create blood request. Please try again.");
    }
  };

  // Share Blood Request
  const handleShare = (req: BloodRequest) => {
    const text = `🚨 URGENT BLOOD NEEDED: ${req.blood_group_code} (${req.required_units} Bag) at ${req.hospital_name}. Contact: ${req.contact_phone} — Manob Prohori Emergency Network`;
    if (navigator.share) {
      navigator.share({ title: "Urgent Blood Request", text, url: window.location.href });
    } else {
      navigator.clipboard.writeText(text);
      toast.success("Request details copied to clipboard!");
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* 1. Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-rose-950 via-slate-900 to-brand-navy p-6 sm:p-10 text-white shadow-xl">
        <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 opacity-10 pointer-events-none">
          <HeartPulse className="size-96" />
        </div>

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-rose-400/30 bg-rose-500/10 px-3.5 py-1 text-xs font-bold text-rose-300">
            <span className="size-2 rounded-full bg-rose-500 animate-ping" />
            <span>24/7 National Emergency Blood Network</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
            Urgent Blood Matches &amp; Verified Donor Registry
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
            Connecting emergency patients directly with verified blood donors across Bangladesh. 
            Automated spatial proximity matching alerts compatible donors within minutes.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleOpenModal}
              className="flex items-center gap-2 rounded-2xl bg-rose-600 px-5 py-3 text-xs sm:text-sm font-bold text-white shadow-lg shadow-rose-600/30 hover:bg-rose-700 transition cursor-pointer"
            >
              <Plus className="size-4" />
              <span>Emergency Blood Request</span>
            </button>

            <Link
              href="/donor/dashboard"
              className="flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-xs sm:text-sm font-bold text-white backdrop-blur-md hover:bg-white/20 transition"
            >
              <ShieldCheck className="size-4 text-emerald-400" />
              <span>Donor Portal / Apply</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Navigation Tabs & Search Toolbar */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        {/* Switcher Tabs */}
        <div className="inline-flex rounded-2xl bg-slate-100 p-1">
          <button
            type="button"
            onClick={() => setActiveTab("requests")}
            className={cn(
              "flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition cursor-pointer",
              activeTab === "requests"
                ? "bg-white text-rose-600 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            )}
          >
            <AlertTriangle className="size-3.5 text-rose-500" />
            <span>Live Requests ({bloodRequests.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("donors")}
            className={cn(
              "flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition cursor-pointer",
              activeTab === "donors"
                ? "bg-white text-rose-600 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            )}
          >
            <Users className="size-3.5 text-slate-500" />
            <span>Verified Donors ({donorsList.length})</span>
          </button>
        </div>

        {/* Search and GPS Filter */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative min-w-[220px] flex-1 sm:w-64">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
            <input
              type="text"
              placeholder={activeTab === "requests" ? "Search hospital or address..." : "Search donor or district..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-10 pr-4 text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:border-rose-500 focus:outline-none shadow-2xs transition"
            />
          </div>

          <button
            type="button"
            onClick={handleLocateMe}
            disabled={isLocating}
            className={cn(
              "flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-bold shadow-2xs transition cursor-pointer",
              userCoords
                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
            )}
          >
            {isLocating ? (
              <Loader2 className="size-3.5 animate-spin text-slate-500" />
            ) : (
              <Navigation className="size-3.5 text-rose-600" />
            )}
            <span>{userCoords ? "GPS Active" : "Near Me"}</span>
          </button>
        </div>
      </div>

      {/* 3. Blood Group Filter Pills */}
      <div className="flex flex-wrap items-center gap-1.5 rounded-2xl border border-slate-200/80 bg-white p-3 shadow-2xs">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider pl-1 mr-1">
          Blood Group:
        </span>
        {["ALL", "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((grp) => (
          <button
            key={grp}
            type="button"
            onClick={() => setSelectedGroup(grp)}
            className={cn(
              "rounded-xl px-3 py-1 text-xs font-black transition cursor-pointer",
              selectedGroup === grp
                ? "bg-rose-600 text-white shadow-xs scale-105"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            )}
          >
            {grp}
          </button>
        ))}
      </div>

      {/* 4. Tab Content: Live Urgent Requests */}
      {activeTab === "requests" && (
        <div className="space-y-4">
          {isLoadingRequests ? (
            <div className="flex h-64 flex-col items-center justify-center rounded-3xl border border-slate-200 bg-white">
              <Loader2 className="size-8 animate-spin text-rose-600" />
              <p className="mt-2 text-xs font-semibold text-slate-400">Loading urgent blood requests...</p>
            </div>
          ) : bloodRequests.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-white p-12 text-center">
              <HeartPulse className="size-12 text-slate-300" />
              <h3 className="mt-3 text-sm font-bold text-brand-navy">No Active Blood Requests</h3>
              <p className="mt-1 text-xs text-slate-400 max-w-sm">
                No active requests found for group <strong>{selectedGroup}</strong>. If someone needs urgent blood, submit a request now.
              </p>
              <button
                type="button"
                onClick={handleOpenModal}
                className="mt-4 flex items-center gap-1.5 rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-rose-700 transition cursor-pointer"
              >
                <Plus className="size-3.5" />
                <span>Create Blood Request</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              {bloodRequests.map((req) => (
                <div
                  key={req.id}
                  className="group relative flex flex-col justify-between rounded-3xl border border-slate-200/90 bg-white p-5 shadow-xs transition hover:border-rose-200 hover:shadow-md"
                >
                  <div>
                    {/* Header: Blood Group + Badges */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="grid size-14 place-items-center rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 font-black text-lg shadow-2xs">
                          {req.blood_group_code}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="rounded-full bg-red-50 border border-red-200 px-2.5 py-0.5 text-[11px] font-extrabold text-brand-red uppercase">
                              {req.required_units} {Number(req.required_units) > 1 ? "Bags" : "Bag"} Needed
                            </span>
                            <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                              {req.status}
                            </span>
                          </div>
                          <h3 className="mt-1 text-sm font-bold text-brand-navy group-hover:text-rose-600 transition">
                            {req.hospital_name}
                          </h3>
                        </div>
                      </div>

                      {req.distance_km != null && (
                        <div className="flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-600">
                          <Navigation className="size-3 text-rose-600" />
                          <span>{req.distance_km} km away</span>
                        </div>
                      )}
                    </div>

                    {/* Request Details */}
                    <div className="mt-4 space-y-2 text-xs text-slate-500">
                      {req.address_text && (
                        <p className="flex items-center gap-1.5">
                          <MapPin className="size-3.5 text-slate-400 shrink-0" />
                          <span>{req.address_text}</span>
                        </p>
                      )}

                      {req.needed_by && (
                        <p className="flex items-center gap-1.5 text-amber-700 font-medium">
                          <Clock className="size-3.5 text-amber-500 shrink-0" />
                          <span>Needed By: {new Date(req.needed_by).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</span>
                        </p>
                      )}

                      {req.description && (
                        <p className="rounded-xl bg-slate-50 p-2.5 text-xs text-slate-700 font-medium italic border border-slate-100">
                          &ldquo;{req.description}&rdquo;
                        </p>
                      )}

                      <div className="pt-1 flex items-center gap-2 text-[11px] text-slate-400 font-medium">
                        <span>Patient Contact: <strong>{req.requester_name}</strong></span>
                        <span>·</span>
                        <span>{req.matches_count || 0} donors notified</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="mt-5 flex items-center justify-between gap-2 border-t border-slate-100 pt-3">
                    <a
                      href={`tel:${req.contact_phone}`}
                      className="flex items-center gap-1.5 rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-rose-700 transition"
                    >
                      <Phone className="size-3.5" />
                      <span>Call {req.contact_phone}</span>
                    </a>

                    <button
                      type="button"
                      onClick={() => handleShare(req)}
                      className="flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                    >
                      <Share2 className="size-3.5" />
                      <span>Share</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 5. Tab Content: Verified Donors */}
      {activeTab === "donors" && (
        <div className="space-y-4">
          {isLoadingDonors ? (
            <div className="flex h-64 flex-col items-center justify-center rounded-3xl border border-slate-200 bg-white">
              <Loader2 className="size-8 animate-spin text-rose-600" />
              <p className="mt-2 text-xs font-semibold text-slate-400">Loading verified donors...</p>
            </div>
          ) : donorsList.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-white p-12 text-center">
              <Users className="size-12 text-slate-300" />
              <h3 className="mt-3 text-sm font-bold text-brand-navy">No Verified Donors Found</h3>
              <p className="mt-1 text-xs text-slate-400 max-w-sm">
                No active verified donors for blood group <strong>{selectedGroup}</strong>. Become a hero and register your blood group today!
              </p>
              <Link
                href="/donor/register"
                className="mt-4 flex items-center gap-1.5 rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-rose-700 transition"
              >
                <Plus className="size-3.5" />
                <span>Register as Blood Donor</span>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {donorsList.map((donor: any) => (
                <div
                  key={donor.user_id}
                  className="flex flex-col justify-between rounded-3xl border border-slate-200/90 bg-white p-5 shadow-xs transition hover:border-slate-300 hover:shadow-md"
                >
                  <div className="flex items-start gap-3.5">
                    <div className="grid size-12 shrink-0 place-items-center rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 font-black text-sm shadow-2xs">
                      {donor.blood_group}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-xs sm:text-sm font-bold text-brand-navy truncate">
                          {donor.name}
                        </h3>
                        <span title="Verified Eligible Donor">
                          <ShieldCheck className="size-4 text-emerald-600 shrink-0" />
                        </span>
                      </div>

                      <div className="mt-1 flex items-center gap-1 text-[11px] text-slate-500">
                        <MapPin className="size-3 text-slate-400 shrink-0" />
                        <span className="truncate">{donor.location}</span>
                      </div>

                      <div className="mt-1 flex items-center gap-2 text-[11px] text-slate-400">
                        <span className="rounded-full bg-emerald-50 px-2 py-0.5 font-bold text-emerald-700 text-[10px] border border-emerald-200">
                          {donor.availability}
                        </span>
                        {donor.last_donation_date && (
                          <span>Last donated: {new Date(donor.last_donation_date).toLocaleDateString()}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 border-t border-slate-100 pt-3">
                    <a
                      href={`tel:${donor.phone}`}
                      className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50/70 py-2 text-xs font-bold text-rose-700 hover:bg-rose-100 transition"
                    >
                      <Phone className="size-3.5" />
                      <span>Contact Donor</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 6. Create Blood Request Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl my-8">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="absolute right-4 top-4 grid size-8 place-items-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition cursor-pointer"
            >
              <X className="size-4" />
            </button>

            <div className="flex items-center gap-2 text-rose-600">
              <HeartPulse className="size-5" />
              <h2 className="text-lg font-black text-brand-navy">Create Emergency Blood Request</h2>
            </div>
            <p className="mt-1 text-xs text-slate-400">
              Broadcast an urgent request to verified compatible donors in proximity
            </p>

            <form onSubmit={handleSubmitRequest} className="mt-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                {/* Blood Group Select */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Blood Group *</label>
                  <select
                    value={formData.bloodGroupId}
                    onChange={(e) => setFormData({ ...formData, bloodGroupId: Number(e.target.value) })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/70 p-2.5 font-bold text-brand-navy focus:bg-white focus:border-rose-500 focus:outline-none"
                    required
                  >
                    {bloodGroups.map((bg) => (
                      <option key={bg.id} value={bg.id}>
                        {bg.code} ({bg.name})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Required Units */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Units (Bags) Needed *</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={formData.requiredUnits}
                    onChange={(e) => setFormData({ ...formData, requiredUnits: Number(e.target.value) })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/70 p-2.5 font-bold text-brand-navy focus:bg-white focus:border-rose-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              {/* Hospital Name */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Hospital / Medical Center *</label>
                <input
                  type="text"
                  placeholder="e.g. Dhaka Medical College Hospital, Bed 402"
                  value={formData.hospitalName}
                  onChange={(e) => setFormData({ ...formData, hospitalName: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/70 p-2.5 text-xs text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-rose-500 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* Contact Phone */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Contact Phone *</label>
                  <input
                    type="tel"
                    placeholder="+8801..."
                    value={formData.contactPhone}
                    onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/70 p-2.5 text-xs text-slate-800 focus:bg-white focus:border-rose-500 focus:outline-none"
                    required
                  />
                </div>

                {/* Needed By */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Needed By (Time/Date)</label>
                  <input
                    type="datetime-local"
                    value={formData.neededBy}
                    onChange={(e) => setFormData({ ...formData, neededBy: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/70 p-2.5 text-xs text-slate-800 focus:bg-white focus:border-rose-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Address / Location */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Location / Address</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. Shahbagh, Dhaka"
                    value={formData.addressText}
                    onChange={(e) => setFormData({ ...formData, addressText: e.target.value })}
                    className="flex-1 rounded-xl border border-slate-200 bg-slate-50/70 p-2.5 text-xs text-slate-800 focus:bg-white focus:border-rose-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleDetectModalGPS}
                    disabled={isLocatingModal}
                    className="flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2 text-[11px] font-bold text-brand-red hover:bg-rose-100 transition cursor-pointer disabled:opacity-50"
                    title="Detect GPS coordinates and auto-fill address"
                  >
                    {isLocatingModal ? (
                      <Loader2 className="size-3.5 animate-spin text-brand-red" />
                    ) : (
                      <Navigation className="size-3.5 text-brand-red" />
                    )}
                    <span>{isLocatingModal ? "Locating..." : "GPS"}</span>
                  </button>
                </div>
              </div>

              {/* Patient Condition / Description */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Patient Condition / Urgency Note</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Emergency surgery scheduled at 2:00 PM, patient O+ positive needed urgently..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/70 p-2.5 text-xs text-slate-800 focus:bg-white focus:border-rose-500 focus:outline-none"
                />
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingRequest}
                  className="flex items-center gap-1.5 rounded-xl bg-rose-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-rose-600/30 hover:bg-rose-700 transition disabled:opacity-50 cursor-pointer"
                >
                  {isSubmittingRequest ? (
                    <Loader2 className="size-4 animate-spin text-white" />
                  ) : (
                    <HeartPulse className="size-4" />
                  )}
                  <span>Publish &amp; Alert Donors</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
