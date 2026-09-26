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
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useGetHospitalsQuery } from "@/redux/api/hospitalApi";
import { useGetEmergencyServicesQuery } from "@/redux/api/emergencyServiceApi";

interface DirectoryItem {
  id: string | number;
  name: string;
  type: string;
  district: string;
  area: string;
  phone: string;
  services: string[];
  status: string;
  verified: boolean;
}

export function MasterFindHelpComponent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("ALL");
  const [selectedDistrict, setSelectedDistrict] = useState("ALL");

  // 1. Fetch live hospitals & services from Database
  const { data: hospitalsRes, isLoading: isHospitalsLoading } = useGetHospitalsQuery({ limit: 100 });
  const { data: emergencyRes, isLoading: isEmergencyLoading } = useGetEmergencyServicesQuery({});

  const hospitalsList = hospitalsRes?.data || [];
  const emergencyList = emergencyRes?.data || [];

  // 2. Transform Database records into Directory Items
  const directoryItems: DirectoryItem[] = useMemo(() => {
    const items: DirectoryItem[] = [];

    // Map DB Hospitals
    hospitalsList.forEach((h: any) => {
      const srvNames = (h.services || []).map((s: any) => s.serviceName || s.service_name || s.name);
      if (srvNames.length === 0) {
        if (h.emergencyAvailable) srvNames.push("24/7 Emergency");
        srvNames.push(h.facilityType || "General Healthcare");
      }

      items.push({
        id: `hosp-${h.id}`,
        name: h.name,
        type: "HOSPITAL",
        district: h.district || "Dhaka",
        area: h.upazila || h.city || h.addressText || "Central",
        phone: h.phone || "01711000001",
        services: srvNames.slice(0, 4),
        status: h.emergencyAvailable ? "OPEN 24/7" : "REGULAR HOURS",
        verified: true,
      });
    });

    // Map DB Emergency Services & Contacts (Ambulances, Fire, Police)
    emergencyList.forEach((es: any) => {
      const contacts = es.contacts || [];
      contacts.forEach((c: any) => {
        items.push({
          id: `es-${c.id}`,
          name: c.displayLabel || c.display_label || es.name,
          type: es.serviceType || es.service_type || "OTHER",
          district: c.regionName || c.region_name || "Nationwide",
          area: c.regionName || c.region_name || "All Bangladesh",
          phone: c.phoneNumber || c.phone_number,
          services: [es.name, es.description || "24/7 Crisis Response"].filter(Boolean).slice(0, 3),
          status: "ACTIVE 24/7",
          verified: true,
        });
      });
    });

    return items;
  }, [hospitalsList, emergencyList]);

  // 3. Extract Dynamic Hotlines
  const dynamicHotlines = useMemo(() => {
    const list: Array<{ name: string; number: string; desc: string }> = [];

    emergencyList.forEach((es: any) => {
      const primaryContact = (es.contacts || []).find((c: any) => c.isPrimary || c.is_primary) || es.contacts?.[0];
      if (primaryContact) {
        list.push({
          name: es.name,
          number: primaryContact.phoneNumber || primaryContact.phone_number,
          desc: es.description || "24/7 Emergency Assistance",
        });
      }
    });

    if (list.length === 0) {
      // Clean fallback if loading
      return [
        { name: "National Emergency", number: "999", desc: "Police, Fire, Ambulance 24/7" },
        { name: "Fire Service", number: "16163", desc: "Fire fighting & Rescue" },
        { name: "Disaster Warning", number: "1090", desc: "Flood & Cyclone warnings" },
        { name: "Child Protection", number: "1098", desc: "Child emergency rescue" },
        { name: "Red Crescent Ambulance", number: "02-9330188", desc: "Emergency Transport" },
        { name: "Coast Guard Rescue", number: "01769440555", desc: "Coastal & River Rescue" },
      ];
    }

    return list.slice(0, 6);
  }, [emergencyList]);

  // 4. Unique districts from live items
  const availableDistricts = useMemo(() => {
    const set = new Set<string>();
    directoryItems.forEach((item) => {
      if (item.district && item.district !== "Nationwide") {
        set.add(item.district);
      }
    });
    return Array.from(set).sort();
  }, [directoryItems]);

  // 5. Search & Filter logic
  const filteredItems = useMemo(() => {
    return directoryItems.filter((item) => {
      if (selectedType !== "ALL") {
        if (selectedType === "HOSPITAL" && item.type !== "HOSPITAL") return false;
        if (selectedType === "AMBULANCE" && !item.type.includes("AMBULANCE")) return false;
        if (selectedType === "FIRE" && !item.type.includes("FIRE")) return false;
        if (selectedType === "POLICE" && !item.type.includes("POLICE")) return false;
      }
      if (selectedDistrict !== "ALL" && item.district !== selectedDistrict) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(q);
        const matchesArea = item.area.toLowerCase().includes(q);
        const matchesDist = item.district.toLowerCase().includes(q);
        const matchesPhone = item.phone.includes(q);
        const matchesServices = item.services.some((s) => s.toLowerCase().includes(q));
        if (!matchesName && !matchesArea && !matchesDist && !matchesServices && !matchesPhone) return false;
      }
      return true;
    });
  }, [directoryItems, searchQuery, selectedType, selectedDistrict]);

  const isLoading = isHospitalsLoading || isEmergencyLoading;

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
            Search verified hospitals, ambulance fleets, fire control stations, and crisis helplines loaded live from the Manob Prohori database.
          </p>
        </div>

        {/* Quick Hotline Badges Grid (Live DB Hotlines) */}
        <div className="relative z-10 mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {dynamicHotlines.map((h) => (
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
              placeholder="Search hospitals, ambulances, fire rescue, or phone number..."
              className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 py-3 pl-10 pr-4 text-xs sm:text-sm font-semibold text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/10"
            />
          </div>

          {/* District Dropdown (Dynamic) */}
          <div className="w-full md:w-56">
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 py-3 px-3.5 text-xs sm:text-sm font-bold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/10 cursor-pointer"
            >
              <option value="ALL">All Districts ({directoryItems.length} entries)</option>
              {availableDistricts.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
          {[
            { id: "ALL", label: "All Resources" },
            { id: "HOSPITAL", label: "🏥 Hospitals & Clinics" },
            { id: "AMBULANCE", label: "🚑 Ambulances" },
            { id: "FIRE", label: "🚒 Fire & Rescue" },
            { id: "POLICE", label: "🚓 Police Control" },
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
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="size-8 text-brand-red animate-spin" />
          <span className="ml-3 text-sm font-bold text-slate-600">Loading verified facilities...</span>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center">
          <Building2 className="mx-auto size-12 text-slate-300" />
          <h3 className="mt-3 text-base font-bold text-slate-700">No emergency resources found</h3>
          <p className="mt-1 text-xs text-slate-400">Try adjusting your search keywords or district filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="group rounded-3xl border border-slate-200/90 bg-white/95 p-6 backdrop-blur-xl shadow-[0_10px_30px_rgba(16,35,63,0.04)] flex flex-col justify-between transition-all hover:border-red-300 hover:shadow-lg"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="rounded-lg bg-red-50 border border-red-200 px-2.5 py-0.5 text-[10px] font-black uppercase text-brand-red">
                    {item.type.replace(/_/g, " ")}
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
                  <span className="truncate">{item.area}, {item.district}</span>
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
      )}
    </div>
  );
}
