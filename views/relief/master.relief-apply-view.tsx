"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  HeartHandshake,
  ShieldCheck,
  UploadCloud,
  FileText,
  MapPin,
  Building2,
  Navigation,
  CheckCircle2,
  Loader2,
  AlertCircle,
  Phone,
  CreditCard,
  X,
} from "lucide-react";
import { useCreateReliefRequestMutation } from "@/redux/api/reliefApi";
import { uploadSingleFile } from "@/lib/upload-service";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export function MasterReliefApplyView() {
  const router = useRouter();
  const { data: session } = useSession();

  const [createReliefRequest, { isLoading: isSubmitting }] = useCreateReliefRequestMutation();

  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [requiredAmount, setRequiredAmount] = useState("");
  const [bkashNumber, setBkashNumber] = useState("");
  const [nagadNumber, setNagadNumber] = useState("");
  const [rocketNumber, setRocketNumber] = useState("");
  const [contactPhone, setContactPhone] = useState(session?.user?.phone || "");
  const [addressText, setAddressText] = useState("");
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [isLocating, setIsLocating] = useState(false);

  // Document Upload State
  const [docFile, setDocFile] = useState<File | null>(null);
  const [docType, setDocType] = useState<"INCIDENT_PROOF" | "IDENTITY" | "MEDICAL">("INCIDENT_PROOF");
  const [docPreviewUrl, setDocPreviewUrl] = useState<string>("");
  const [isUploadingFile, setIsUploadingFile] = useState(false);

  // GPS Auto-detect
  const handleDetectGPS = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLatitude(pos.coords.latitude);
        setLongitude(pos.coords.longitude);
        setIsLocating(false);
        toast.success("GPS Location attached successfully!");
      },
      (err) => {
        console.error(err);
        setIsLocating(false);
        toast.error("Could not fetch GPS. Please allow location permissions.");
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      toast.error("File size must be under 8MB");
      return;
    }

    setDocFile(file);
    if (file.type.startsWith("image/")) {
      setDocPreviewUrl(URL.createObjectURL(file));
    } else {
      setDocPreviewUrl("/images/pdf-icon.png");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || title.length < 5) {
      toast.error("Please enter a descriptive campaign title");
      return;
    }
    if (!description.trim() || description.length < 20) {
      toast.error("Please describe your situation in at least 20 characters");
      return;
    }
    const numAmount = Number(requiredAmount);
    if (!numAmount || numAmount <= 0) {
      toast.error("Please enter a valid required relief amount");
      return;
    }
    if (!contactPhone.trim()) {
      toast.error("Please provide a contact phone number");
      return;
    }
    if (!bkashNumber && !nagadNumber && !rocketNumber) {
      toast.error("Please provide at least one direct payment account (bKash, Nagad, or Rocket)");
      return;
    }

    try {
      let uploadedDocs: Array<{ documentType: string; fileUrl: string }> = [];

      if (docFile) {
        setIsUploadingFile(true);
        toast.info("Uploading disaster proof document...");
        const fileUrl = await uploadSingleFile(docFile);
        setIsUploadingFile(false);
        uploadedDocs.push({
          documentType: docType,
          fileUrl,
        });
      }

      await createReliefRequest({
        title,
        description,
        requiredAmount: numAmount,
        bkashNumber: bkashNumber || undefined,
        nagadNumber: nagadNumber || undefined,
        rocketNumber: rocketNumber || undefined,
        contactPhone,
        addressText: addressText || undefined,
        latitude: latitude || undefined,
        longitude: longitude || undefined,
        documents: uploadedDocs,
      }).unwrap();

      toast.success(
        "Emergency relief request submitted! Our administrators will review the evidence to make it public."
      );
      router.push("/relief");
    } catch (err: any) {
      setIsUploadingFile(false);
      toast.error(err?.data?.message || err?.message || "Failed to submit relief request");
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-16">
      {/* 1. Header Banner */}
      <div className="rounded-3xl border border-emerald-200/90 bg-linear-to-r from-emerald-50 via-white to-amber-50/40 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-0.5 text-xs font-black text-emerald-800">
              <HeartHandshake className="size-3.5" />
              <span>Direct Community Assistance</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-brand-navy tracking-tight">
              Apply for Emergency Disaster Relief
            </h1>
            <p className="text-xs text-slate-500 max-w-xl">
              Submit your disaster relief request. After administrative review of your evidence, 
              your campaign will be published so donors across Bangladesh can send aid directly to your account.
            </p>
          </div>

          <div className="grid size-16 shrink-0 place-items-center rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-600/20">
            <ShieldCheck className="size-8" />
          </div>
        </div>
      </div>

      {/* Fraud Prevention Alert */}
      <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs font-semibold text-amber-900 shadow-2xs">
        <AlertCircle className="size-4 shrink-0 text-amber-600 mt-0.5" />
        <div>
          <span className="font-bold">Verification Requirement:</span> In accordance with platform policy, 
          every relief application is reviewed by our medical and emergency response team. Uploading photos 
          of the damage, local union parishad certificates, or hospital papers ensures quick approval.
        </div>
      </div>

      {/* 2. Relief Request Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1: Situation & Target */}
        <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <div className="grid size-8 place-items-center rounded-xl bg-emerald-50 text-emerald-600 font-bold text-xs">
              1
            </div>
            <div>
              <h2 className="text-sm font-bold text-brand-navy">Crisis Information &amp; Goal</h2>
              <p className="text-[11px] text-slate-400">Describe the disaster and funding requirements clearly</p>
            </div>
          </div>

          <div className="space-y-3.5 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">Campaign Title *</label>
              <input
                type="text"
                placeholder="e.g. Flash Flood Home Damage Relief in Sunamganj Haor Area"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/70 p-2.5 font-medium text-slate-800 focus:bg-white focus:border-emerald-600 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1.5">Required Relief Amount (৳ BDT) *</label>
              <input
                type="number"
                min="100"
                placeholder="e.g. 50000"
                value={requiredAmount}
                onChange={(e) => setRequiredAmount(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/70 p-2.5 font-bold text-emerald-700 focus:bg-white focus:border-emerald-600 focus:outline-none text-base"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1.5">Situation &amp; Damage Description *</label>
              <textarea
                rows={4}
                placeholder="Explain the background: what disaster happened, how many family members are affected, what items are urgently needed (food, medicine, shelter repairs), and why community help is requested..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/70 p-2.5 font-medium text-slate-800 focus:bg-white focus:border-emerald-600 focus:outline-none leading-relaxed"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1.5">Location &amp; Area Address</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. Ward 4, Parshuram Upazila, Feni"
                  value={addressText}
                  onChange={(e) => setAddressText(e.target.value)}
                  className="flex-1 rounded-xl border border-slate-200 bg-slate-50/70 p-2.5 text-xs text-slate-800 focus:bg-white focus:border-emerald-600 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleDetectGPS}
                  disabled={isLocating}
                  className="flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-2 font-bold text-emerald-700 hover:bg-emerald-100 transition cursor-pointer"
                >
                  {isLocating ? (
                    <Loader2 className="size-3.5 animate-spin" />
                  ) : (
                    <Navigation className="size-3.5 text-emerald-600" />
                  )}
                  <span>Detect GPS</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Step 2: Direct Payment Accounts */}
        <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <div className="grid size-8 place-items-center rounded-xl bg-emerald-50 text-emerald-600 font-bold text-xs">
              2
            </div>
            <div>
              <h2 className="text-sm font-bold text-brand-navy">Direct Mobile Financial Accounts</h2>
              <p className="text-[11px] text-slate-400">
                Donors will send money directly to these numbers. Please double-check accuracy.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-pink-700 mb-1.5">bKash Account Number</label>
              <input
                type="tel"
                placeholder="018..."
                value={bkashNumber}
                onChange={(e) => setBkashNumber(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/70 p-2.5 font-bold text-brand-navy focus:bg-white focus:border-pink-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-orange-700 mb-1.5">Nagad Account Number</label>
              <input
                type="tel"
                placeholder="017..."
                value={nagadNumber}
                onChange={(e) => setNagadNumber(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/70 p-2.5 font-bold text-brand-navy focus:bg-white focus:border-orange-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-purple-700 mb-1.5">Rocket Account Number</label>
              <input
                type="tel"
                placeholder="019..."
                value={rocketNumber}
                onChange={(e) => setRocketNumber(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/70 p-2.5 font-bold text-brand-navy focus:bg-white focus:border-purple-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1.5">Primary Contact Phone *</label>
              <input
                type="tel"
                placeholder="+8801..."
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/70 p-2.5 font-bold text-brand-navy focus:bg-white focus:border-emerald-600 focus:outline-none"
                required
              />
            </div>
          </div>
        </div>

        {/* Step 3: Supporting Proof Documents */}
        <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <div className="grid size-8 place-items-center rounded-xl bg-emerald-50 text-emerald-600 font-bold text-xs">
              3
            </div>
            <div>
              <h2 className="text-sm font-bold text-brand-navy">Supporting Proof Documents</h2>
              <p className="text-[11px] text-slate-400">
                Upload photos of flood/fire damage, National ID (NID), or local medical/disaster certificates
              </p>
            </div>
          </div>

          <div className="space-y-3.5 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">Document Type</label>
              <select
                value={docType}
                onChange={(e) => setDocType(e.target.value as any)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/70 p-2.5 font-bold text-brand-navy focus:bg-white focus:border-emerald-600 focus:outline-none"
              >
                <option value="INCIDENT_PROOF">Disaster / Property Damage Photo</option>
                <option value="IDENTITY">National ID Card (NID) / Birth Certificate</option>
                <option value="MEDICAL">Medical Report / Hospital Bill</option>
              </select>
            </div>

            {/* File Upload Drop Area */}
            <div>
              <div className="relative rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-6 text-center hover:border-emerald-300 transition">
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={handleFileChange}
                  className="absolute inset-0 size-full opacity-0 cursor-pointer"
                />
                <div className="flex flex-col items-center justify-center gap-2">
                  <UploadCloud className="size-8 text-slate-400" />
                  <p className="font-bold text-slate-700">
                    {docFile ? docFile.name : "Click to select or drag & drop proof file"}
                  </p>
                  <p className="text-[10px] text-slate-400">JPG, PNG, WebP or PDF (Max 8MB)</p>
                </div>
              </div>

              {docPreviewUrl && (
                <div className="mt-3 flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-2.5">
                  <FileText className="size-5 text-emerald-600 shrink-0" />
                  <span className="text-xs font-medium text-slate-700 truncate flex-1">
                    {docFile?.name || "Uploaded Evidence Document"}
                  </span>
                  <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                    Ready to attach
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
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
            className="flex items-center gap-2 rounded-xl bg-emerald-600 px-7 py-3 text-xs sm:text-sm font-bold text-white shadow-lg shadow-emerald-600/30 hover:bg-emerald-700 transition disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting || isUploadingFile ? (
              <Loader2 className="size-4 animate-spin text-white" />
            ) : (
              <CheckCircle2 className="size-4" />
            )}
            <span>Submit Application for Review</span>
          </button>
        </div>
      </form>
    </div>
  );
}
