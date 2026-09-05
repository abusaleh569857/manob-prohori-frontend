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
  title?: string;
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
  const {
    data: appData,
    isLoading: isAppLoading,
    refetch,
  } = volunteerApi.useGetVolunteerApplicationQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const [submitApp, { isLoading: isSubmitting }] = volunteerApi.useSubmitVolunteerApplicationMutation();

  // Form states
  const [isEditing, setIsEditing] = useState(false);
  const [bio, setBio] = useState("");
  const [experienceYears, setExperienceYears] = useState(1);
  const [serviceRadiusKm, setServiceRadiusKm] = useState(10);
  const [selectedSkills, setSelectedSkills] = useState<
    Array<{ skillId: number; skillLevel: "BASIC" | "INTERMEDIATE" | "ADVANCED" | "EXPERT" }>
  >([]);
  const [documents, setDocuments] = useState<AttachedDoc[]>([]);
  const [selectedDocIndex, setSelectedDocIndex] = useState<number>(0);
  const [isUploading, setIsUploading] = useState(false);
  const [docType, setDocType] = useState<"TRAINING" | "PROFILE" | "EXPERIENCE" | "PHONE">("TRAINING");
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

  const getCleanCertificateTitle = (
    notes?: string,
    docUrl?: string,
    vType?: "TRAINING" | "PROFILE" | "EXPERIENCE" | "PHONE",
    idx?: number
  ): string => {
    if (notes && notes.trim()) {
      const trimmed = notes.trim();
      // If it is a custom title (not raw file ending with image/pdf extension or hash)
      if (!/^[a-zA-Z0-9_\- ]+\.(jpg|jpeg|png|pdf|webp)$/i.test(trimmed) && !trimmed.startsWith("raw_upload")) {
        return trimmed;
      }
      // If it was saved with file extension like 'document1.jpg', strip the extension
      const cleanBase = trimmed.replace(/\.[^/.]+$/, "");
      if (cleanBase && !cleanBase.startsWith("raw_") && cleanBase.length < 35) {
        return cleanBase;
      }
    }
    const typeMap: Record<string, string> = {
      TRAINING: "Training & Paramedic Certificate",
      PROFILE: "National ID / Passport Proof",
      EXPERIENCE: "Experience / Service Certificate",
      PHONE: "Phone Verification Document",
    };
    return typeMap[vType || "TRAINING"] || "Verification Certificate";
  };

  const mapApplicationDocs = (docs: any[]): AttachedDoc[] => {
    return docs.map((d, idx) => {
      const title = getCleanCertificateTitle(d.notes, d.documentUrl, d.verificationType, idx);
      return {
        verificationType: (d.verificationType as any) || "TRAINING",
        documentUrl: d.documentUrl,
        notes: title,
        fileName: title,
      };
    });
  };

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
        const mapped = mapApplicationDocs(application.documents);
        setDocuments(mapped);
        setDocNote(mapped[0].notes || "");
        setDocType(mapped[0].verificationType);
        setSelectedDocIndex(0);
      }
    }
  }, [application]);

  // Cancel edit and reset to existing application data
  const handleCancelEdit = () => {
    if (application) {
      setBio(application.bio || "");
      setExperienceYears(application.experienceYears ?? 1);
      setServiceRadiusKm(application.serviceRadiusKm || 10);
      if (application.skills) {
        setSelectedSkills(
          application.skills.map((s) => ({
            skillId: s.skillId,
            skillLevel: (s.skillLevel as any) || "BASIC",
          }))
        );
      }
      if (application.documents) {
        const mapped = mapApplicationDocs(application.documents);
        setDocuments(mapped);
        if (mapped.length > 0) {
          setDocNote(mapped[0].notes || "");
          setDocType(mapped[0].verificationType);
          setSelectedDocIndex(0);
        }
      }
    }
    setIsEditing(false);
  };

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

  // Handle Document Title input changes (sync with selected document)
  const handleDocNoteChange = (newTitle: string) => {
    setDocNote(newTitle);
    if (documents.length > 0 && selectedDocIndex >= 0 && selectedDocIndex < documents.length) {
      setDocuments((prev) =>
        prev.map((doc, idx) =>
          idx === selectedDocIndex ? { ...doc, notes: newTitle, fileName: newTitle } : doc
        )
      );
    }
  };

  // Handle Document Type dropdown changes (sync with selected document)
  const handleDocTypeChange = (newType: "TRAINING" | "PROFILE" | "EXPERIENCE" | "PHONE") => {
    setDocType(newType);
    if (documents.length > 0 && selectedDocIndex >= 0 && selectedDocIndex < documents.length) {
      setDocuments((prev) =>
        prev.map((doc, idx) =>
          idx === selectedDocIndex ? { ...doc, verificationType: newType } : doc
        )
      );
    }
  };

  // Select document to edit its title/type
  const handleSelectDoc = (index: number) => {
    setSelectedDocIndex(index);
    if (documents[index]) {
      setDocNote(documents[index].notes || documents[index].fileName || "");
      setDocType(documents[index].verificationType as any);
    }
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
          const title =
            docNote.trim() ||
            file.name.replace(/\.[^/.]+$/, "") ||
            "Certificate Document";
          setDocuments((prev) => {
            const next = [
              ...prev,
              {
                verificationType: docType,
                documentUrl: url,
                notes: title,
                fileName: title,
              },
            ];
            setSelectedDocIndex(next.length - 1);
            return next;
          });
          toast.success(`Attached ${file.name}`);
        }
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to upload document");
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  // Remove attached document
  const handleRemoveDoc = (index: number) => {
    const updated = documents.filter((_, i) => i !== index);
    setDocuments(updated);
    if (updated.length > 0) {
      const nextIdx = Math.min(index, updated.length - 1);
      setSelectedDocIndex(nextIdx);
      setDocNote(updated[nextIdx].notes || updated[nextIdx].fileName || "");
      setDocType(updated[nextIdx].verificationType as any);
    } else {
      setDocNote("");
      setSelectedDocIndex(0);
    }
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
          title: d.title || d.notes || d.fileName || "Certificate Document",
          notes: d.title || d.notes || d.fileName || "Certificate Document",
        })),
      }).unwrap();

      if (res.success) {
        toast.success(
          isCurrentlyApproved
            ? "Credentials updated! Your profile has been submitted for Admin re-verification."
            : "Verification application submitted successfully for Admin review!"
        );
        setIsEditing(false);
        refetch();
      }
    } catch (err: any) {
      toast.error(err?.data?.message || err?.message || "Failed to submit application");
    }
  };

  const isApproved = application?.verificationStatus === "APPROVED";
  const isRejected = application?.verificationStatus === "REJECTED";
  const isPending = application?.verificationStatus === "PENDING" || !application?.verificationStatus;

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
                  ? "Volunteer Credentials & Skills"
                  : hasApplied && !isEditing
                  ? "Verification Application Status"
                  : "Volunteer Verification & Skills"}
              </h1>
              <span
                className={cn(
                  "rounded-full border px-3 py-0.5 text-xs font-extrabold uppercase",
                  isApproved
                    ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                    : isRejected
                    ? "bg-red-50 border-red-200 text-brand-red"
                    : hasApplied
                    ? "bg-amber-50 border-amber-200 text-amber-800"
                    : "bg-slate-100 border-slate-200 text-slate-700"
                )}
              >
                {isApproved
                  ? "✓ Verified Responder"
                  : isRejected
                  ? "✗ Action Required"
                  : hasApplied
                  ? "⏳ Application Under Review"
                  : "⚠️ Verification Required"}
              </span>
            </div>
            <p className="mt-0.5 text-xs sm:text-sm font-medium text-slate-500">
              {isApproved
                ? "You are an approved emergency responder. Review or update your active qualifications."
                : hasApplied && !isEditing
                ? "Your verification application has been submitted and is awaiting platform approval."
                : "Manage your credentials, training certificates, emergency skills, and service radius to become a verified responder."}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/volunteer/dashboard"
            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100 transition cursor-pointer shadow-2xs"
          >
            Go to Dispatch Hub
          </Link>
        </div>
      </div>

      {/* ------------------------------------------------------------------
          VIEW MODE 1: Already Submitted Application Review Card
          Displayed when volunteer has submitted and is not actively editing
          ------------------------------------------------------------------ */}
      {hasApplied && !isEditing && !isRejected ? (
        <div className="space-y-6">
          {/* Main Notice Banner */}
          <div
            className={cn(
              "flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl border p-6 sm:p-7 shadow-xs",
              isApproved
                ? "bg-emerald-50/90 border-emerald-200 text-emerald-950"
                : "bg-amber-50/90 border-amber-200 text-amber-950"
            )}
          >
            <div className="flex items-start gap-3.5">
              <div
                className={cn(
                  "grid size-10 shrink-0 place-items-center rounded-2xl shadow-2xs mt-0.5",
                  isApproved ? "bg-emerald-600 text-white" : "bg-amber-600 text-white"
                )}
              >
                {isApproved ? <CheckCircle2 className="size-5" /> : <Clock className="size-5" />}
              </div>
              <div>
                <h2 className="text-sm sm:text-base font-black">
                  {isApproved
                    ? "Verified Responder Status Active"
                    : "You have already submitted your verification form"}
                </h2>
                <p className="text-xs sm:text-sm font-medium mt-1 leading-relaxed opacity-90">
                  {isApproved
                    ? "Your profile is verified and active for emergency incident dispatches. You can update your skills, certificates, or operational radius below anytime."
                    : "Please wait, your application is currently under review by Admin. You can review your submitted credentials below or click the button to update your details."}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className={cn(
                "shrink-0 flex items-center gap-2 rounded-2xl px-5 py-3 text-xs sm:text-sm font-black shadow-md transition cursor-pointer self-start sm:self-center active:scale-[0.98]",
                isApproved
                  ? "bg-emerald-700 text-white hover:bg-emerald-800 shadow-emerald-700/20"
                  : "bg-amber-800 text-white hover:bg-amber-900 shadow-amber-800/20"
              )}
            >
              <Save className="size-4" />
              <span>{isApproved ? "Update Credentials" : "Update Application"}</span>
            </button>
          </div>

          {/* Submitted Information Card */}
          <div className="rounded-3xl border border-slate-200/90 bg-white/95 p-6 sm:p-8 backdrop-blur-xl shadow-xs space-y-8">
            {/* Top Bar of the Details Card */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div>
                <h3 className="text-base font-black text-brand-navy flex items-center gap-2">
                  <FileText className="size-5 text-brand-red" />
                  <span>Submitted Verification Details</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Snapshot of your submitted profile data currently on file with platform administrators.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 transition cursor-pointer shadow-2xs self-start sm:self-auto"
              >
                <Award className="size-3.5 text-brand-red" />
                <span>Edit / Update Data</span>
              </button>
            </div>

            {/* Grid 1: Operational Summary */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Experience Level
                </span>
                <p className="mt-1 text-sm sm:text-base font-black text-brand-navy">
                  {experienceYears || 0} Years Active Experience
                </p>
              </div>

              <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Preferred Service Radius
                </span>
                <p className="mt-1 text-sm sm:text-base font-black text-brand-navy">
                  {serviceRadiusKm || 10} km Response Zone
                </p>
              </div>

              <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Current Status
                </span>
                <div className="mt-1 flex items-center gap-1.5">
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-extrabold uppercase",
                      isApproved
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-amber-100 text-amber-900"
                    )}
                  >
                    {isApproved ? "✓ APPROVED" : "⏳ UNDER REVIEW"}
                  </span>
                </div>
              </div>
            </div>

            {/* Section 2: Submitted Bio */}
            {bio && (
              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Submitted Bio &amp; Rescue Background
                </h4>
                <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4 text-xs sm:text-sm font-medium text-slate-700 leading-relaxed">
                  {bio}
                </div>
              </div>
            )}

            {/* Section 3: Selected Emergency Skills */}
            <div>
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                Submitted Skills &amp; Proficiencies ({selectedSkills.length})
              </h4>
              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
                {selectedSkills.map((sk) => {
                  const skillObj = availableSkills.find((s) => s.id === sk.skillId);
                  return (
                    <div
                      key={sk.skillId}
                      className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
                        <span className="text-xs font-bold text-slate-800 truncate">
                          {skillObj?.name || `Skill #${sk.skillId}`}
                        </span>
                      </div>
                      <span
                        className={cn(
                          "shrink-0 text-[10px] font-black uppercase px-2 py-0.5 rounded-md border",
                          sk.skillLevel === "EXPERT"
                            ? "bg-purple-50 text-purple-700 border-purple-200"
                            : sk.skillLevel === "ADVANCED"
                            ? "bg-blue-50 text-blue-700 border-blue-200"
                            : sk.skillLevel === "INTERMEDIATE"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-slate-100 text-slate-700 border-slate-200"
                        )}
                      >
                        {sk.skillLevel}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Section 4: Attached Verification Documents */}
            <div>
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                Attached Documents &amp; Certificates ({documents.length})
              </h4>
              {documents.length === 0 ? (
                <p className="text-xs text-slate-400 italic">No certificates attached.</p>
              ) : (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {documents.map((doc, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-3.5 shadow-2xs"
                    >
                      <div className="flex items-center gap-3 min-w-0 pr-2">
                        <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-red-50 text-brand-red">
                          <FileText className="size-4.5" />
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-xs sm:text-sm font-bold text-brand-navy">
                            {doc.fileName || doc.notes || `Document #${idx + 1}`}
                          </p>
                          <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-black text-slate-600 uppercase">
                            {doc.verificationType}
                          </span>
                        </div>
                      </div>

                      <a
                        href={doc.documentUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-bold text-brand-navy hover:bg-slate-100 transition shadow-2xs"
                      >
                        <Eye className="size-3.5 text-brand-red" />
                        <span>View</span>
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Bottom Edit Action Button */}
            <div className="pt-6 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 rounded-2xl bg-brand-navy px-6 py-3 text-xs sm:text-sm font-black text-white hover:bg-slate-800 transition cursor-pointer shadow-md shadow-brand-navy/20"
              >
                <Save className="size-4" />
                <span>Update Application Details</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* ------------------------------------------------------------------
            VIEW MODE 2: Interactive Verification & Skills Form
            Displayed for initial creation, editing, or re-applying
            ------------------------------------------------------------------ */
        <div className="space-y-6">
          {/* Rejection Feedback Alert (if rejected) */}
          {isRejected && (
            <div className="flex items-start gap-3.5 rounded-2xl bg-red-50 border border-red-200 p-5 text-xs sm:text-sm text-brand-red shadow-2xs">
              <AlertTriangle className="size-5 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-red-900">Application Requires Updates from Admin:</p>
                <p className="mt-1 text-red-800 font-medium leading-relaxed">
                  {application?.rejectionReason || "Please provide clearer training certificates and update your experience."}
                </p>
              </div>
            </div>
          )}

          {/* Edit Mode Notice Bar */}
          {isEditing && (
            <div className="flex items-center justify-between gap-4 rounded-2xl bg-blue-50 border border-blue-200 p-4 text-xs sm:text-sm text-blue-950 shadow-2xs">
              <div className="flex items-center gap-3">
                <Info className="size-5 text-blue-600 shrink-0" />
                <div>
                  <p className="font-extrabold text-blue-950">Editing Verification Details</p>
                  <p className="text-blue-700 text-xs mt-0.5">
                    Update your operational bio, emergency skills, and certificates below. Click Save to resubmit for Admin review.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCancelEdit}
                className="shrink-0 rounded-xl border border-blue-300 bg-white px-3.5 py-1.5 text-xs font-bold text-blue-900 hover:bg-blue-50 transition cursor-pointer"
              >
                Cancel Edit
              </button>
            </div>
          )}

          {/* Unverified Action Banner (when never applied) */}
          {!hasApplied && (
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

          {/* Main Form Card */}
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
                      {isEditing
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
                        min="0"
                        max="50"
                        value={experienceYears}
                        onChange={(e) => setExperienceYears(Math.max(0, parseInt(e.target.value) || 0))}
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 p-3.5 text-xs sm:text-sm font-medium text-slate-800 focus:bg-white focus:border-brand-red focus:outline-none focus:ring-2 focus:ring-brand-red/20 transition"
                      />
                    </div>

                    <div>
                      <label className="mb-1.5 block text-xs font-bold text-slate-700">
                        Preferred Service Radius (km) <span className="text-red-500">*</span>
                      </label>
                      <div className="flex items-center gap-3 pt-2">
                        <input
                          type="range"
                          min="1"
                          max="50"
                          step="1"
                          value={serviceRadiusKm}
                          onChange={(e) => setServiceRadiusKm(Number(e.target.value))}
                          className="w-full accent-brand-red cursor-pointer"
                        />
                        <span className="w-16 text-center text-xs font-extrabold rounded-xl bg-slate-100 py-2 border border-slate-200 text-brand-navy">
                          {serviceRadiusKm} km
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* --------------------------------------------------------------
                    SECTION 2: Emergency Response Skills Selection
                    -------------------------------------------------------------- */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                    <div className="grid size-7 place-items-center rounded-lg bg-brand-red-soft text-brand-red text-xs font-black">
                      2
                    </div>
                    <div>
                      <h3 className="text-sm font-extrabold text-brand-navy">
                        {isEditing
                          ? "Update Emergency Rescue Skills & Proficiency"
                          : "Emergency Rescue Skills & Proficiencies"}
                      </h3>
                      <p className="text-[11px] text-slate-400">
                        Select skills you are trained in and designate your proficiency level.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {availableSkills.map((skill) => {
                      const selected = selectedSkills.find((s) => s.skillId === skill.id);
                      const isSelected = Boolean(selected);

                      return (
                        <div
                          key={skill.id}
                          className={cn(
                            "flex flex-col justify-between rounded-2xl border p-4 transition-all duration-200",
                            isSelected
                              ? "border-brand-red/60 bg-red-50/40 shadow-xs"
                              : "border-slate-200 bg-slate-50/40 hover:bg-white hover:border-slate-300"
                          )}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-start gap-2.5">
                              <button
                                type="button"
                                onClick={() => handleToggleSkill(skill.id)}
                                className={cn(
                                  "grid size-5 shrink-0 place-items-center rounded-md border mt-0.5 transition cursor-pointer",
                                  isSelected
                                    ? "bg-brand-red border-brand-red text-white"
                                    : "border-slate-300 bg-white"
                                )}
                              >
                                {isSelected && <CheckCircle2 className="size-3.5" />}
                              </button>
                              <div>
                                <p
                                  onClick={() => handleToggleSkill(skill.id)}
                                  className="text-xs sm:text-sm font-bold text-brand-navy cursor-pointer select-none"
                                >
                                  {skill.name}
                                </p>
                                {skill.description && (
                                  <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-2">
                                    {skill.description}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Skill Level Selector when checked */}
                          {isSelected && (
                            <div className="mt-3 pt-3 border-t border-red-100 flex items-center justify-between gap-2">
                              <span className="text-[10.5px] font-bold text-slate-500 uppercase tracking-wide">
                                Level:
                              </span>
                              <div className="flex items-center gap-1">
                                {SKILL_LEVELS.map((lvl) => (
                                  <button
                                    key={lvl}
                                    type="button"
                                    onClick={() => handleSkillLevelChange(skill.id, lvl)}
                                    className={cn(
                                      "rounded-lg px-2 py-0.5 text-[10px] font-black uppercase transition cursor-pointer",
                                      selected?.skillLevel === lvl
                                        ? "bg-brand-navy text-white shadow-2xs"
                                        : "bg-white text-slate-500 hover:bg-slate-100 border border-slate-200"
                                    )}
                                  >
                                    {lvl}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* --------------------------------------------------------------
                    SECTION 3: Document & Certification Uploads
                    -------------------------------------------------------------- */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                    <div className="grid size-7 place-items-center rounded-lg bg-brand-red-soft text-brand-red text-xs font-black">
                      3
                    </div>
                    <div>
                      <h3 className="text-sm font-extrabold text-brand-navy">
                        {isEditing
                          ? "Update Training Certificates & Verification Proofs"
                          : "Training Certificates &amp; Verification Proofs"}
                      </h3>
                      <p className="text-[11px] text-slate-400">
                        Upload official credentials, paramedic certifications, or national ID proof for Admin review.
                      </p>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/50 p-5 space-y-4">
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <div>
                        <label className="mb-1 block text-xs font-bold text-slate-700">
                          Document Type
                        </label>
                        <select
                          value={docType}
                          onChange={(e: any) => handleDocTypeChange(e.target.value)}
                          className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs sm:text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red transition"
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
                          onChange={(e) => handleDocNoteChange(e.target.value)}
                          placeholder="e.g. Red Crescent CPR Certificate 2024"
                          className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs sm:text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red transition"
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
                            Uploading to Cloud CDN...
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
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-700">
                          Attached Proofs &amp; Certificates ({documents.length})
                        </span>
                        {documents.length > 1 && (
                          <span className="text-[11px] text-slate-400">
                            Click any item below to view or edit its title above
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        {documents.map((doc, idx) => {
                          const isSelected = selectedDocIndex === idx;
                          return (
                            <div
                              key={idx}
                              onClick={() => handleSelectDoc(idx)}
                              className={cn(
                                "flex items-center justify-between rounded-2xl border p-3.5 shadow-2xs transition cursor-pointer",
                                isSelected
                                  ? "border-brand-navy bg-slate-50/90 ring-2 ring-brand-navy/15"
                                  : "border-slate-200 bg-white hover:border-slate-300"
                              )}
                            >
                              <div className="flex items-center gap-3 min-w-0 pr-2">
                                <div
                                  className={cn(
                                    "grid size-9 shrink-0 place-items-center rounded-xl",
                                    isSelected ? "bg-brand-navy text-white" : "bg-red-50 text-brand-red"
                                  )}
                                >
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

                              <div
                                className="flex items-center gap-1.5 shrink-0"
                                onClick={(e) => e.stopPropagation()}
                              >
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
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleRemoveDoc(idx);
                                  }}
                                  className="grid size-8 place-items-center rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600 transition cursor-pointer"
                                  title="Remove"
                                >
                                  <Trash2 className="size-4" />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* --------------------------------------------------------------
                    SECTION 4: Submission Action
                    -------------------------------------------------------------- */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-100">
                  <p className="text-xs text-slate-400">
                    {isEditing
                      ? "Note: Updating your skills or certificates will submit your profile for Admin review."
                      : "By submitting, you confirm that all attached certificates and experience details are authentic."}
                  </p>

                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    {isEditing && (
                      <button
                        type="button"
                        onClick={handleCancelEdit}
                        className="w-full sm:w-auto rounded-2xl border border-slate-200 bg-slate-100 px-6 py-3.5 text-xs sm:text-sm font-bold text-slate-700 hover:bg-slate-200 transition cursor-pointer"
                      >
                        Cancel
                      </button>
                    )}

                    <Button
                      type="submit"
                      disabled={isSubmitting || isUploading}
                      className="w-full sm:w-auto rounded-2xl bg-brand-red px-8 py-3.5 text-xs sm:text-sm font-black text-white hover:bg-brand-red-dark shadow-lg shadow-brand-red/25 transition cursor-pointer"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center gap-2">
                          <Loader2 className="size-4 animate-spin" />
                          {isEditing ? "Saving Updates..." : "Submitting Application..."}
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <Save className="size-4" />
                          {isEditing
                            ? "Save & Update Verification"
                            : "Submit Application for Verification"}
                        </span>
                      )}
                    </Button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
