"use client";

import { useState } from "react";
import {
  HeartPulse,
  Search,
  CheckCircle2,
  XCircle,
  FileText,
  MapPin,
  Phone,
  Clock,
  Eye,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const mockDonors = [
  {
    id: 1,
    name: "Sadia Sultana",
    phone: "+8801755123456",
    bloodGroup: "O+",
    location: "Panthapath, Dhaka",
    lastDonation: "4 months ago",
    availability: "AVAILABLE",
    verificationStatus: "PENDING",
    submittedAt: "Today, 11:30 AM",
    hospitalReport: "Square_Hospital_Pathology_Report.pdf",
  },
  {
    id: 2,
    name: "Ahsan Habib",
    phone: "+8801822334455",
    bloodGroup: "A-",
    location: "Dhanmondi, Dhaka",
    lastDonation: "6 months ago",
    availability: "AVAILABLE",
    verificationStatus: "PENDING",
    submittedAt: "Yesterday, 4:20 PM",
    hospitalReport: "Evercare_Blood_Group_Card.pdf",
  },
  {
    id: 3,
    name: "Kamrul Hasan",
    phone: "+8801933557788",
    bloodGroup: "B+",
    location: "Mirpur 2, Dhaka",
    lastDonation: "2 months ago",
    availability: "UNAVAILABLE",
    verificationStatus: "APPROVED",
    submittedAt: "5 days ago",
    hospitalReport: "LabAid_Diagnostic_Report.pdf",
  },
];

export function MasterAdminBloodDonorsComponent() {
  const [search, setSearch] = useState("");
  const [groupFilter, setGroupFilter] = useState("ALL");
  const [donors, setDonors] = useState(mockDonors);

  const filteredDonors = donors.filter((d) => {
    const matchesSearch =
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.phone.includes(search) ||
      d.location.toLowerCase().includes(search.toLowerCase());
    const matchesGroup =
      groupFilter === "ALL" || d.bloodGroup === groupFilter;
    return matchesSearch && matchesGroup;
  });

  const handleApprove = (id: number, name: string) => {
    setDonors((prev) =>
      prev.map((d) => (d.id === id ? { ...d, verificationStatus: "APPROVED" } : d))
    );
    toast.success(`Blood Donor "${name}" approved successfully!`);
  };

  const handleReject = (id: number, name: string) => {
    setDonors((prev) =>
      prev.map((d) => (d.id === id ? { ...d, verificationStatus: "REJECTED" } : d))
    );
    toast.error(`Blood Donor "${name}" report rejected.`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-black text-brand-navy tracking-tight sm:text-2xl">
            Blood Donor Verification & Registry
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Review hospital pathology reports and verify eligible blood donors
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="rounded-full bg-rose-50 border border-rose-200 px-3 py-1 text-xs font-bold text-rose-700">
            86 Verified Donors
          </span>
        </div>
      </div>

      {/* Search and Blood Group Filters */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs">
        <div className="relative min-w-[260px] flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search donor name, phone, or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-4 py-2 text-xs font-medium focus:border-brand-navy focus:bg-white focus:outline-none transition"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {["ALL", "O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"].map((grp) => (
            <button
              key={grp}
              onClick={() => setGroupFilter(grp)}
              className={cn(
                "rounded-xl px-2.5 py-1 text-xs font-bold transition cursor-pointer",
                groupFilter === grp
                  ? "bg-rose-600 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              )}
            >
              {grp}
            </button>
          ))}
        </div>
      </div>

      {/* Donors List */}
      <div className="space-y-4">
        {filteredDonors.map((donor) => (
          <div
            key={donor.id}
            className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs transition hover:border-slate-300 hover:shadow-md"
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="flex items-start gap-3.5 min-w-0 flex-1">
                <div className="grid size-12 shrink-0 place-items-center rounded-2xl bg-rose-50 text-rose-600 font-black text-sm ring-1 ring-rose-200">
                  {donor.bloodGroup}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-sm font-bold text-brand-navy">
                      {donor.name}
                    </h3>
                    <span
                      className={cn(
                        "rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase border",
                        donor.verificationStatus === "PENDING" &&
                          "bg-amber-50 text-amber-700 border-amber-200",
                        donor.verificationStatus === "APPROVED" &&
                          "bg-emerald-50 text-emerald-700 border-emerald-200"
                      )}
                    >
                      {donor.verificationStatus}
                    </span>
                    <span className="text-xs text-slate-400">
                      Submitted {donor.submittedAt}
                    </span>
                  </div>

                  <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <MapPin className="size-3.5 text-slate-400" />
                      {donor.location}
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Phone className="size-3.5 text-slate-400" />
                      {donor.phone}
                    </span>
                    <span>·</span>
                    <span>Last Donation: <strong>{donor.lastDonation}</strong></span>
                  </div>

                  {/* Attached Pathology Document */}
                  <div className="mt-3 flex items-center gap-2">
                    <span className="text-[11px] font-bold text-slate-400">
                      Blood Report:
                    </span>
                    <div className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50/70 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition cursor-pointer">
                      <FileText className="size-3 text-rose-600" />
                      <span>{donor.hospitalReport}</span>
                      <Eye className="size-3 text-slate-400 ml-1" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0">
                {donor.verificationStatus === "PENDING" ? (
                  <>
                    <button
                      onClick={() => handleApprove(donor.id, donor.name)}
                      className="flex items-center gap-1.5 rounded-xl bg-rose-600 px-3.5 py-2 text-xs font-bold text-white shadow-xs hover:bg-rose-700 transition cursor-pointer"
                    >
                      <CheckCircle2 className="size-3.5" />
                      Verify Donor
                    </button>
                    <button
                      onClick={() => handleReject(donor.id, donor.name)}
                      className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-bold text-brand-red hover:bg-red-100 transition cursor-pointer"
                    >
                      Reject Report
                    </button>
                  </>
                ) : (
                  <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                    <ShieldCheck className="size-4" />
                    Verified Eligible
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
