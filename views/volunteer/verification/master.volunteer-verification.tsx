"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Award,
  UploadCloud,
  FileText,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  Eye,
  Trash2,
  ArrowLeft,
  Info,
  Clock,
  ExternalLink,
  Save,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  volunteerApi,
  useGetAvailableSkillsQuery,
  useGetVolunteerApplicationQuery,
  useSubmitVolunteerApplicationMutation,
} from "@/redux/api/volunteerApi";
import { uploadSingleFile } from "@/lib/upload-service";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface AttachedDoc {
  verificationType: "TRAINING" | "PROFILE" | "EXPERIENCE" | "PHONE";
  documentUrl: string;
  notes?: string;
  fileName?: string;
}

const SKILL_LEVELS = ["BASIC", "INTERMEDIATE", "ADVANCED", "EXPERT"] as const;

const FALLBACK_SKILLS: Array<{ id: number; name: string; slug: string; description?: string }> = [
  { id: 1, name: "First Aid & CPR", slug: "first_aid", description: "Basic life support, wound dressing & CPR certification" },
  { id: 2, name: "Firefighting & Search Rescue", slug: "firefighting", description: "Building evacuation, fire containment & rubble search" },
  { id: 3, name: "Flood & Water Rescue", slug: "flood_rescue", description: "Swift-water rescue, boat steering & flood evacuation" },
  { id: 4, name: "Emergency Medical Responder (EMR)", slug: "emr", description: "Trauma handling, vital monitoring & field triage" },
  { id: 5, name: "Ambulance Support & Triage", slug: "ambulance_support", description: "Patient transit assistance and emergency hospital liaison" },
  { id: 6, name: "Disaster Shelter Management", slug: "shelter_mgmt", description: "Relief camp organization and distribution logistics" },
  { id: 7, name: "Communication & Logistics", slug: "logistics", description: "Radio communication, inventory & ground coordination" },
  { id: 8, name: "Crowd Control & Evacuation", slug: "evacuation", description: "Public order maintenance during emergency operations" },
];


