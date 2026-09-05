"use client";

import { useEffect, useRef, useState } from "react";
import { useFormContext } from "react-hook-form";
import {
  MapPin,
  Navigation,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Crosshair,
  Map as MapIcon,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { IncidentFormValues } from "@/lib/validations/incident.schema";
import { cn } from "@/lib/utils";

interface LocationPickerProps {
  isLocating: boolean;
  onCaptureLocation: () => void;
}

const DISTRICT_PRESETS = [
  { name: "Dhaka", lat: 23.8103, lng: 90.4125 },
  { name: "Chittagong", lat: 22.3569, lng: 91.7832 },
  { name: "Sylhet", lat: 24.8949, lng: 91.8687 },
  { name: "Khulna", lat: 22.8456, lng: 89.5403 },
  { name: "Rajshahi", lat: 24.3745, lng: 88.6042 },
];

export function LocationPicker({
  isLocating,
  onCaptureLocation,
}: LocationPickerProps) {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<IncidentFormValues>();

  const lat = watch("latitude");
  const lng = watch("longitude");
  const accuracy = watch("locationAccuracyMeters");
  const hasCoordinates = typeof lat === "number" && typeof lng === "number" && !isNaN(lat) && lat !== 0;

  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);

  // 1. Initialize Interactive Leaflet Map for Pinpointing Incident
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    let isMounted = true;

    async function initMiniMap() {
      if (typeof window === "undefined") return;

      const L = (await import("leaflet")).default;
      if (!isMounted || !mapContainerRef.current || mapRef.current) return;

      const initialLat = hasCoordinates ? lat : 23.8103;
      const initialLng = hasCoordinates ? lng : 90.4125;
      const initialZoom = hasCoordinates ? 14 : 11;

      const map = L.map(mapContainerRef.current, {
        zoomControl: false,
        attributionControl: false,
      }).setView([initialLat, initialLng], initialZoom);

      L.control.zoom({ position: "bottomright" }).addTo(map);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
      }).addTo(map);

      // Create Draggable Pin Marker
      const marker = L.circleMarker([initialLat, initialLng], {
        radius: 10,
        fillColor: "#dc2626",
        color: "#ffffff",
        weight: 3,
        opacity: 1,
        fillOpacity: 0.95,
      }).addTo(map);

      marker.bindPopup("📍 <strong>Incident Location</strong><br/><span style='font-size: 11px;'>Drag or click anywhere on the map to pinpoint.</span>").openPopup();

      markerRef.current = marker;

      // Handle Map Click to set coordinates
      map.on("click", (e: any) => {
        const clickedLat = Number(e.latlng.lat.toFixed(6));
        const clickedLng = Number(e.latlng.lng.toFixed(6));

        setValue("latitude", clickedLat, { shouldValidate: true });
        setValue("longitude", clickedLng, { shouldValidate: true });
        setValue("locationAccuracyMeters", 10);

        marker.setLatLng([clickedLat, clickedLng]);
        marker.bindPopup(`📍 <strong>Selected Incident Location</strong><br/><span style='font-size: 11px;'>${clickedLat}° N, ${clickedLng}° E</span>`).openPopup();
      });

      mapRef.current = map;
    }

    initMiniMap();

    return () => {
      isMounted = false;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        markerRef.current = null;
      }
    };
  }, []);

  // 2. Sync Map View & Marker when Coordinates Change (e.g. after GPS capture)
  useEffect(() => {
    if (hasCoordinates && mapRef.current && markerRef.current) {
      markerRef.current.setLatLng([lat, lng]);
      mapRef.current.setView([lat, lng], 14, { animate: true });
      markerRef.current.bindPopup(`📍 <strong>Incident Location</strong><br/><span style='font-size: 11px;'>${lat.toFixed(5)}° N, ${lng.toFixed(5)}° E</span>`).openPopup();
    }
  }, [lat, lng, hasCoordinates]);

  // Quick Preset Jump
  const handleJumpPreset = (pLat: number, pLng: number, pName: string) => {
    setValue("latitude", pLat, { shouldValidate: true });
    setValue("longitude", pLng, { shouldValidate: true });
    setValue("district", pName);
    if (mapRef.current && markerRef.current) {
      markerRef.current.setLatLng([pLat, pLng]);
      mapRef.current.setView([pLat, pLng], 12, { animate: true });
    }
  };

  return (
    <div className="space-y-4">
      {/* Header & GPS Capture Button */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="text-xs font-bold text-brand-navy">Interactive Pinpoint Map</span>
          <p className="text-[11px] text-slate-500 font-medium">
            Click on map or auto-detect with GPS
          </p>
        </div>

        <Button
          type="button"
          onClick={onCaptureLocation}
          disabled={isLocating}
          variant="outline"
          className="rounded-xl border-red-200 bg-red-50/80 px-3.5 py-1.5 text-xs font-bold text-brand-red shadow-2xs hover:bg-red-100 hover:text-brand-red cursor-pointer transition"
        >
          {isLocating ? (
            <span className="flex items-center gap-1.5">
              <Loader2 className="size-3.5 animate-spin" />
              Detecting GPS...
            </span>
          ) : (
            <span className="flex items-center gap-1.5">
              <Navigation className="size-3.5" />
              Auto-Detect GPS
            </span>
          )}
        </Button>
      </div>

      {/* Quick City Jumps */}
      <div className="flex flex-wrap items-center gap-1.5 text-xs font-bold">
        <span className="text-[11px] text-slate-400 font-medium">Quick Jump:</span>
        {DISTRICT_PRESETS.map((d) => (
          <button
            key={d.name}
            type="button"
            onClick={() => handleJumpPreset(d.lat, d.lng, d.name)}
            className="rounded-lg border border-slate-200/90 bg-slate-50/80 px-2.5 py-1 text-[11px] font-bold text-slate-700 hover:border-red-300 hover:bg-red-50 hover:text-brand-red transition cursor-pointer"
          >
            {d.name}
          </button>
        ))}
      </div>

      {/* Interactive Leaflet Pinpoint Map */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-200/90 bg-slate-100 shadow-2xs">
        <div
          ref={mapContainerRef}
          className="h-60 w-full z-10"
        />
        <div className="absolute bottom-2 left-2 z-20 rounded-lg bg-white/95 px-2.5 py-1 text-[10px] font-bold text-slate-700 backdrop-blur-md border border-slate-200/80 shadow-xs">
          💡 Click anywhere on map to reposition pin
        </div>
      </div>

      {/* GPS Coordinate Status Box */}
      {hasCoordinates ? (
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-emerald-300/80 bg-emerald-50/80 px-3.5 py-2.5 text-xs font-semibold text-emerald-900">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
            <span>
              Coordinates: <strong>{lat.toFixed(5)}° N</strong>, <strong>{lng.toFixed(5)}° E</strong>
            </span>
          </div>
          {accuracy && (
            <span className="rounded-md bg-white px-2 py-0.5 text-[10px] text-emerald-700 border border-emerald-200 font-mono">
              ~{Math.round(accuracy)}m radius
            </span>
          )}
        </div>
      ) : (
        <div className="flex items-center gap-2 rounded-xl border border-amber-300/80 bg-amber-50/80 px-3.5 py-2.5 text-xs font-medium text-amber-900">
          <AlertCircle className="size-4 text-amber-600 shrink-0" />
          <span>Click on map or press &quot;Auto-Detect GPS&quot; to set incident coordinates.</span>
        </div>
      )}

      {(errors.latitude || errors.longitude) && (
        <p className="text-[11px] font-medium text-brand-red">
          {errors.latitude?.message || "Location coordinates are required."}
        </p>
      )}

      {/* Address and Area Details */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 pt-1">
        <div>
          <label className="mb-1.5 block text-xs font-bold text-brand-navy">
            Address / Landmark
          </label>
          <input
            type="text"
            placeholder="e.g. House 12, Road 4, Block D"
            {...register("addressText")}
            className="w-full rounded-2xl border border-slate-200/90 bg-slate-50/70 py-2.5 px-3.5 text-xs sm:text-sm font-semibold text-slate-800 placeholder:text-slate-400 transition focus:bg-white focus:outline-none focus:ring-3 focus:border-brand-red focus:ring-red-500/10"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-bold text-brand-navy">
            Area / Neighbourhood
          </label>
          <input
            type="text"
            placeholder="e.g. Mirpur 10"
            {...register("areaName")}
            className="w-full rounded-2xl border border-slate-200/90 bg-slate-50/70 py-2.5 px-3.5 text-xs sm:text-sm font-semibold text-slate-800 placeholder:text-slate-400 transition focus:bg-white focus:outline-none focus:ring-3 focus:border-brand-red focus:ring-red-500/10"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-bold text-brand-navy">
            District
          </label>
          <input
            type="text"
            placeholder="e.g. Dhaka"
            {...register("district")}
            className="w-full rounded-2xl border border-slate-200/90 bg-slate-50/70 py-2.5 px-3.5 text-xs sm:text-sm font-semibold text-slate-800 placeholder:text-slate-400 transition focus:bg-white focus:outline-none focus:ring-3 focus:border-brand-red focus:ring-red-500/10"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-bold text-brand-navy">
            Upazila / Thana
          </label>
          <input
            type="text"
            placeholder="e.g. Mirpur Thana"
            {...register("upazila")}
            className="w-full rounded-2xl border border-slate-200/90 bg-slate-50/70 py-2.5 px-3.5 text-xs sm:text-sm font-semibold text-slate-800 placeholder:text-slate-400 transition focus:bg-white focus:outline-none focus:ring-3 focus:border-brand-red focus:ring-red-500/10"
          />
        </div>
      </div>
    </div>
  );
}

