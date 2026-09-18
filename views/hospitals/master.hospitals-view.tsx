"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  MapPin,
  Phone,
  Navigation,
  Clock,
  Shield,
  Activity,
  LocateFixed,
  Filter,
  RefreshCw,
  ExternalLink,
  HeartPulse,
  Building2,
  Stethoscope,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  SlidersHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  useGetHospitalsQuery,
  useGetSpecialtiesQuery,
} from "@/redux/api/hospitalApi";
import type { HospitalFilters } from "@/types/hospital.types";

const BANGLADESH_DIVISIONS = [
  "Dhaka",
  "Chittagong",
  "Sylhet",
  "Rajshahi",
  "Khulna",
  "Barisal",
  "Rangpur",
  "Mymensingh",
];

export function MasterHospitalsView() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDivision, setSelectedDivision] = useState<string>("ALL");
  const [emergencyOnly, setEmergencyOnly] = useState<boolean>(false);
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>("ALL");
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState(false);

  // Specialties list from API
  const { data: specialtiesRes } = useGetSpecialtiesQuery();
  const specialtiesList = specialtiesRes?.data || [];

  // Query Params
  const queryParams: HospitalFilters = {
    search: searchTerm.trim() || undefined,
    division: selectedDivision !== "ALL" ? selectedDivision : undefined,
    emergencyOnly: emergencyOnly ? true : undefined,
    specialtyId: selectedSpecialty !== "ALL" ? Number(selectedSpecialty) : undefined,
    latitude: userLocation?.lat,
    longitude: userLocation?.lng,
    limit: 60,
  };

  const {
    data: hospitalsRes,
    isLoading,
    isFetching,
    refetch,
  } = useGetHospitalsQuery(queryParams);

  const hospitals = hospitalsRes?.data || [];

  // Browser GPS Location Trigger
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser.");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setIsLocating(false);
        toast.success("📍 GPS location acquired! Sorting hospitals by closest distance.");
      },
      (err) => {
        setIsLocating(false);
        console.warn("Location error:", err);
        toast.error("Unable to access GPS location. Please check browser permissions.");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedDivision("ALL");
    setEmergencyOnly(false);
    setSelectedSpecialty("ALL");
    setUserLocation(null);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      {/* 1. Header Hero Section */}
      <section className="relative overflow-hidden border-b border-slate-200/80 bg-linear-to-b from-white via-slate-50 to-slate-100/50 pt-10 pb-12">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 border border-red-200 px-3 py-1 text-xs font-black uppercase tracking-wider text-brand-red shadow-2xs">
              <HeartPulse className="size-3.5 animate-pulse" />
              <span>National Health Directory</span>
            </span>

            <h1 className="mt-3 text-2xl sm:text-4xl font-black text-brand-navy tracking-tight">
              Hospital &amp; Emergency Medical Locator
            </h1>

            <p className="mt-2 text-xs sm:text-sm font-medium text-slate-600 leading-relaxed max-w-2xl mx-auto">
              Locate verified government and private hospitals across Bangladesh with 24/7 emergency triage, specialized care units, and 1-tap direct emergency phone contacts.
            </p>

            {/* Quick Emergency Hotline CTA */}
            <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
              <a
                href="tel:999"
                className="inline-flex items-center gap-2 rounded-2xl bg-brand-red px-5 py-2.5 text-xs font-black text-white shadow-lg shadow-brand-red/25 hover:bg-brand-red-dark transition cursor-pointer"
              >
                <Phone className="size-4 animate-bounce" />
                <span>Urgent Life Threat? Call 999</span>
              </a>

              <Link
                href="/emergency-directory"
                className="inline-flex items-center gap-2 rounded-2xl border border-slate-300 bg-white px-4 py-2.5 text-xs font-extrabold text-brand-navy hover:bg-slate-50 hover:border-brand-navy transition cursor-pointer shadow-2xs"
              >
                <Activity className="size-4 text-emerald-600" />
                <span>Ambulance &amp; Emergency Directory</span>
                <ChevronRight className="size-3.5 opacity-60" />
              </Link>
            </div>
          </div>

          {/* 2. Interactive Search & Geo-Proximity Filter Bar */}
          <div className="mt-8 mx-auto max-w-5xl rounded-3xl border border-slate-200/90 bg-white p-4 sm:p-5 shadow-xl shadow-slate-200/50 backdrop-blur-xl">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-12">
              {/* Keyword Search */}
              <div className="relative lg:col-span-4">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search hospital name, area, or district..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 py-2.5 pl-10 pr-3 text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-brand-red focus:outline-none transition"
                />
              </div>

              {/* Division Selector */}
              <div className="lg:col-span-3">
                <select
                  value={selectedDivision}
                  onChange={(e) => setSelectedDivision(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 px-3.5 py-2.5 text-xs font-semibold text-slate-800 focus:bg-white focus:border-brand-red focus:outline-none transition"
                >
                  <option value="ALL">All Divisions (সারাদেশ)</option>
                  {BANGLADESH_DIVISIONS.map((div) => (
                    <option key={div} value={div}>
                      {div} Division
                    </option>
                  ))}
                </select>
              </div>

              {/* Specialty Selector */}
              <div className="lg:col-span-3">
                <select
                  value={selectedSpecialty}
                  onChange={(e) => setSelectedSpecialty(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 px-3.5 py-2.5 text-xs font-semibold text-slate-800 focus:bg-white focus:border-brand-red focus:outline-none transition"
                >
                  <option value="ALL">All Specialties (সব বিভাগ)</option>
                  {specialtiesList.map((spec) => (
                    <option key={spec.id} value={spec.id}>
                      {spec.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* GPS Near Me Button */}
              <div className="lg:col-span-2">
                <button
                  type="button"
                  onClick={handleDetectLocation}
                  disabled={isLocating}
                  className={cn(
                    "w-full flex items-center justify-center gap-1.5 rounded-2xl px-3 py-2.5 text-xs font-extrabold transition cursor-pointer shadow-xs",
                    userLocation
                      ? "bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-600/20"
                      : "bg-slate-800 text-white hover:bg-slate-900"
                  )}
                >
                  <LocateFixed className={cn("size-3.5", isLocating && "animate-spin")} />
                  <span>{userLocation ? "Near Me Active" : "Find Near Me"}</span>
                </button>
              </div>
            </div>

            {/* Sub-Filters: 24/7 Emergency Toggle & Active Filters Indicator */}
            <div className="mt-3.5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-3 text-xs">
              <div className="flex flex-wrap items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={emergencyOnly}
                    onChange={(e) => setEmergencyOnly(e.target.checked)}
                    className="size-4 rounded border-slate-300 text-brand-red focus:ring-brand-red accent-brand-red cursor-pointer"
                  />
                  <span className="font-bold text-slate-700 flex items-center gap-1">
                    <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                    24/7 Emergency Available Only
                  </span>
                </label>

                {userLocation && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                    <span>📍 GPS Distance Enabled</span>
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                {(searchTerm || selectedDivision !== "ALL" || selectedSpecialty !== "ALL" || emergencyOnly || userLocation) && (
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="font-bold text-slate-500 hover:text-brand-red transition cursor-pointer"
                  >
                    Reset Filters
                  </button>
                )}

                <span className="font-black text-slate-400">
                  Total: <strong className="text-brand-navy">{hospitals.length}</strong> hospitals found
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Hospital Cards Grid Section */}
      <section className="container mx-auto px-4 sm:px-6 pt-8">
        {isLoading ? (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="h-64 rounded-3xl border border-slate-200 bg-white p-5 animate-pulse"
              >
                <div className="h-5 w-3/4 rounded-lg bg-slate-200 mb-2" />
                <div className="h-4 w-1/2 rounded-lg bg-slate-100 mb-4" />
                <div className="h-16 w-full rounded-2xl bg-slate-50 mb-4" />
                <div className="h-8 w-full rounded-xl bg-slate-100" />
              </div>
            ))}
          </div>
        ) : hospitals.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center max-w-xl mx-auto shadow-xs">
            <Building2 className="mx-auto size-12 text-slate-300" />
            <h3 className="mt-3 text-base font-bold text-brand-navy">No hospitals match your filter</h3>
            <p className="mt-1 text-xs text-slate-500">
              Try clearing the search query, selecting another division, or disabling the 24/7 emergency filter.
            </p>
            <button
              type="button"
              onClick={handleResetFilters}
              className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-brand-navy px-4 py-2 text-xs font-bold text-white hover:bg-slate-800 transition cursor-pointer shadow-xs"
            >
              <RefreshCw className="size-3.5" />
              <span>Reset All Filters</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {hospitals.map((hospital) => {
              const googleMapsUrl =
                hospital.latitude && hospital.longitude
                  ? `https://www.google.com/maps/dir/?api=1&destination=${hospital.latitude},${hospital.longitude}`
                  : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      `${hospital.name}, ${hospital.addressText || hospital.district || "Bangladesh"}`
                    )}`;

              return (
                <div
                  key={hospital.id}
                  className="flex flex-col justify-between rounded-3xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-xs hover:border-red-300 hover:shadow-lg hover:shadow-red-500/5 transition duration-200 group"
                >
                  <div>
                    {/* Top Badges: Ownership & Emergency 24/7 */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span
                          className={cn(
                            "rounded-lg px-2.5 py-0.5 text-[10.5px] font-black uppercase tracking-wider border",
                            hospital.ownership === "Government"
                              ? "bg-blue-50 text-blue-800 border-blue-200"
                              : "bg-purple-50 text-purple-800 border-purple-200"
                          )}
                        >
                          {hospital.ownership || "Hospital"}
                        </span>

                        <span className="rounded-lg bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">
                          {hospital.facilityType || "Medical Center"}
                        </span>
                      </div>

                      {hospital.distanceKm != null && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-[11px] font-black text-emerald-700">
                          📍 {hospital.distanceKm} km
                        </span>
                      )}
                    </div>

                    {/* Hospital Name */}
                    <div className="mt-3.5">
                      <h3 className="text-base font-black text-brand-navy leading-snug group-hover:text-brand-red transition-colors">
                        {hospital.name}
                      </h3>
                      {hospital.nameBn && (
                        <p className="text-xs font-semibold text-slate-500 mt-0.5">
                          {hospital.nameBn}
                        </p>
                      )}
                    </div>

                    {/* Address & District */}
                    <p className="mt-2.5 text-xs text-slate-600 font-medium flex items-start gap-1.5">
                      <MapPin className="size-3.5 text-brand-red shrink-0 mt-0.5" />
                      <span>
                        {hospital.addressText || `${hospital.upazila ? hospital.upazila + ", " : ""}${hospital.district || "Bangladesh"}`}
                      </span>
                    </p>

                    {/* Specialties Badges */}
                    {hospital.specialties && hospital.specialties.length > 0 && (
                      <div className="mt-3.5 flex flex-wrap items-center gap-1.5">
                        {hospital.specialties.map((spec) => (
                          <span
                            key={spec.id}
                            className="rounded-md bg-slate-100 px-2 py-0.5 text-[10.5px] font-bold text-slate-700 border border-slate-200/80"
                          >
                            {spec.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Actions & Click-to-Call Buttons */}
                  <div className="mt-5 border-t border-slate-100 pt-4 space-y-2.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400 font-medium">Emergency Contact:</span>
                      <span className="font-mono font-bold text-brand-navy">{hospital.phone}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <a
                        href={`tel:${hospital.phone}`}
                        className="flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 py-2.5 text-xs font-black text-white shadow-xs shadow-emerald-600/25 hover:bg-emerald-700 transition"
                      >
                        <Phone className="size-3.5" />
                        <span>Call Now</span>
                      </a>

                      <a
                        href={googleMapsUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100 hover:text-brand-navy transition"
                      >
                        <Navigation className="size-3.5 text-brand-red" />
                        <span>Directions</span>
                        <ExternalLink className="size-3 opacity-60" />
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