export function MasterVolunteerVerificationComponent() {
  const { data: skillsData } = volunteerApi.useGetAvailableSkillsQuery();
  const { data: appData, isLoading: isAppLoading, refetch } = volunteerApi.useGetVolunteerApplicationQuery();
  const [submitApp, { isLoading: isSubmitting }] = volunteerApi.useSubmitVolunteerApplicationMutation();



  // Form states
  const [bio, setBio] = useState("");
  const [experienceYears, setExperienceYears] = useState(1);
  const [serviceRadiusKm, setServiceRadiusKm] = useState(10);
  const [selectedSkills, setSelectedSkills] = useState<
    Array<{ skillId: number; skillLevel: "BASIC" | "INTERMEDIATE" | "ADVANCED" | "EXPERT" }>
  >([]);
  const [documents, setDocuments] = useState<AttachedDoc[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [docType, setDocType] = useState<"TRAINING" | "PROFILE" | "EXPERIENCE">("TRAINING");
  const [docNote, setDocNote] = useState("");

  const application = appData?.data;
  const hasApplied = Boolean(
    (application?.skills && application.skills.length > 0) ||
    (application?.documents && application.documents.length > 0) ||
    (application?.bio && application.bio.trim().length > 0)
  );
  const availableSkills =
    skillsData?.data && skillsData.data.length > 0
      ? skillsData.data
      : FALLBACK_SKILLS;



  // Initialize form with existing application data
  useEffect(() => {
    if (application) {
      if (application.bio) setBio(application.bio);
      if (application.experienceYears != null) setExperienceYears(application.experienceYears);
      if (application.serviceRadiusKm) setServiceRadiusKm(application.serviceRadiusKm);
      if (application.skills && application.skills.length > 0) {
        setSelectedSkills(
          application.skills.map((s) => ({
            skillId: s.skillId,
            skillLevel: (s.skillLevel as any) || "BASIC",
          }))
        );
      }
      if (application.documents && application.documents.length > 0) {
        setDocuments(
          application.documents.map((d) => ({
            verificationType: (d.verificationType as any) || "TRAINING",
            documentUrl: d.documentUrl,
            notes: d.notes,
            fileName: d.documentUrl.split("/").pop() || "Document",
          }))
        );
      }
    }
  }, [application]);

  // Toggle skill selection
  const handleToggleSkill = (skillId: number) => {
    const exists = selectedSkills.some((s) => s.skillId === skillId);
    if (exists) {
      setSelectedSkills(selectedSkills.filter((s) => s.skillId !== skillId));
    } else {
      setSelectedSkills([...selectedSkills, { skillId, skillLevel: "INTERMEDIATE" }]);
    }
  };

  // Change skill level
  const handleSkillLevelChange = (
    skillId: number,
    level: "BASIC" | "INTERMEDIATE" | "ADVANCED" | "EXPERT"
  ) => {
    setSelectedSkills(
      selectedSkills.map((s) => (s.skillId === skillId ? { ...s, skillLevel: level } : s))
    );
  };

  // Upload file directly to Cloudinary
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setIsUploading(true);
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.size > 10 * 1024 * 1024) {
          toast.error(`File ${file.name} exceeds 10MB limit.`);
          continue;
        }

        const url = await uploadSingleFile(file);
        if (url) {
          setDocuments((prev) => [
            ...prev,
            {
              verificationType: docType,
              documentUrl: url,
              notes: docNote || file.name,
              fileName: file.name,
            },
          ]);
          toast.success(`Attached ${file.name}`);
        }
      }
      setDocNote("");
    } catch (err: any) {
      toast.error(err.message || "Failed to upload document");
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  // Remove attached document
  const handleRemoveDoc = (index: number) => {
    setDocuments(documents.filter((_, i) => i !== index));
  };

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!bio.trim()) {
      toast.error("Please enter a short bio describing your background.");
      return;
    }

    if (selectedSkills.length === 0) {
      toast.error("Please select at least 1 emergency skill.");
      return;
    }

    if (documents.length === 0) {
      toast.error("Please attach at least 1 training certificate or ID proof.");
      return;
    }

    try {
      const isCurrentlyApproved = application?.verificationStatus === "APPROVED";
      const res = await submitApp({
        bio: bio.trim(),
        experienceYears: Number(experienceYears) || 0,
        preferredServiceRadiusKm: Number(serviceRadiusKm) || 5.0,
        skills: selectedSkills,
        documents: documents.map((d) => ({
          verificationType: d.verificationType,
          documentUrl: d.documentUrl,
          notes: d.notes,
        })),
      }).unwrap();

      if (res.success) {
        toast.success(
          isCurrentlyApproved
            ? "Credentials updated! Your profile has been submitted for Admin re-verification."
            : "Verification application submitted successfully for Admin review!"
        );
        refetch();
      }
    } catch (err: any) {
      toast.error(err?.data?.message || err?.message || "Failed to submit application");
    }
  };

  const isApproved = application?.verificationStatus === "APPROVED";

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* 1. Header Navigation & Status */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-3xl border border-slate-200/90 bg-white/95 p-6 sm:p-8 backdrop-blur-xl shadow-xs">
        <div className="flex items-center gap-4">
          <Link
            href="/volunteer/dashboard"
            className="grid size-11 shrink-0 place-items-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-brand-navy transition cursor-pointer"
            title="Back to Dispatch Hub"
          >
            <ArrowLeft className="size-5" />
          </Link>

          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-black text-brand-navy tracking-tight">
                {isApproved
                  ? "Update Volunteer Credentials & Skills"
                  : "Volunteer Verification & Skills"}
              </h1>
              <span
                className={cn(
                  "rounded-full border px-3 py-0.5 text-xs font-extrabold uppercase",
                  isApproved
                    ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                    : application?.verificationStatus === "REJECTED"
                    ? "bg-red-50 border-red-200 text-brand-red"
                    : hasApplied
                    ? "bg-amber-50 border-amber-200 text-amber-800"
                    : "bg-slate-100 border-slate-200 text-slate-700"
                )}
              >
                {isApproved
                  ? "✓ Verified Responder"
                  : application?.verificationStatus === "REJECTED"
                  ? "✗ Action Required"
                  : hasApplied
                  ? "⏳ Application Under Review"
                  : "⚠️ Verification Required"}
              </span>
            </div>
            <p className="mt-0.5 text-xs sm:text-sm font-medium text-slate-500">
              {isApproved
                ? "You are an approved responder. Edit your skills, bio, certificates, or service radius below to request re-verification."
                : "Manage your credentials, training certificates, emergency skills, and service radius to become a verified responder."}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/volunteer/dashboard"
            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100 transition cursor-pointer"
          >
            Go to Dispatch Hub
          </Link>
        </div>
      </div>

      {/* Rejection Feedback Alert (if rejected) */}
      {application?.verificationStatus === "REJECTED" && (
        <div className="flex items-start gap-3.5 rounded-2xl bg-red-50 border border-red-200 p-5 text-xs sm:text-sm text-brand-red shadow-2xs">
          <AlertTriangle className="size-5 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-red-900">Application Requires Updates from Admin:</p>
            <p className="mt-1 text-red-800 font-medium leading-relaxed">
              {application.rejectionReason || "Please provide clearer training certificates and update your experience."}
            </p>
          </div>
        </div>
      )}

      {/* Under Review Status Banner */}
      {!isApproved && application?.verificationStatus !== "REJECTED" && hasApplied && (
        <div className="flex items-center gap-3.5 rounded-2xl bg-amber-50 border border-amber-200 p-4 text-xs sm:text-sm text-amber-900 shadow-2xs">
          <Clock className="size-5 shrink-0 text-amber-600" />
          <div>
            <p className="font-extrabold text-amber-950">Application Currently Under Review</p>
            <p className="text-amber-700 font-medium text-xs mt-0.5">
              Your submitted documents and skills are being reviewed by platform administrators. You may update your information at any time.
            </p>
          </div>
        </div>
      )}

      {/* Unverified Action Banner */}
      {!isApproved && application?.verificationStatus !== "REJECTED" && !hasApplied && (
        <div className="flex items-center gap-3.5 rounded-2xl bg-blue-50 border border-blue-200 p-4 text-xs sm:text-sm text-blue-950 shadow-2xs">
          <Info className="size-5 shrink-0 text-blue-600" />
          <div>
            <p className="font-extrabold text-blue-950">Action Required: Submit Verification Application</p>
            <p className="text-blue-700 font-medium text-xs mt-0.5">
              Fill out your emergency experience, select your verified skill proficiencies, and attach training certificates or ID proofs to participate in emergency dispatches.
            </p>
          </div>
        </div>
      )}

      {/* Approved Status Banner */}
      {isApproved && (
        <div className="flex items-center gap-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-xs sm:text-sm text-emerald-800 shadow-2xs">
          <CheckCircle2 className="size-5 shrink-0 text-emerald-600" />
          <div>
            <p className="font-extrabold text-emerald-950">Verified Responder Status Active</p>
            <p className="text-emerald-700 font-medium text-xs mt-0.5">
              Your profile is currently verified. If you update your skills or upload new training certificates below, it will be submitted to Admin for re-verification while maintaining your responder record.
            </p>
          </div>
        </div>
      )}

      {/* 2. Main Form Card */}
      <div className="rounded-3xl border border-slate-200/90 bg-white/95 p-6 sm:p-8 backdrop-blur-xl shadow-xs">
        {isAppLoading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="size-8 animate-spin text-brand-red" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* --------------------------------------------------------------
                SECTION 1: Professional Bio & Operational Experience
                -------------------------------------------------------------- */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <div className="grid size-7 place-items-center rounded-lg bg-brand-red-soft text-brand-red text-xs font-black">
                  1
                </div>
                <h3 className="text-sm font-extrabold text-brand-navy">
                  {isApproved
                    ? "Update Operational Experience & Service Radius"
                    : "Operational Experience & Service Radius"}
                </h3>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-bold text-slate-700">
                  Short Professional Bio / Rescue Background <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Describe your emergency response experience, previous organization affiliations, certified training, or volunteer motivation..."
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 p-3.5 text-xs sm:text-sm font-medium text-slate-800 placeholder-slate-400 focus:bg-white focus:border-brand-red focus:outline-none focus:ring-2 focus:ring-brand-red/20 transition"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-slate-700">
                    Years of Experience <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    max="50"
                    value={experienceYears}
                    onChange={(e) => setExperienceYears(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs sm:text-sm font-bold text-slate-800 focus:bg-white focus:border-brand-red focus:outline-none focus:ring-2 focus:ring-brand-red/20 transition"
                  />
                  <p className="mt-1 text-[11px] text-slate-400">
                    Total years involved in emergency, first-aid, or community rescue.
                  </p>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-bold text-slate-700">
                    Maximum Service Radius
                  </label>
                  <select
                    value={serviceRadiusKm}
                    onChange={(e) => setServiceRadiusKm(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs sm:text-sm font-bold text-slate-800 focus:bg-white focus:border-brand-red focus:outline-none focus:ring-2 focus:ring-brand-red/20 transition"
                  >
                    <option value={5}>5 km Radius (Immediate Neighborhood)</option>
                    <option value={10}>10 km Radius (Standard Zone)</option>
                    <option value={15}>15 km Radius (Extended Zone)</option>
                    <option value={20}>20 km Radius (District Wide)</option>
                  </select>
                  <p className="mt-1 text-[11px] text-slate-400">
                    You will receive radar dispatch calls within this distance.
                  </p>
                </div>
              </div>
            </div>

            {/* --------------------------------------------------------------
                SECTION 2: Emergency Response Skills & Levels
                -------------------------------------------------------------- */}
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="grid size-7 place-items-center rounded-lg bg-brand-red-soft text-brand-red text-xs font-black">
                    2
                  </div>
                  <h3 className="text-sm font-extrabold text-brand-navy">
                    Emergency Response Skills &amp; Qualifications <span className="text-red-500">*</span>
                  </h3>
                </div>
                <span className="rounded-full bg-red-50 text-brand-red border border-red-200 px-2.5 py-0.5 text-xs font-bold">
                  {selectedSkills.length} Selected
                </span>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {availableSkills.map((skill) => {
                  const selected = selectedSkills.find((s) => s.skillId === skill.id);
                  return (
                    <div
                      key={skill.id}
                      className={cn(
                        "flex items-center justify-between rounded-2xl border p-3.5 transition duration-150",
                        selected
                          ? "border-brand-red bg-red-50/50 shadow-2xs"
                          : "border-slate-200 bg-white hover:bg-slate-50"
                      )}
                    >
                      <button
                        type="button"
                        onClick={() => handleToggleSkill(skill.id)}
                        className="flex items-center gap-3 flex-1 text-left cursor-pointer"
                      >
                        <div
                          className={cn(
                            "grid size-5.5 shrink-0 place-items-center rounded-lg border text-xs transition",
                            selected
                              ? "bg-brand-red border-brand-red text-white font-black"
                              : "border-slate-300 bg-white"
                          )}
                        >
                          {selected ? "✓" : ""}
                        </div>
                        <div>
                          <span className="text-xs sm:text-sm font-bold text-slate-800">
                            {skill.name}
                          </span>
                          {skill.description && (
                            <p className="text-[11px] text-slate-400 font-medium">
                              {skill.description}
                            </p>
                          )}
                        </div>
                      </button>

                      {selected && (
                        <select
                          value={selected.skillLevel}
                          onChange={(e) =>
                            handleSkillLevelChange(skill.id, e.target.value as any)
                          }
                          className="rounded-xl border border-red-200 bg-white px-2.5 py-1 text-xs font-black text-brand-red focus:outline-none shadow-2xs"
                        >
                          {SKILL_LEVELS.map((lvl) => (
                            <option key={lvl} value={lvl}>
                              {lvl}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* --------------------------------------------------------------
                SECTION 3: Proof Documents & Certificates Upload (Cloudinary)
                -------------------------------------------------------------- */}
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="grid size-7 place-items-center rounded-lg bg-brand-red-soft text-brand-red text-xs font-black">
                    3
                  </div>
                  <h3 className="text-sm font-extrabold text-brand-navy">
                    Verification Documents &amp; Certificates <span className="text-red-500">*</span>
                  </h3>
                </div>
                <span className="rounded-full bg-slate-100 text-slate-600 px-2.5 py-0.5 text-xs font-bold">
                  {documents.length} Attached
                </span>
              </div>

              {/* Upload Controls */}
              <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50/70 p-5 space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-bold text-slate-700">
                      Document Type
                    </label>
                    <select
                      value={docType}
                      onChange={(e) => setDocType(e.target.value as any)}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs sm:text-sm font-bold text-slate-800 focus:outline-none"
                    >
                      <option value="TRAINING">Training / Paramedic Certificate</option>
                      <option value="PROFILE">National ID / Passport Proof</option>
                      <option value="EXPERIENCE">Experience Letter / Volunteer Card</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-bold text-slate-700">
                      Certificate / Document Title
                    </label>
                    <input
                      type="text"
                      value={docNote}
                      onChange={(e) => setDocNote(e.target.value)}
                      placeholder="e.g. Red Crescent CPR Certificate 2024"
                      className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs sm:text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="relative flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-6 text-center transition hover:bg-slate-50">
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    multiple
                    disabled={isUploading}
                    onChange={handleFileUpload}
                    className="absolute inset-0 size-full cursor-pointer opacity-0"
                  />
                  {isUploading ? (
                    <div className="flex flex-col items-center">
                      <Loader2 className="size-8 animate-spin text-brand-red" />
                      <span className="mt-2 text-xs font-bold text-slate-700">
                        Uploading to Cloudinary CDN...
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <div className="grid size-12 place-items-center rounded-2xl bg-red-50 text-brand-red">
                        <UploadCloud className="size-6" />
                      </div>
                      <span className="mt-2 text-xs sm:text-sm font-bold text-slate-800">
                        Click or Drag to Upload Training Certificates &amp; Proofs
                      </span>
                      <span className="text-[11px] text-slate-400 mt-0.5">
                        Supports PNG, JPG, PDF documents up to 10MB
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Attached Documents Grid */}
              {documents.length > 0 && (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {documents.map((doc, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-3.5 shadow-2xs transition hover:border-slate-300"
                    >
                      <div className="flex items-center gap-3 min-w-0 pr-2">
                        <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-red-50 text-brand-red">
                          <FileText className="size-4.5" />
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-xs sm:text-sm font-bold text-brand-navy">
                            {doc.notes || doc.fileName || `Document #${idx + 1}`}
                          </p>
                          <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-black text-slate-600 uppercase">
                            {doc.verificationType}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <a
                          href={doc.documentUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="grid size-8 place-items-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-brand-navy transition"
                          title="Preview Document"
                        >
                          <Eye className="size-4" />
                        </a>
                        <button
                          type="button"
                          onClick={() => handleRemoveDoc(idx)}
                          className="grid size-8 place-items-center rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600 transition cursor-pointer"
                          title="Remove"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* --------------------------------------------------------------
                SECTION 4: Submission Action
                -------------------------------------------------------------- */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-100">
              <p className="text-xs text-slate-400">
                {isApproved
                  ? "Note: Updating your skills or certificates will submit your profile for Admin re-verification."
                  : "By submitting, you confirm that all attached certificates and experience details are authentic."}
              </p>

              <Button
                type="submit"
                disabled={isSubmitting || isUploading}
                className="w-full sm:w-auto rounded-2xl bg-brand-red px-8 py-3.5 text-xs sm:text-sm font-black text-white hover:bg-brand-red-dark shadow-lg shadow-brand-red/25 transition cursor-pointer"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="size-4 animate-spin" />
                    {isApproved
                      ? "Updating Profile & Requesting Re-Verification..."
                      : "Submitting Application..."}
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Save className="size-4" />
                    {isApproved
                      ? "Update Credentials & Request Re-Verification"
                      : "Submit Application for Verification"}
                  </span>
                )}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
