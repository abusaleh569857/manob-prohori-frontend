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
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const mockVolunteers = [
  {
    id: 1,
    name: "Dr. Rafiqul Islam",
    email: "rafiqul.paramedic@gmail.com",
    phone: "+8801712345678",
    location: "Dhanmondi, Dhaka",
    serviceRadius: "5 km",
    experienceYears: "4.5 yrs",
    verificationStatus: "PENDING",
    submittedAt: "Today at 2:30 PM",
    bio: "Certified emergency medical technician with Red Crescent first aid training.",
    skills: [
      { name: "CPR & First Aid", level: "EXPERT" },
      { name: "Trauma Care", level: "INTERMEDIATE" },
    ],
    documents: [
      { name: "Paramedic_Certification.pdf", type: "TRAINING" },
      { name: "Experience_Letter_Square_Hospital.pdf", type: "EXPERIENCE" },
    ],
  },
  {
    id: 2,
    name: "Mahmud Hasan",
    email: "mahmud.firelead@gmail.com",
    phone: "+8801812998877",
    location: "Kalabagan, Dhaka",
    serviceRadius: "7.5 km",
    experienceYears: "3 yrs",
    verificationStatus: "PENDING",
    submittedAt: "Yesterday at 6:15 PM",
    bio: "Volunteer rescue team leader, experienced in fire safety and crowd management.",
    skills: [
      { name: "Fire Response", level: "ADVANCED" },
      { name: "Search & Rescue", level: "INTERMEDIATE" },
    ],
    documents: [
      { name: "Civil_Defense_Training_Card.pdf", type: "TRAINING" },
    ],
  },
  {
    id: 3,
    name: "Tanvir Hossain",
    email: "tanvir.rescue@gmail.com",
    phone: "+8801911445566",
    location: "Mohammadpur, Dhaka",
    serviceRadius: "5 km",
    experienceYears: "2 yrs",
    verificationStatus: "APPROVED",
    submittedAt: "3 days ago",
    bio: "Active volunteer with 12 successful emergency incident responses.",
    skills: [
      { name: "Crowd Control", level: "ADVANCED" },
      { name: "Basic First Aid", level: "BASIC" },
    ],
    documents: [
      { name: "Volunteer_ID_Proof.pdf", type: "PROFILE" },
    ],
  },
];

export function MasterAdminVolunteersComponent() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [volunteers, setVolunteers] = useState(mockVolunteers);

  const filteredVolunteers = volunteers.filter((vol) => {
    const matchesSearch =
      vol.name.toLowerCase().includes(search.toLowerCase()) ||
      vol.email.toLowerCase().includes(search.toLowerCase()) ||
      vol.phone.includes(search) ||
      vol.location.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "ALL" || vol.verificationStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleApprove = (id: number, name: string) => {
    setVolunteers((prev) =>
      prev.map((v) => (v.id === id ? { ...v, verificationStatus: "APPROVED" } : v))
    );
    toast.success(`Volunteer "${name}" approved successfully!`);
  };

  const handleReject = (id: number, name: string) => {
    setVolunteers((prev) =>
      prev.map((v) => (v.id === id ? { ...v, verificationStatus: "REJECTED" } : v))
    );
    toast.error(`Volunteer "${name}" application rejected.`);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-black text-brand-navy tracking-tight sm:text-2xl">
            Volunteer Verifications & Responders Directory
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Review submitted training certificates, experience, and verify emergency responders
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-bold text-emerald-700">
            142 Total Responders
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

        <div className="flex items-center gap-1.5">
          {["ALL", "PENDING", "APPROVED", "REJECTED"].map((status) => (
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

      {/* 3. Volunteer Cards List */}
      <div className="space-y-4">
        {filteredVolunteers.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
            <p className="text-sm font-bold text-slate-500">No volunteers found</p>
          </div>
        ) : (
          filteredVolunteers.map((vol) => (
            <div
              key={vol.id}
              className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs transition hover:border-slate-300 hover:shadow-md"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                {/* Left Profile Info */}
                <div className="flex items-start gap-3.5 min-w-0 flex-1">
                  <div className="grid size-12 shrink-0 place-items-center rounded-2xl bg-brand-navy text-white font-black text-sm shadow-xs">
                    {vol.name.charAt(0)}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm font-bold text-brand-navy">
                        {vol.name}
                      </h3>
                      <span
                        className={cn(
                          "rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase border",
                          vol.verificationStatus === "PENDING" &&
                            "bg-amber-50 text-amber-700 border-amber-200",
                          vol.verificationStatus === "APPROVED" &&
                            "bg-emerald-50 text-emerald-700 border-emerald-200",
                          vol.verificationStatus === "REJECTED" &&
                            "bg-red-50 text-brand-red border-red-200"
                        )}
                      >
                        {vol.verificationStatus}
                      </span>
                      <span className="text-xs text-slate-400 font-medium">
                        Submitted {vol.submittedAt}
                      </span>
                    </div>

                    <p className="mt-1 text-xs text-slate-600">
                      {vol.bio}
                    </p>

                    {/* Metadata Grid */}
                    <div className="mt-2.5 flex flex-wrap items-center gap-4 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <MapPin className="size-3.5 text-slate-400" />
                        {vol.location} ({vol.serviceRadius} radius)
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
                        {vol.experienceYears} Experience
                      </span>
                    </div>

                    {/* Skills Tags */}
                    <div className="mt-3 flex flex-wrap items-center gap-1.5">
                      <span className="text-[11px] font-bold text-slate-400 mr-1">
                        Skills:
                      </span>
                      {vol.skills.map((skill) => (
                        <span
                          key={skill.name}
                          className="rounded-lg bg-slate-100 border border-slate-200 px-2 py-0.5 text-[11px] font-bold text-slate-700"
                        >
                          {skill.name} · <strong className="text-brand-navy">{skill.level}</strong>
                        </span>
                      ))}
                    </div>

                    {/* Attached Documents */}
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <span className="text-[11px] font-bold text-slate-400 mr-1">
                        Documents:
                      </span>
                      {vol.documents.map((doc) => (
                        <div
                          key={doc.name}
                          className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50/70 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                        >
                          <FileText className="size-3 text-brand-red" />
                          <span>{doc.name}</span>
                          <Eye className="size-3 text-slate-400 ml-1" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Action Buttons */}
                <div className="flex items-center gap-2 border-t border-slate-100 pt-3 lg:border-t-0 lg:pt-0 shrink-0">
                  {vol.verificationStatus === "PENDING" ? (
                    <>
                      <button
                        onClick={() => handleApprove(vol.id, vol.name)}
                        className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 transition cursor-pointer"
                      >
                        <CheckCircle2 className="size-3.5" />
                        Approve Responder
                      </button>
                      <button
                        onClick={() => handleReject(vol.id, vol.name)}
                        className="flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2 text-xs font-bold text-brand-red hover:bg-red-100 transition cursor-pointer"
                      >
                        <XCircle className="size-3.5" />
                        Reject
                      </button>
                    </>
                  ) : vol.verificationStatus === "APPROVED" ? (
                    <button
                      onClick={() => handleReject(vol.id, vol.name)}
                      className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-600 hover:bg-red-50 hover:text-brand-red hover:border-red-200 transition cursor-pointer"
                    >
                      Suspend Access
                    </button>
                  ) : (
                    <button
                      onClick={() => handleApprove(vol.id, vol.name)}
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
    </div>
  );
}
