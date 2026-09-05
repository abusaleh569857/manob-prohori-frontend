"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  PhoneCall,
  Search,
  Building2,
  Ambulance,
  Droplets,
  Flame,
  ShieldAlert,
  MapPin,
  Clock,
  CheckCircle2,
  ExternalLink,
  Navigation,
  HeartPulse,
  Filter,
  Siren,
  LifeBuoy,
} from "lucide-react";
import { cn } from "@/lib/utils";

const EMERGENCY_HOTLINES = [
  { name: "National Emergency Service", number: "999", desc: "Police, Fire, Ambulance 24/7", color: "bg-red-600 text-white" },
  { name: "Fire Service & Civil Defence", number: "16163", desc: "Fire fighting & Rescue", color: "bg-orange-600 text-white" },
  { name: "National Health Helpline", number: "16263", desc: "Doctor consultation & ambulance", color: "bg-emerald-600 text-white" },
  { name: "Disaster Warning Hotline", number: "1090", desc: "Flood, Cyclone & Weather warnings", color: "bg-blue-600 text-white" },
  { name: "National Citizen Helpdesk", number: "333", desc: "Govt relief, food & citizen aid", color: "bg-indigo-600 text-white" },
  { name: "Child Emergency Helpline", number: "1098", desc: "Child protection & emergency rescue", color: "bg-rose-600 text-white" },
];

const DIRECTORY_ITEMS = [
  {
    id: 1,
    name: "Dhaka Medical College & Hospital",
    type: "HOSPITAL",
    district: "Dhaka",
    area: "Secretariat / Bakshibazar",
    phone: "01711223344",
    services: ["24/7 ICU", "Burn Unit", "Emergency Trauma", "Blood Bank"],
    status: "OPEN 24/7",
    verified: true,
  },
  {
    id: 2,
    name: "Kurmitola General Hospital",
    type: "HOSPITAL",
    district: "Dhaka",
    area: "Airport Road, Cantonment",
    phone: "01722334455",
    services: ["ICU Beds Available", "Oxygen Supply", "Emergency Care"],
    status: "OPEN 24/7",
    verified: true,
  },
  {
    id: 3,
    name: "Chittagong Medical College Hospital",
    type: "HOSPITAL",
    district: "Chittagong",
    area: "KB Fazlul Kader Road",
    phone: "01811223344",
    services: ["24/7 Trauma Care", "ICU", "Blood Storage"],
    status: "OPEN 24/7",
    verified: true,
  },
  {
    id: 4,
    name: "Sylhet Osmani Medical College",
    type: "HOSPITAL",
    district: "Sylhet",
    area: "Medical Road, Sylhet",
    phone: "01911223344",
    services: ["Flood Emergency Unit", "ICU", "Ambulance"],
    status: "OPEN 24/7",
    verified: true,
  },
  {
    id: 5,
    name: "Red Crescent Ambulance Unit",
    type: "AMBULANCE",
    district: "Dhaka",
    area: "Moghbazar & Nationwide",
    phone: "01700998877",
    services: ["ICU Ambulance", "Oxygen Support", "Inter-district Transfer"],
    status: "STANDBY",
    verified: true,
  },
  {
    id: 6,
    name: "Quantum Blood & Ambulance Service",
    type: "BLOOD_AMBULANCE",
    district: "Dhaka",
    area: "Shantinagar",
    phone: "01714010869",
    services: ["All Blood Groups Available", "Ambulance 24/7", "Plasma"],
    status: "OPEN 24/7",
    verified: true,
  },
  {
    id: 7,
    name: "Barisal Sher-e-Bangla Medical",
    type: "HOSPITAL",
    district: "Barisal",
    area: "Band Road, Barisal",
    phone: "01733445566",
    services: ["Coastal Disaster Ward", "Emergency Surgery", "Blood Bank"],
    status: "OPEN 24/7",
    verified: true,
  },
  {
    id: 8,
    name: "Fire Service Headquarters",
    type: "FIRE_RESCUE",
    district: "Dhaka",
    area: "Kazi Nazrul Islam Avenue",
    phone: "02223355555",
    services: ["Fire Outbreak Rescue", "Chemical Disaster Unit", "Deep Water Rescue"],
    status: "ACTIVE 24/7",
    verified: true,
  },
];

