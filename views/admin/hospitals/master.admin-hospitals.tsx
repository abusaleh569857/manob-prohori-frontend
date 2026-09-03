"use client";

import { useState } from "react";
import { Building2, MapPin, Phone, Search, Plus, ShieldCheck, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

const mockHospitals = [
  {
    id: 1,
    name: "Dhaka Medical College Hospital",
    nameBn: "ঢাকা মেডিকেল কলেজ হাসপাতাল",
    facilityType: "GOVERNMENT_SPECIALIZED",
    district: "Dhaka",
    location: "Secretariat Road, Dhaka 1000",
    phone: "+880255165088",
    emergencyAvailable: true,
    specialties: ["Burn Unit", "Trauma Care", "ICU", "Cardiology"],
  },
  {
    id: 2,
    name: "Square Hospitals Limited",
    nameBn: "স্কয়ার হাসপাতাল",
    facilityType: "PRIVATE_TERTIARY",
    district: "Dhaka",
    location: "18/F West Panthapath, Dhaka 1205",
    phone: "+8801713377775",
    emergencyAvailable: true,
    specialties: ["Emergency ICU", "Neurology", "Cardiology", "Trauma"],
  },
  {
    id: 3,
    name: "Kurmitola General Hospital",
    nameBn: "কুর্মিটোলা জেনারেল হাসপাতাল",
    facilityType: "GOVERNMENT_GENERAL",
    district: "Dhaka",
    location: "Airport Road, Cantonment, Dhaka",
    phone: "+88028711234",
    emergencyAvailable: true,
    specialties: ["General Emergency", "Orthopedics", "Isolation Unit"],
  },
];

export function MasterAdminHospitalsComponent() {
  const [search, setSearch] = useState("");

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-black text-brand-navy tracking-tight sm:text-2xl">
            Hospital & Medical Hub Network
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Maintain emergency hospital directory, specialties, and 24/7 hotline contact information
          </p>
        </div>

        <button className="flex items-center gap-1.5 rounded-xl bg-brand-red px-3.5 py-2 text-xs font-bold text-white shadow-xs hover:bg-brand-red-dark transition cursor-pointer">
          <Plus className="size-4" />
          Add Medical Facility
        </button>
      </div>

      <div className="space-y-4">
        {mockHospitals.map((hosp) => (
          <div
            key={hosp.id}
            className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs transition hover:border-slate-300 hover:shadow-md"
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="flex items-start gap-3.5 min-w-0 flex-1">
                <div className="grid size-12 shrink-0 place-items-center rounded-2xl bg-blue-50 text-brand-blue font-black shadow-xs">
                  <Building2 className="size-6" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-sm font-bold text-brand-navy">
                      {hosp.name}
                    </h3>
                    <span className="text-xs text-slate-400 font-semibold">
                      ({hosp.nameBn})
                    </span>
                    {hosp.emergencyAvailable && (
                      <span className="rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 text-[10px] font-bold">
                        24/7 Emergency Active
                      </span>
                    )}
                  </div>

                  <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <MapPin className="size-3.5 text-slate-400" />
                      {hosp.location}
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1 font-semibold text-brand-navy">
                      <Phone className="size-3.5 text-slate-400" />
                      {hosp.phone}
                    </span>
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-1.5">
                    <span className="text-[11px] font-bold text-slate-400 mr-1">
                      Key Specialties:
                    </span>
                    {hosp.specialties.map((spec) => (
                      <span
                        key={spec}
                        className="rounded-lg bg-slate-100 border border-slate-200 px-2 py-0.5 text-[11px] font-bold text-slate-700"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 transition cursor-pointer">
                  Edit Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
