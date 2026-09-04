"use client";

import { useState, useEffect } from "react";
import {
  ShieldCheck,
  Award,
  UploadCloud,
  FileText,
  X,
  Plus,
  Loader2,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Eye,
  Trash2,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  volunteerApi,
  useGetAvailableSkillsQuery,
  useGetVolunteerApplicationQuery,
  useSubmitVolunteerApplicationMutation,
} from "@/redux/api/volunteerApi";
import { uploadSingleFile } from "@/lib/upload-service";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface VolunteerVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

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


export function VolunteerVerificationModal({
  isOpen,
  onClose,
}: VolunteerVerificationModalProps) {
  const { data: skillsData } = volunteerApi.useGetAvailableSkillsQuery();
  const { data: appData, isLoading: isAppLoading } = volunteerApi.useGetVolunteerApplicationQuery(
    undefined,
    { skip: !isOpen }
  );
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
  const availableSkills =
    skillsData?.data && skillsData.data.length > 0
      ? skillsData.data
      : FALLBACK_SKILLS;


  // Initialize form with existing application data if present
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

  // Upload certificate / document to Cloudinary
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setIsUploading(true);
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.size > 10 * 1024 * 1024) {
          toast.error(`File ${file.name} is larger than 10MB.`);
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

  // Submit complete verification application
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!bio.trim()) {
      toast.error("Please enter a short bio explaining your background.");
      return;
    }

    if (selectedSkills.length === 0) {
      toast.error("Please select at least 1 emergency skill.");
      return;
    }

    if (documents.length === 0) {
      toast.error("Please upload at least 1 proof document or training certificate.");
      return;
    }

    try {
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
        toast.success("Verification application submitted to Admin for review!");
        onClose();
      }
    } catch (err: any) {
      toast.error(err?.data?.message || err?.message || "Failed to submit application");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open: boolean) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl p-6 sm:p-8">
        <DialogHeader className="pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="grid size-11 place-items-center rounded-2xl bg-brand-red-soft text-brand-red">
              <ShieldCheck className="size-6" />
            </div>
            <div>
              <DialogTitle className="text-xl font-black text-brand-navy">
                Volunteer Verification Application
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500 mt-0.5">
                Submit your credentials and proof documents to become a certified emergency responder.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {isAppLoading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="size-8 animate-spin text-brand-red" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 pt-4">
            {/* Status notice if previously rejected */}
            {application?.verificationStatus === "REJECTED" && (
              <div className="flex items-start gap-3 rounded-2xl bg-red-50 border border-red-200 p-4 text-xs text-brand-red">
                <AlertCircle className="size-5 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Previous Application Requires Changes:</p>
                  <p className="mt-0.5 text-slate-700 font-medium">
                    {application.rejectionReason || "Please upload clearer training certificates."}
                  </p>
                </div>
              </div>
            )}

            {/* 1. Bio & Operational Experience */}
            <div className="space-y-4">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
                1. Professional Bio &amp; Operations
              </h4>

              <div>
                <label className="mb-1.5 block text-xs font-bold text-slate-700">
                  Short Bio / Motivation <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell admin about your emergency response experience, certifications, or passion for community rescue..."
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 p-3.5 text-xs font-medium text-slate-800 placeholder-slate-400 focus:bg-white focus:border-brand-red focus:outline-none focus:ring-2 focus:ring-brand-red/20"
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
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:bg-white focus:border-brand-red focus:outline-none focus:ring-2 focus:ring-brand-red/20"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-bold text-slate-700">
                    Service Radius (Max Distance)
                  </label>
                  <select
                    value={serviceRadiusKm}
                    onChange={(e) => setServiceRadiusKm(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:bg-white focus:border-brand-red focus:outline-none focus:ring-2 focus:ring-brand-red/20"
                  >
                    <option value={5}>5 km Radius</option>
                    <option value={10}>10 km Radius (Standard)</option>
                    <option value={15}>15 km Radius</option>
                    <option value={20}>20 km Radius (District Wide)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 2. Skills & Level Selection */}
            <div className="space-y-4 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
                  2. Emergency Response Skills <span className="text-red-500">*</span>
                </h4>
                <span className="text-[11px] font-bold text-brand-red">
                  {selectedSkills.length} Selected
                </span>
              </div>

              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                {availableSkills.map((skill) => {
                  const selected = selectedSkills.find((s) => s.skillId === skill.id);
                  return (
                    <div
                      key={skill.id}
                      className={cn(
                        "flex items-center justify-between rounded-2xl border p-3 transition",
                        selected
                          ? "border-brand-red bg-red-50/50 shadow-2xs"
                          : "border-slate-200 bg-white hover:bg-slate-50"
                      )}
                    >
                      <button
                        type="button"
                        onClick={() => handleToggleSkill(skill.id)}
                        className="flex items-center gap-2.5 flex-1 text-left cursor-pointer"
                      >
                        <div
                          className={cn(
                            "grid size-5 shrink-0 place-items-center rounded-md border text-xs",
                            selected
                              ? "bg-brand-red border-brand-red text-white font-bold"
                              : "border-slate-300 bg-white"
                          )}
                        >
                          {selected ? "✓" : ""}
                        </div>
                        <span className="text-xs font-bold text-slate-800">
                          {skill.name}
                        </span>
                      </button>

                      {selected && (
                        <select
                          value={selected.skillLevel}
                          onChange={(e) =>
                            handleSkillLevelChange(skill.id, e.target.value as any)
                          }
                          className="rounded-lg border border-red-200 bg-white px-2 py-1 text-[10.5px] font-black text-brand-red focus:outline-none"
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

            {/* 3. Proof Documents & Certification Attachments */}
            <div className="space-y-4 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
                  3. Verification Proof Documents <span className="text-red-500">*</span>
                </h4>
                <span className="text-[11px] font-bold text-slate-500">
                  {documents.length} Attached
                </span>
              </div>

              {/* Upload Controls */}
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/70 p-4 space-y-3">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-[11px] font-bold text-slate-600">
                      Document Type
                    </label>
                    <select
                      value={docType}
                      onChange={(e) => setDocType(e.target.value as any)}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none"
                    >
                      <option value="TRAINING">Training / Paramedic Certificate</option>
                      <option value="PROFILE">National ID / Passport Proof</option>
                      <option value="EXPERIENCE">Experience Letter / Work Proof</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-1 block text-[11px] font-bold text-slate-600">
                      Description / Certificate Title
                    </label>
                    <input
                      type="text"
                      value={docNote}
                      onChange={(e) => setDocNote(e.target.value)}
                      placeholder="e.g. Red Crescent CPR Certificate 2024"
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="relative flex items-center justify-center rounded-xl border border-slate-200 bg-white p-4 transition hover:bg-slate-50">
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    multiple
                    disabled={isUploading}
                    onChange={handleFileUpload}
                    className="absolute inset-0 size-full cursor-pointer opacity-0"
                  />
                  <div className="flex flex-col items-center text-center">
                    {isUploading ? (
                      <Loader2 className="size-6 animate-spin text-brand-red" />
                    ) : (
                      <UploadCloud className="size-6 text-brand-red" />
                    )}
                    <span className="mt-1 text-xs font-bold text-slate-700">
                      {isUploading ? "Uploading to Cloud..." : "Click or Drag to Upload Document"}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      PNG, JPG, PDF up to 10MB
                    </span>
                  </div>
                </div>
              </div>

              {/* Attached Documents List */}
              {documents.length > 0 && (
                <div className="space-y-2">
                  {documents.map((doc, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-3 shadow-2xs"
                    >
                      <div className="flex items-center gap-3 min-w-0 pr-2">
                        <div className="grid size-8 shrink-0 place-items-center rounded-lg bg-red-50 text-brand-red">
                          <FileText className="size-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-xs font-bold text-brand-navy">
                            {doc.notes || doc.fileName || `Document #${idx + 1}`}
                          </p>
                          <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[9.5px] font-black text-slate-600 uppercase">
                            {doc.verificationType}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
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
                          title="Remove Document"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
                className="rounded-xl px-5 text-xs font-bold"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || isUploading}
                className="rounded-xl bg-brand-red px-6 text-xs font-black text-white hover:bg-brand-red-dark shadow-md shadow-brand-red/20 cursor-pointer"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="size-4 animate-spin" />
                    Submitting Application...
                  </span>
                ) : (
                  "Submit for Verification"
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
