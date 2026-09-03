"use client";

import { useState } from "react";
import {
  HandHeart,
  Search,
  CheckCircle2,
  XCircle,
  FileText,
  MapPin,
  Phone,
  Eye,
  CreditCard,
  Building2,
  DollarSign,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const mockReliefs = [
  {
    id: 1,
    title: "Emergency Burn Treatment & Medication Aid",
    applicantName: "Habibur Rahman",
    applicantPhone: "+8801722334455",
    location: "Kalabagan, Dhaka",
    requiredAmount: "৳ 45,000",
    bkash: "+8801722334455",
    nagad: "+8801722334455",
    status: "PENDING",
    submittedAt: "Today, 1:15 PM",
    description: "Severe burn injury from electrical short-circuit fire. Immediate ICU medication required.",
    documents: ["Hospital_Admission_Receipt.pdf", "Burn_Unit_Prescription.pdf"],
  },
  {
    id: 2,
    title: "Flood Shelter Food & Drinking Water Package",
    applicantName: "Abdul Matin",
    applicantPhone: "+8801811998877",
    location: "Feni Sadar, Feni",
    requiredAmount: "৳ 30,000",
    bkash: "+8801811998877",
    rocket: "+88018119988774",
    status: "APPROVED",
    submittedAt: "Yesterday, 3:00 PM",
    description: "Community shelter support for 25 families marooned due to flash flood.",
    documents: ["Local_Union_Parishad_Letter.pdf"],
  },
];

export function MasterAdminReliefComponent() {
  const [reliefs, setReliefs] = useState(mockReliefs);
  const [search, setSearch] = useState("");

  const handleApprove = (id: number, title: string) => {
    setReliefs((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "APPROVED" } : r))
    );
    toast.success(`Relief application approved and published for direct donations!`);
  };

  const handleReject = (id: number, title: string) => {
    setReliefs((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "REJECTED" } : r))
    );
    toast.error(`Relief application rejected.`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-black text-brand-navy tracking-tight sm:text-2xl">
            Relief Applications Verification
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Review victim relief applications and authorize direct MFS donation publishing
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="rounded-full bg-blue-50 border border-blue-200 px-3 py-1 text-xs font-bold text-brand-blue">
            19 Total Applications
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {reliefs.map((relief) => (
          <div
            key={relief.id}
            className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs transition hover:border-slate-300 hover:shadow-md"
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="flex items-start gap-3.5 min-w-0 flex-1">
                <div className="grid size-12 shrink-0 place-items-center rounded-2xl bg-blue-50 text-brand-blue font-black shadow-xs">
                  <HandHeart className="size-6" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-sm font-bold text-brand-navy">
                      {relief.title}
                    </h3>
                    <span
                      className={cn(
                        "rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase border",
                        relief.status === "PENDING" && "bg-amber-50 text-amber-700 border-amber-200",
                        relief.status === "APPROVED" && "bg-emerald-50 text-emerald-700 border-emerald-200",
                        relief.status === "REJECTED" && "bg-red-50 text-brand-red border-red-200"
                      )}
                    >
                      {relief.status}
                    </span>
                    <span className="text-xs font-black text-brand-red">
                      Target: {relief.requiredAmount}
                    </span>
                  </div>

                  <p className="mt-1 text-xs text-slate-600">
                    {relief.description}
                  </p>

                  <div className="mt-2.5 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <MapPin className="size-3.5 text-slate-400" />
                      {relief.location}
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Phone className="size-3.5 text-slate-400" />
                      Applicant: {relief.applicantName} ({relief.applicantPhone})
                    </span>
                    <span>·</span>
                    <span className="font-semibold text-brand-navy">
                      bKash: {relief.bkash}
                    </span>
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <span className="text-[11px] font-bold text-slate-400">
                      Proof Documents:
                    </span>
                    {relief.documents.map((doc) => (
                      <div
                        key={doc}
                        className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50/70 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                      >
                        <FileText className="size-3 text-brand-blue" />
                        <span>{doc}</span>
                        <Eye className="size-3 text-slate-400 ml-1" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {relief.status === "PENDING" ? (
                  <>
                    <button
                      onClick={() => handleApprove(relief.id, relief.title)}
                      className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 transition cursor-pointer"
                    >
                      <CheckCircle2 className="size-3.5" />
                      Approve & Publish
                    </button>
                    <button
                      onClick={() => handleReject(relief.id, relief.title)}
                      className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-bold text-brand-red hover:bg-red-100 transition cursor-pointer"
                    >
                      Reject
                    </button>
                  </>
                ) : (
                  <span className="rounded-xl bg-emerald-50 border border-emerald-200 px-3 py-1.5 text-xs font-bold text-emerald-700">
                    ✓ Published for Direct Aid
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