export function MasterFindHelpComponent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("ALL");
  const [selectedDistrict, setSelectedDistrict] = useState("ALL");

  const filteredItems = useMemo(() => {
    return DIRECTORY_ITEMS.filter((item) => {
      if (selectedType !== "ALL" && !item.type.includes(selectedType)) return false;
      if (selectedDistrict !== "ALL" && item.district !== selectedDistrict) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(q);
        const matchesArea = item.area.toLowerCase().includes(q);
        const matchesDist = item.district.toLowerCase().includes(q);
        const matchesServices = item.services.some((s) => s.toLowerCase().includes(q));
        if (!matchesName && !matchesArea && !matchesDist && !matchesServices) return false;
      }
      return true;
    });
  }, [searchQuery, selectedType, selectedDistrict]);

  return (
    <div className="space-y-10 pb-16">
      {/* 1. HERO & HOTLINES BANNER */}
      <div className="relative overflow-hidden rounded-3xl border border-red-500/20 bg-linear-to-r from-brand-navy via-slate-900 to-brand-navy p-8 sm:p-12 text-white shadow-xl">
        <div className="pointer-events-none absolute -right-20 -top-20 size-80 rounded-full bg-red-600/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 left-10 size-64 rounded-full bg-blue-600/20 blur-3xl" />

        <div className="relative z-10 space-y-4">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-red px-3.5 py-1 text-xs font-black uppercase text-white shadow-xs">
            <LifeBuoy className="size-3.5" /> Direct Emergency Directory
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
            Find Emergency Help &amp; Medical Resources
          </h1>
          <p className="max-w-2xl text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
            Search verified hospitals, ambulance fleets, blood banks, and disaster shelters across Bangladesh. Instant 1-click calls and directions.
          </p>
        </div>

        {/* Quick Hotline Badges Grid */}
        <div className="relative z-10 mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {EMERGENCY_HOTLINES.map((h) => (
            <a
              key={h.number}
              href={`tel:${h.number}`}
              className="group flex flex-col justify-between rounded-2xl border border-white/10 bg-white/10 p-3.5 backdrop-blur-md transition hover:bg-white/20 hover:scale-[1.02] cursor-pointer"
            >
              <div>
                <span className="text-[11px] font-bold text-slate-300 block line-clamp-1">{h.name}</span>
                <span className="text-2xl font-black text-white mt-1 block tracking-wider">{h.number}</span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium mt-2 line-clamp-1">{h.desc}</p>
            </a>
          ))}
        </div>
      </div>

      {/* 2. SEARCH & FILTER CONTROLS */}
      <div className="rounded-3xl border border-slate-200/90 bg-white/95 p-6 backdrop-blur-xl shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3.5 size-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search hospitals, ambulances, blood groups, ICU, or area..."
              className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 py-3 pl-10 pr-4 text-xs sm:text-sm font-semibold text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/10"
            />
          </div>

          {/* District Dropdown */}
          <div className="w-full md:w-56">
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 py-3 px-3.5 text-xs sm:text-sm font-bold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/10 cursor-pointer"
            >
              <option value="ALL">All Districts</option>
              <option value="Dhaka">Dhaka</option>
              <option value="Chittagong">Chittagong</option>
              <option value="Sylhet">Sylhet</option>
              <option value="Barisal">Barisal</option>
              <option value="Khulna">Khulna</option>
              <option value="Rajshahi">Rajshahi</option>
              <option value="Rangpur">Rangpur</option>
              <option value="Mymensingh">Mymensingh</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
          {[
            { id: "ALL", label: "All Resources" },
            { id: "HOSPITAL", label: "🏥 Hospitals & ICU" },
            { id: "AMBULANCE", label: "🚑 Ambulances" },
            { id: "BLOOD", label: "🩸 Blood Banks" },
            { id: "FIRE", label: "🚒 Fire & Rescue" },
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedType(cat.id)}
              className={cn(
                "rounded-xl px-3.5 py-1.5 text-xs font-bold transition cursor-pointer",
                selectedType === cat.id
                  ? "bg-brand-red text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3. DIRECTORY GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="group rounded-3xl border border-slate-200/90 bg-white/95 p-6 backdrop-blur-xl shadow-[0_10px_30px_rgba(16,35,63,0.04)] flex flex-col justify-between transition-all hover:border-red-300 hover:shadow-lg"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="rounded-lg bg-red-50 border border-red-200 px-2.5 py-0.5 text-[10px] font-black uppercase text-brand-red">
                  {item.type}
                </span>
                <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                  <CheckCircle2 className="size-3.5" /> Verified
                </span>
              </div>

              <h3 className="text-base font-black text-brand-navy leading-snug group-hover:text-brand-red transition">
                {item.name}
              </h3>

              <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                <MapPin className="size-3.5 text-brand-red shrink-0" />
                <span>{item.area}, {item.district}</span>
              </p>

              {/* Service Badges */}
              <div className="mt-4 flex flex-wrap gap-1.5">
                {item.services.map((srv, i) => (
                  <span key={i} className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">
                    {srv}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2">
              <a
                href={`tel:${item.phone}`}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-brand-navy py-2.5 px-3 text-xs font-black text-white hover:bg-slate-800 transition"
              >
                <PhoneCall className="size-3.5 text-emerald-400" />
                <span>Call {item.phone}</span>
              </a>
              <Link
                href="/crisis-map"
                className="grid size-9 place-items-center rounded-xl border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-brand-navy transition shadow-2xs"
                title="View on Map"
              >
                <Navigation className="size-4 text-brand-red" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
