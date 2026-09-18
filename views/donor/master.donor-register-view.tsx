"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  HeartPulse,
  ShieldCheck,
  UploadCloud,
  FileText,
  MapPin,
  Calendar,
  Building2,
  Navigation,
  CheckCircle2,
  Loader2,
  AlertCircle,
  Eye,
  X,
} from "lucide-react";
import {
  useGetBloodGroupsQuery,
  useApplyAsDonorMutation,
  useGetMyDonorProfileQuery,
} from "@/redux/api/bloodApi";
import { uploadSingleFile } from "@/lib/upload-service";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export function MasterDonorRegisterView() {
  const router = useRouter();
  const { data: session } = useSession();

  const { data: groupsData, isLoading: isLoadingGroups } = useGetBloodGroupsQuery();
  const { data: myProfileData } = useGetMyDonorProfileQuery();
  const [applyAsDonor, { isLoading: isSubmitting }] = useApplyAsDonorMutation();

  const bloodGroups = groupsData?.data || [];
  const existingProfile = myProfileData?.data;

  // Form State
  const [bloodGroupId, setBloodGroupId] = useState<number>(7); // Default O+
  const [lastDonationDate, setLastDonationDate] = useState<string>("");
  const [availability, setAvailability] = useState<"AVAILABLE" | "UNAVAILABLE">("AVAILABLE");
  const [hospitalName, setHospitalName] = useState("");
  const [reportDate, setReportDate] = useState("");
  const [notes, setNotes] = useState("");
  const [addressText, setAddressText] = useState("");
  const [latitude, setLatitude] = useState<number>(23.8103);
  const [longitude, setLongitude] = useState<number>(90.4125);
  const [isLocating, setIsLocating] = useState(false);

  // File Upload State
  const [docFile, setDocFile] = useState<File | null>(null);
  const [docPreviewUrl, setDocPreviewUrl] = useState<string>("");
  const [isUploadingFile, setIsUploadingFile] = useState(false);

  // Handle GPS Auto-detect
  const handleDetectGPS = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation not supported by your browser");
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLatitude(pos.coords.latitude);
        setLongitude(pos.coords.longitude);
        setIsLocating(false);
        toast.success("GPS Location detected successfully!");
      },
      (err) => {
        console.error(err);
        setIsLocating(false);
        toast.error("Could not fetch GPS. Please ensure location permissions are allowed.");
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // Handle File Selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      toast.error("Document file size must be less than 8MB");
      return;
    }

    setDocFile(file);
    if (file.type.startsWith("image/")) {
      setDocPreviewUrl(URL.createObjectURL(file));
    } else {
      setDocPreviewUrl("/images/pdf-icon.png");
    }
  };

  // Submit Application
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!docFile && !existingProfile?.latest_verification?.document_url) {
      toast.error("Please upload a hospital pathology report or blood group card");
      return;
    }

    try {
      let finalDocUrl = existingProfile?.latest_verification?.document_url || "";

      if (docFile) {
        setIsUploadingFile(true);
        toast.info("Uploading verification document...");
        finalDocUrl = await uploadSingleFile(docFile);
        setIsUploadingFile(false);
      }

      await applyAsDonor({
        bloodGroupId: Number(bloodGroupId),
        availability,
        lastDonationDate: lastDonationDate || undefined,
        latitude,
        longitude,
        hospitalName: hospitalName || undefined,
        reportDate: reportDate || undefined,
        documentUrl: finalDocUrl,
        notes: notes || undefined,
      }).unwrap();

      toast.success(
        "Application submitted successfully! Your pathology report is now under verification."
      );
      router.push("/donor/dashboard");
    } catch (err: any) {
      setIsUploadingFile(false);
      toast.error(err?.data?.message || err?.message || "Failed to submit application");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      {/* 1. Header Banner */}
      <div className="rounded-3xl border border-rose-200/90 bg-linear-to-r from-rose-50 via-white to-amber-50/40 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-rose-100 px-3 py-0.5 text-xs font-black text-rose-700">
              <HeartPulse className="size-3.5" />
              <span>Verified Life Saver Registry</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-brand-navy tracking-tight">
              Blood Donor Registration &amp; Verification
            </h1>
            <p className="text-xs text-slate-500 max-w-xl">
              Apply to join Bangladesh&apos;s verified blood network. To protect patient safety and prevent fraud, 
              we require a verified hospital report or blood donation card.
            </p>
          </div>

          <div className="grid size-16 shrink-0 place-items-center rounded-2xl bg-rose-600 text-white shadow-lg shadow-rose-600/20">
            <ShieldCheck className="size-8" />
          </div>
        </div>
      </div>

      {/* Already registered notice if pending/approved */}
      {existingProfile && (
        <div
          className={cn(
            "flex items-start gap-3 rounded-2xl border p-4 text-xs font-semibold",
            existingProfile.verification_status === "APPROVED"
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : existingProfile.verification_status === "PENDING"
              ? "border-amber-200 bg-amber-50 text-amber-800"
              : "border-rose-200 bg-rose-50 text-rose-800"
          )}
        >
          <AlertCircle className="size-4 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold">
              Current Status: {existingProfile.verification_status} ({existingProfile.blood_group_code})
            </p>
            <p className="text-[11px] opacity-90">
              {existingProfile.verification_status === "APPROVED"
                ? "Your profile is verified. Submitting this form will update your information or upload a refreshed report."
                : "Your application is currently pending admin review. You can update your details below."}
            </p>
          </div>
        </div>
      )}

      {/* 2. Registration Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1: Blood Group Selection */}
        <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <div className="grid size-8 place-items-center rounded-xl bg-rose-50 text-rose-600 font-bold text-xs">
              1
            </div>
            <div>
              <h2 className="text-sm font-bold text-brand-navy">Select Your Blood Group</h2>
              <p className="text-[11px] text-slate-400">Accurate blood group identification is critical for life-saving matches</p>
            </div>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2.5 pt-1">
            {bloodGroups.map((grp) => (
              <button
                type="button"
                key={grp.id}
                onClick={() => setBloodGroupId(grp.id)}
                className={cn(
                  "flex flex-col items-center justify-center rounded-2xl py-3 px-2 border text-center transition cursor-pointer",
                  bloodGroupId === grp.id
                    ? "border-rose-500 bg-rose-600 text-white shadow-md shadow-rose-600/20 scale-105"
                    : "border-slate-200 bg-slate-50/70 text-slate-700 hover:bg-slate-100 hover:border-slate-300"
                )}
              >
                <span className="text-base font-black tracking-tight">{grp.code}</span>
                <span className="text-[9px] font-bold opacity-80 mt-0.5 truncate w-full">
                  {grp.name.replace(" Positive", "+").replace(" Negative", "-")}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Step 2: Donation History & Availability */}
        <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <div className="grid size-8 place-items-center rounded-xl bg-rose-50 text-rose-600 font-bold text-xs">
              2
            </div>
            <div>
              <h2 className="text-sm font-bold text-brand-navy">Donation History &amp; Availability</h2>
              <p className="text-[11px] text-slate-400">Help patients know when you are eligible and ready to donate</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* Last Donation Date */}
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">
                Last Blood Donation Date (If any)
              </label>
              <input
                type="date"
                value={lastDonationDate}
                onChange={(e) => setLastDonationDate(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/70 p-2.5 font-medium text-slate-800 focus:bg-white focus:border-rose-500 focus:outline-none"
              />
              <p className="text-[10px] text-slate-400 mt-1">Leave empty if you have never donated before</p>
            </div>

            {/* Availability */}
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">
                Immediate Availability Status *
              </label>
              <select
                value={availability}
                onChange={(e) => setAvailability(e.target.value as any)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/70 p-2.5 font-bold text-brand-navy focus:bg-white focus:border-rose-500 focus:outline-none"
              >
                <option value="AVAILABLE">AVAILABLE (I am ready to donate when needed)</option>
                <option value="UNAVAILABLE">UNAVAILABLE (Currently paused or recently donated)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Step 3: Location & Spatial Proximity */}
        <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <div className="grid size-8 place-items-center rounded-xl bg-rose-50 text-rose-600 font-bold text-xs">
              3
            </div>
            <div>
              <h2 className="text-sm font-bold text-brand-navy">Location &amp; GPS Proximity</h2>
              <p className="text-[11px] text-slate-400">Used by the automated radar to match urgent blood requests near your area</p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">Residential / Workplace Area</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. Dhanmondi, Dhaka or Agrabad, Chittagong"
                  value={addressText}
                  onChange={(e) => setAddressText(e.target.value)}
                  className="flex-1 rounded-xl border border-slate-200 bg-slate-50/70 p-2.5 font-medium text-slate-800 focus:bg-white focus:border-rose-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleDetectGPS}
                  disabled={isLocating}
                  className="flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2 font-bold text-rose-700 hover:bg-rose-100 transition cursor-pointer"
                >
                  {isLocating ? (
                    <Loader2 className="size-3.5 animate-spin" />
                  ) : (
                    <Navigation className="size-3.5 text-rose-600" />
                  )}
                  <span>Detect GPS</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-[11px] text-slate-400 font-mono">
              <span>Latitude: {latitude.toFixed(5)}</span>
              <span>Longitude: {longitude.toFixed(5)}</span>
            </div>
          </div>
        </div>

        {/* Step 4: Medical Verification Document */}
        <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <div className="grid size-8 place-items-center rounded-xl bg-rose-50 text-rose-600 font-bold text-xs">
              4
            </div>
            <div>
              <h2 className="text-sm font-bold text-brand-navy">Pathology Report / Blood Group Proof *</h2>
              <p className="text-[11px] text-slate-400">
                Official diagnostic lab report, Red Crescent donor card, or government hospital document
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">Hospital / Diagnostic Center Name</label>
              <input
                type="text"
                placeholder="e.g. Popular Diagnostic Centre, Dhanmondi"
                value={hospitalName}
                onChange={(e) => setHospitalName(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/70 p-2.5 font-medium text-slate-800 focus:bg-white focus:border-rose-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1.5">Report Date</label>
              <input
                type="date"
                value={reportDate}
                onChange={(e) => setReportDate(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/70 p-2.5 font-medium text-slate-800 focus:bg-white focus:border-rose-500 focus:outline-none"
              />
            </div>
          </div>

          {/* File Upload Drop Area */}
          <div className="text-xs">
            <label className="block font-bold text-slate-700 mb-1.5">Upload Document (Image or PDF) *</label>
            <div className="relative rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-6 text-center hover:border-rose-300 transition">
              <input
                type="file"
                accept="image/*,application/pdf"
                onChange={handleFileChange}
                className="absolute inset-0 size-full opacity-0 cursor-pointer"
              />
              <div className="flex flex-col items-center justify-center gap-2">
                <UploadCloud className="size-8 text-slate-400" />
                <p className="font-bold text-slate-700">
                  {docFile ? docFile.name : "Click to select or drag & drop pathology document"}
                </p>
                <p className="text-[10px] text-slate-400">JPG, PNG, WebP or PDF (Max 8MB)</p>
              </div>
            </div>

            {/* Document Preview */}
            {docPreviewUrl && (
              <div className="mt-3 flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-2.5">
                <FileText className="size-5 text-rose-600 shrink-0" />
                <span className="text-xs font-medium text-slate-700 truncate flex-1">
                  {docFile?.name || "Uploaded Pathology Document"}
                </span>
                <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                  Ready to submit
                </span>
              </div>
            )}
          </div>

          {/* Additional Notes */}
          <div className="text-xs">
            <label className="block font-bold text-slate-700 mb-1.5">Additional Notes for Medical Reviewers</label>
            <textarea
              rows={2}
              placeholder="Any past medical conditions, regular medications, or details regarding your donor card..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/70 p-2.5 font-medium text-slate-800 focus:bg-white focus:border-rose-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-xl border border-slate-200 px-5 py-3 text-xs font-bold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || isUploadingFile}
            className="flex items-center gap-2 rounded-xl bg-rose-600 px-7 py-3 text-xs sm:text-sm font-bold text-white shadow-lg shadow-rose-600/30 hover:bg-rose-700 transition disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting || isUploadingFile ? (
              <Loader2 className="size-4 animate-spin text-white" />
            ) : (
              <CheckCircle2 className="size-4" />
            )}
            <span>Submit Verification Application</span>
          </button>
        </div>
      </form>
    </div>
  );
}
