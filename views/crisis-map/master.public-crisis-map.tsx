"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import Link from "next/link";
import {
  MapPin,
  Flame,
  Droplets,
  AlertTriangle,
  HeartPulse,
  PhoneCall,
  Navigation,
  ShieldCheck,
  Radio,
  Layers,
  Search,
  CheckCircle2,
  ArrowRight,
  Siren,
  Compass,
  Building2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useGetNationalCrisisTelemetryQuery } from "@/redux/api/incidentApi";
import type { DivisionCrisisStat } from "@/types/incident.types";
import { toast } from "sonner";

// Division coordinates for quick flight
const DIVISION_COORDINATES: Record<string, { lat: number; lng: number; zoom: number }> = {
  All: { lat: 23.685, lng: 90.3563, zoom: 7 },
  Dhaka: { lat: 23.8103, lng: 90.4125, zoom: 11 },
  Chittagong: { lat: 22.3569, lng: 91.7832, zoom: 11 },
  Sylhet: { lat: 24.8949, lng: 91.8687, zoom: 10 },
  Khulna: { lat: 22.8456, lng: 89.5403, zoom: 11 },
  Rajshahi: { lat: 24.3745, lng: 88.6042, zoom: 11 },
  Barisal: { lat: 22.701, lng: 90.3535, zoom: 11 },
  Rangpur: { lat: 25.7439, lng: 89.2752, zoom: 11 },
  Mymensingh: { lat: 24.7471, lng: 90.4203, zoom: 11 },
};

export function MasterPublicCrisisMapComponent() {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const layerGroupsRef = useRef<{
    heatmaps: any;
    incidents: any;
  } | null>(null);

  // Filters & State
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [selectedSeverity, setSelectedSeverity] = useState<string>("ALL");
  const [selectedDivision, setSelectedDivision] = useState<string>("All");
  const [showRiskHeatmaps, setShowRiskHeatmaps] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Citizen GPS Safety Check State
  const [isCheckingGps, setIsCheckingGps] = useState<boolean>(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [safetyStatus, setSafetyStatus] = useState<{
    status: "SAFE" | "WARNING" | "CRITICAL";
    nearestIncident: any | null;
    distanceKm: number | null;
  } | null>(null);

  // Fetch Telemetry Data (5s live polling)
  const { data: telemetryRes, isLoading: isLoadingTelemetry } =
    useGetNationalCrisisTelemetryQuery(undefined, {
      pollingInterval: 30000,
      refetchOnMountOrArgChange: true,
    });

  const telemetry = telemetryRes?.data;
  const rawIncidents = telemetry?.incidents || [];
  const divisionStats = telemetry?.divisionStats || [];

  // Filter verified / active incidents suitable for citizen view
  const activeIncidents = useMemo(() => {
    return rawIncidents.filter(
      (inc) =>
        inc.status === "VERIFIED" ||
        inc.status === "DISPATCHING" ||
        inc.status === "IN_PROGRESS" ||
        inc.status === "REPORTED"
    );
  }, [rawIncidents]);

  // Filtered incidents based on user selections
  const filteredIncidents = useMemo(() => {
    return activeIncidents.filter((inc) => {
      // Category filter
      if (selectedCategory !== "ALL") {
        const catName = (inc.categoryName || "").toLowerCase();
        if (selectedCategory === "FIRE" && !catName.includes("fire")) return false;
        if (selectedCategory === "FLOOD" && !catName.includes("flood") && !catName.includes("water") && !catName.includes("cyclone")) return false;
        if (selectedCategory === "ACCIDENT" && !catName.includes("accident") && !catName.includes("traffic") && !catName.includes("crash")) return false;
        if (selectedCategory === "MEDICAL" && !catName.includes("medical") && !catName.includes("blood") && !catName.includes("health")) return false;
      }

      // Severity filter
      if (selectedSeverity !== "ALL" && inc.severity !== selectedSeverity) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = (inc.title || "").toLowerCase().includes(q);
        const matchesDistrict = (inc.district || "").toLowerCase().includes(q);
        const matchesArea = (inc.areaName || "").toLowerCase().includes(q);
        const matchesCat = (inc.categoryName || "").toLowerCase().includes(q);
        if (!matchesTitle && !matchesDistrict && !matchesArea && !matchesCat) return false;
      }

      return true;
    });
  }, [activeIncidents, selectedCategory, selectedSeverity, searchQuery]);

  // KPIs
  const criticalCount = activeIncidents.filter((i) => i.severity === "CRITICAL").length;
  const highCount = activeIncidents.filter((i) => i.severity === "HIGH").length;
  const totalActive = activeIncidents.length;

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    let isMounted = true;

    async function initLeaflet() {
      if (typeof window === "undefined") return;

      const L = (await import("leaflet")).default;
      if (!isMounted || !mapContainerRef.current || mapRef.current) return;

      // Fix default Leaflet icon paths
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      const map = L.map(mapContainerRef.current, {
        zoomControl: false,
        attributionControl: false,
      }).setView([23.685, 90.3563], 7);

      L.control.zoom({ position: "bottomright" }).addTo(map);

      // Standard OpenStreetMap tiles (Free & No API Key required)
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
      }).addTo(map);

      // Initialize Layer Groups
      const heatmapsGroup = L.layerGroup().addTo(map);
      const incidentsGroup = L.layerGroup().addTo(map);

      layerGroupsRef.current = {
        heatmaps: heatmapsGroup,
        incidents: incidentsGroup,
      };

      mapRef.current = map;
    }

    initLeaflet();

    return () => {
      isMounted = false;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        layerGroupsRef.current = null;
      }
    };
  }, []);

  // Sync Markers & Heatmap Layers
  useEffect(() => {
    if (!mapRef.current || !layerGroupsRef.current) return;

    let isMounted = true;

    async function renderLayers() {
      const L = (await import("leaflet")).default;
      if (!isMounted || !layerGroupsRef.current) return;

      const { heatmaps, incidents } = layerGroupsRef.current;
      heatmaps.clearLayers();
      incidents.clearLayers();

      // Render Red-Zone Risk Heatmap Circles
      if (showRiskHeatmaps) {
        filteredIncidents.forEach((inc) => {
          if (!inc.latitude || !inc.longitude) return;

          const isCritical = inc.severity === "CRITICAL";
          const isHigh = inc.severity === "HIGH";

          const radius = isCritical ? 6000 : isHigh ? 4000 : 2500;
          const color = isCritical ? "#dc2626" : isHigh ? "#ea580c" : "#2563eb";
          const fillColor = isCritical ? "#ef4444" : isHigh ? "#f97316" : "#3b82f6";

          const circle = L.circle([inc.latitude, inc.longitude], {
            radius,
            color,
            fillColor,
            fillOpacity: isCritical ? 0.22 : 0.15,
            weight: 1.5,
            dashArray: isCritical ? "4, 6" : undefined,
          });

          circle.bindPopup(
            `<div style="font-family: inherit; padding: 4px;">
              <span style="font-size: 11px; font-weight: 800; color: ${color}; text-transform: uppercase;">⚠️ ${inc.severity} RISK ZONE</span>
              <p style="font-size: 12px; font-weight: 700; margin: 2px 0 0 0; color: #1e293b;">${inc.title}</p>
              <p style="font-size: 11px; color: #64748b; margin: 2px 0 0 0;">Hazard Radius: ~${(radius / 1000).toFixed(1)} km</p>
            </div>`
          );

          circle.addTo(heatmaps);
        });
      }

      // Render Disaster Markers
      filteredIncidents.forEach((inc) => {
        if (!inc.latitude || !inc.longitude) return;

        const isCritical = inc.severity === "CRITICAL";
        const isHigh = inc.severity === "HIGH";

        const markerColor = isCritical
          ? "#dc2626"
          : isHigh
          ? "#ea580c"
          : "#2563eb";

        const iconHtml = `
          <div style="
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 32px;
            height: 32px;
            background: ${markerColor};
            border: 2.5px solid white;
            border-radius: 50%;
            box-shadow: 0 4px 14px rgba(0,0,0,0.3);
            color: white;
            font-size: 14px;
            cursor: pointer;
            transition: transform 0.2s ease;
          ">
            ${
              isCritical
                ? '<div style="position: absolute; inset: -4px; border-radius: 50%; background: #dc2626; opacity: 0.4; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>'
                : ""
            }
            <span style="position: relative; z-index: 2;">${
              inc.categoryName?.toLowerCase().includes("fire")
                ? "🔥"
                : inc.categoryName?.toLowerCase().includes("flood")
                ? "🌊"
                : inc.categoryName?.toLowerCase().includes("accident")
                ? "🚗"
                : inc.categoryName?.toLowerCase().includes("medical")
                ? "🏥"
                : "⚠️"
            }</span>
          </div>
        `;

        const customIcon = L.divIcon({
          html: iconHtml,
          className: "custom-incident-pin",
          iconSize: [32, 32],
          iconAnchor: [16, 16],
          popupAnchor: [0, -18],
        });

        const marker = L.marker([inc.latitude, inc.longitude], {
          icon: customIcon,
        });

        const popupContent = `
          <div style="font-family: inherit; min-width: 220px; max-width: 280px; padding: 4px;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
              <span style="
                background: ${isCritical ? "#fee2e2" : "#e0e7ff"};
                color: ${isCritical ? "#dc2626" : "#4338ca"};
                font-size: 10px;
                font-weight: 800;
                padding: 2px 6px;
                border-radius: 6px;
                text-transform: uppercase;
              ">
                ${inc.severity} THREAT
              </span>
              <span style="font-size: 10px; font-weight: 700; color: #10b981;">
                ● LIVE VERIFIED
              </span>
            </div>

            ${
              inc.imageUrls && inc.imageUrls.length > 0
                ? `<img src="${inc.imageUrls[0]}" style="width: 100%; height: 95px; object-fit: cover; border-radius: 8px; margin-bottom: 6px; border: 1px solid #e2e8f0;" alt="Damage evidence" />`
                : ""
            }

            <h4 style="font-size: 13px; font-weight: 800; color: #0f172a; margin: 0 0 4px 0; line-height: 1.3;">
              ${inc.title}
            </h4>

            <p style="font-size: 11px; color: #64748b; margin: 0 0 8px 0; line-height: 1.4;">
              📍 ${inc.addressText || inc.areaName || inc.district || "Bangladesh"}
            </p>

            <div style="display: flex; gap: 6px;">
              <a href="/incidents/${inc.id}" style="
                flex: 1;
                display: block;
                text-align: center;
                background: #dc2626;
                color: white;
                font-size: 11px;
                font-weight: 700;
                padding: 6px 10px;
                border-radius: 8px;
                text-decoration: none;
              ">
                View Details →
              </a>
              <a href="tel:999" style="
                display: flex;
                align-items: center;
                justify-content: center;
                background: #0f172a;
                color: white;
                font-size: 11px;
                font-weight: 700;
                padding: 6px 10px;
                border-radius: 8px;
                text-decoration: none;
              ">
                📞 999
              </a>
            </div>
          </div>
        `;

        marker.bindPopup(popupContent);
        marker.addTo(incidents);
      });
    }

    renderLayers();

    return () => {
      isMounted = false;
    };
  }, [filteredIncidents, showRiskHeatmaps]);

  // Handle Division Selection & Map Pan
  const handleDivisionChange = (divisionName: string) => {
    setSelectedDivision(divisionName);
    const target = DIVISION_COORDINATES[divisionName];
    if (target && mapRef.current) {
      mapRef.current.flyTo([target.lat, target.lng], target.zoom, {
        duration: 1.2,
      });
    }
  };

  // Distance helper in KM (Haversine formula)
  function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371; // Radius of the Earth in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  // Citizen Live GPS Safety Check Function
  const handleCheckSafetyWithGps = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser.");
      return;
    }

    setIsCheckingGps(true);
    toast.info("Detecting your live coordinates & scanning danger zones...");

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const userLat = pos.coords.latitude;
        const userLng = pos.coords.longitude;
        setUserLocation({ lat: userLat, lng: userLng });

        // Calculate distance to all active incidents
        let minDistance = Infinity;
        let nearest: any = null;

        activeIncidents.forEach((inc) => {
          if (!inc.latitude || !inc.longitude) return;
          const dist = calculateDistanceKm(userLat, userLng, inc.latitude, inc.longitude);
          if (dist < minDistance) {
            minDistance = dist;
            nearest = inc;
          }
        });

        setIsCheckingGps(false);

        if (nearest && minDistance < 5) {
          setSafetyStatus({
            status: nearest.severity === "CRITICAL" ? "CRITICAL" : "WARNING",
            nearestIncident: nearest,
            distanceKm: Number(minDistance.toFixed(1)),
          });
          toast.warning(`Alert: Active disaster detected ${minDistance.toFixed(1)} km from you!`);
        } else {
          setSafetyStatus({
            status: "SAFE",
            nearestIncident: nearest,
            distanceKm: nearest ? Number(minDistance.toFixed(1)) : null,
          });
          toast.success("Good news: You are in a verified safe zone.");
        }

        // Fly map to user
        if (mapRef.current) {
          mapRef.current.flyTo([userLat, userLng], 13, { duration: 1.5 });
        }
      },
      () => {
        setIsCheckingGps(false);
        toast.error("Unable to access GPS location. Please allow location permissions.");
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  return (
    <div className="space-y-6 pb-12">
      {/* ====================================================================
          1. CITIZEN CRISIS MAP HERO BANNER (Glassmorphic)
          ==================================================================== */}
      <div className="relative overflow-hidden rounded-3xl border border-red-500/20 bg-linear-to-r from-brand-navy via-slate-900 to-brand-navy p-6 sm:p-8 text-white shadow-xl">
        <div className="pointer-events-none absolute -right-20 -top-20 size-72 rounded-full bg-red-600/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 left-10 size-60 rounded-full bg-blue-600/20 blur-3xl" />

        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-red px-3 py-1 text-xs font-black text-white shadow-xs">
                <Radio className="size-3 animate-pulse" /> LIVE TELEMETRY
              </span>
              <span className="text-xs font-mono font-bold text-red-200">
                Nationwide Public Safety Stream
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
              National Crisis Heatmap &amp; Public Safety Radar
            </h1>
            <p className="max-w-2xl text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
              Real-time verified disaster alerts across Bangladesh. Check danger zones, find safe evacuation areas, and alert verified nearby emergency response teams.
            </p>
          </div>

          {/* Quick Hotline Actions */}
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/incidents/create"
              className="flex items-center gap-2 rounded-2xl bg-linear-to-r from-red-600 to-brand-red px-5 py-3 text-xs sm:text-sm font-black text-white shadow-lg shadow-red-900/30 hover:scale-[1.02] active:scale-[0.98] transition cursor-pointer"
            >
              <Siren className="size-4 animate-pulse" />
              <span>🚨 Report Emergency</span>
            </Link>

            <a
              href="tel:999"
              className="flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-xs sm:text-sm font-bold text-white backdrop-blur-md hover:bg-white/20 transition cursor-pointer"
            >
              <PhoneCall className="size-4 text-emerald-400" />
              <span>Call 999 Hotline</span>
            </a>

            <a
              href="tel:1090"
              className="flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-xs sm:text-sm font-bold text-white backdrop-blur-md hover:bg-white/20 transition cursor-pointer"
            >
              <Droplets className="size-4 text-blue-400" />
              <span>Flood 1090</span>
            </a>
          </div>
        </div>
      </div>

      {/* ====================================================================
          2. CITIZEN "AM I IN A DANGER ZONE?" GPS SCANNER CARD
          ==================================================================== */}
      <div className="rounded-3xl border border-slate-200/90 bg-white/95 p-5 sm:p-6 backdrop-blur-xl shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="grid size-11 place-items-center rounded-2xl bg-blue-50 text-blue-600 border border-blue-200 shadow-2xs">
              <Compass className="size-5.5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black text-brand-navy">
                Live Zone Safety Scanner (আমার এলাকা কতটা নিরাপদ?)
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Scan your current location to check if any active disaster or red-zone is within your radius.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleCheckSafetyWithGps}
            disabled={isCheckingGps}
            className="flex items-center justify-center gap-2 rounded-2xl bg-brand-navy px-5 py-3 text-xs sm:text-sm font-bold text-white shadow-md hover:bg-slate-800 transition cursor-pointer disabled:opacity-60 shrink-0"
          >
            {isCheckingGps ? (
              <>
                <div className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                <span>Scanning GPS Radius...</span>
              </>
            ) : (
              <>
                <Navigation className="size-4 text-emerald-400" />
                <span>⚡ Scan My Live Location Safety</span>
              </>
            )}
          </button>
        </div>

        {/* Safety Status Banner Result */}
        {safetyStatus && (
          <div
            className={cn(
              "rounded-2xl p-4 border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all",
              safetyStatus.status === "SAFE"
                ? "bg-emerald-50/90 border-emerald-300 text-emerald-950"
                : "bg-red-50/90 border-red-300 text-red-950"
            )}
          >
            <div className="flex items-center gap-3">
              {safetyStatus.status === "SAFE" ? (
                <div className="grid size-10 place-items-center rounded-xl bg-emerald-600 text-white font-black shrink-0">
                  <CheckCircle2 className="size-6" />
                </div>
              ) : (
                <div className="grid size-10 place-items-center rounded-xl bg-red-600 text-white font-black shrink-0 animate-pulse">
                  <AlertTriangle className="size-6" />
                </div>
              )}
              <div>
                <h4 className="text-xs sm:text-sm font-black">
                  {safetyStatus.status === "SAFE"
                    ? "✅ Verified Safe Zone — No Immediate Hazard Detected"
                    : `⚠️ Danger Warning — Active Emergency ${safetyStatus.distanceKm} km From You!`}
                </h4>
                <p className="text-xs opacity-80 mt-0.5">
                  {safetyStatus.status === "SAFE"
                    ? safetyStatus.distanceKm
                      ? `Nearest active disaster is ${safetyStatus.distanceKm} km away (${safetyStatus.nearestIncident?.title || "Routine"}). Your immediate surroundings are clear.`
                      : "No active critical emergencies detected in your immediate surroundings."
                    : `Emergency: "${safetyStatus.nearestIncident?.title}" in ${safetyStatus.nearestIncident?.addressText || safetyStatus.nearestIncident?.district}. Avoid this perimeter.`}
                </p>
              </div>
            </div>

            {safetyStatus.nearestIncident && (
              <Link
                href={`/incidents/${safetyStatus.nearestIncident.id}`}
                className="inline-flex items-center gap-1.5 rounded-xl bg-white px-3.5 py-2 text-xs font-bold text-brand-navy shadow-xs hover:bg-slate-50 transition shrink-0"
              >
                <span>View Alert Info</span>
                <ArrowRight className="size-3.5" />
              </Link>
            )}
          </div>
        )}
      </div>

      {/* ====================================================================
          3. KEY TELEMETRY METRICS CARDS (4 KPIs)
          ==================================================================== */}
      <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-4">
        <div className="rounded-2xl border border-slate-200/90 bg-white/95 p-4 backdrop-blur-xl shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Active Emergencies</span>
            <span className="grid size-7 place-items-center rounded-lg bg-red-50 text-brand-red">
              <Radio className="size-3.5 animate-pulse" />
            </span>
          </div>
          <div className="mt-2 text-2xl font-black text-brand-navy">
            {isLoadingTelemetry ? "..." : totalActive}
          </div>
          <p className="mt-0.5 text-[11px] text-slate-400 font-medium">Verified by responders</p>
        </div>

        <div className="rounded-2xl border border-slate-200/90 bg-white/95 p-4 backdrop-blur-xl shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Critical Red Zones</span>
            <span className="grid size-7 place-items-center rounded-lg bg-red-50 text-brand-red">
              <Flame className="size-3.5 text-brand-red" />
            </span>
          </div>
          <div className="mt-2 text-2xl font-black text-brand-red">
            {isLoadingTelemetry ? "..." : criticalCount}
          </div>
          <p className="mt-0.5 text-[11px] text-slate-400 font-medium">Life-threatening threat</p>
        </div>

        <div className="rounded-2xl border border-slate-200/90 bg-white/95 p-4 backdrop-blur-xl shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">High Alert Areas</span>
            <span className="grid size-7 place-items-center rounded-lg bg-amber-50 text-amber-600">
              <AlertTriangle className="size-3.5" />
            </span>
          </div>
          <div className="mt-2 text-2xl font-black text-amber-600">
            {isLoadingTelemetry ? "..." : highCount}
          </div>
          <p className="mt-0.5 text-[11px] text-slate-400 font-medium">Urgent assistance deployed</p>
        </div>

        <div className="rounded-2xl border border-slate-200/90 bg-white/95 p-4 backdrop-blur-xl shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">National Response</span>
            <span className="grid size-7 place-items-center rounded-lg bg-emerald-50 text-emerald-600">
              <ShieldCheck className="size-3.5" />
            </span>
          </div>
          <div className="mt-2 text-2xl font-black text-emerald-600">100%</div>
          <p className="mt-0.5 text-[11px] text-slate-400 font-medium">Live 24/7 Coverage</p>
        </div>
      </div>

      {/* ====================================================================
          4. MAIN INTERACTIVE LEAFLET CRISIS MAP & FILTERS
          ==================================================================== */}
      <div className="rounded-3xl border border-slate-200/90 bg-white/95 p-5 sm:p-6 backdrop-blur-xl shadow-[0_10px_30px_rgba(16,35,63,0.04)] space-y-4">
        {/* Map Controls Header */}
        <div className="flex flex-col gap-3.5 lg:flex-row lg:items-center lg:justify-between pb-3 border-b border-slate-100">
          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-bold text-slate-400 mr-1">Filter:</span>
            {[
              { id: "ALL", label: "All Disasters", icon: Layers },
              { id: "FIRE", label: "Fire 🔥", icon: Flame },
              { id: "FLOOD", label: "Flood 🌊", icon: Droplets },
              { id: "ACCIDENT", label: "Accidents 🚗", icon: AlertTriangle },
              { id: "MEDICAL", label: "Medical 🏥", icon: HeartPulse },
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={cn(
                  "flex items-center gap-1 rounded-xl px-3 py-1.5 text-xs font-bold transition cursor-pointer",
                  selectedCategory === cat.id
                    ? "bg-brand-red text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                )}
              >
                <span>{cat.label}</span>
              </button>
            ))}
          </div>

          {/* Search and Heatmap Toggle */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 size-3.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search area, district, disaster..."
                className="w-48 sm:w-60 rounded-xl border border-slate-200 bg-slate-50 py-1.5 pl-8 pr-3 text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/10"
              />
            </div>

            <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={showRiskHeatmaps}
                onChange={(e) => setShowRiskHeatmaps(e.target.checked)}
                className="rounded text-brand-red focus:ring-red-500/20"
              />
              <span>Show Red-Zone Heatmap Circles</span>
            </label>
          </div>
        </div>

        {/* Division Quick Fly-to Bar */}
        <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
          <span className="text-[11px] font-bold text-slate-400">Division Focus:</span>
          {Object.keys(DIVISION_COORDINATES).map((divName) => (
            <button
              key={divName}
              type="button"
              onClick={() => handleDivisionChange(divName)}
              className={cn(
                "rounded-lg px-2.5 py-1 text-[11px] font-bold transition cursor-pointer border",
                selectedDivision === divName
                  ? "border-red-300 bg-red-50 text-brand-red"
                  : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              )}
            >
              {divName}
            </button>
          ))}
        </div>

        {/* Leaflet Map Canvas */}
        <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-inner">
          <div ref={mapContainerRef} className="h-[520px] w-full z-10" />

          {/* Map Floating Legend */}
          <div className="absolute bottom-3 left-3 z-20 rounded-2xl bg-white/95 p-3 text-xs font-semibold text-slate-700 backdrop-blur-md border border-slate-200/90 shadow-md space-y-1.5">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">
              Live Map Legend
            </span>
            <div className="flex items-center gap-2 text-[11px]">
              <span className="size-3 rounded-full bg-red-600 inline-block ring-2 ring-red-200" />
              <span>Critical Threat / Red Zone</span>
            </div>
            <div className="flex items-center gap-2 text-[11px]">
              <span className="size-3 rounded-full bg-orange-500 inline-block" />
              <span>High Alert Threat</span>
            </div>
            <div className="flex items-center gap-2 text-[11px]">
              <span className="size-3 rounded-full bg-blue-600 inline-block" />
              <span>Medium / Moderate</span>
            </div>
          </div>
        </div>
      </div>

      {/* ====================================================================
          5. DIVISION CRISIS LEADERBOARD & CITIZEN SAFETY GUIDELINES
          ==================================================================== */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">
        {/* Division Leaderboard (7 Cols) */}
        <div className="rounded-3xl border border-slate-200/90 bg-white/95 p-6 backdrop-blur-xl shadow-xs space-y-4 lg:col-span-7">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="grid size-9 place-items-center rounded-xl bg-red-50 text-brand-red border border-red-200 shadow-2xs">
                <Building2 className="size-4.5" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-black text-brand-navy">
                  Division-wise Disaster &amp; Safety Status
                </h3>
                <p className="text-[11px] text-slate-500 font-medium">
                  Active incidents and risk assessment across all 8 divisions
                </p>
              </div>
            </div>
          </div>

          <div className="divide-y divide-slate-100 overflow-hidden">
            {divisionStats.length > 0 ? (
              divisionStats.map((d: DivisionCrisisStat) => {
                const isRed = d.alertLevel === "HIGH_ALERT" || d.criticalCount > 0;
                return (
                  <div
                    key={d.division}
                    onClick={() => handleDivisionChange(d.division)}
                    className="flex items-center justify-between py-3 px-2 hover:bg-slate-50 rounded-xl transition cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={cn(
                          "size-2.5 rounded-full shrink-0",
                          isRed ? "bg-red-600 animate-pulse" : d.totalIncidents > 0 ? "bg-amber-500" : "bg-emerald-500"
                        )}
                      />
                      <div>
                        <h4 className="text-xs sm:text-sm font-bold text-brand-navy">
                          {d.division} Division
                        </h4>
                        <p className="text-[11px] text-slate-500">
                          {d.totalIncidents} active disasters · {d.criticalCount} critical
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          "rounded-lg px-2.5 py-1 text-[10px] font-black uppercase",
                          isRed
                            ? "bg-red-100 text-brand-red"
                            : d.totalIncidents > 0
                            ? "bg-amber-100 text-amber-800"
                            : "bg-emerald-100 text-emerald-800"
                        )}
                      >
                        {d.alertLevel || (isRed ? "HIGH_ALERT" : "NORMAL")}
                      </span>
                      <span className="text-xs text-slate-400 font-bold">→</span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="py-6 text-center text-xs text-slate-500">
                Loading division crisis status...
              </div>
            )}
          </div>
        </div>

        {/* Citizen Safety & Emergency Advice (5 Cols) */}
        <div className="rounded-3xl border border-slate-200/90 bg-linear-to-b from-slate-50/90 to-white p-6 backdrop-blur-xl shadow-xs space-y-4 lg:col-span-5">
          <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-brand-navy">
            <ShieldCheck className="size-4.5 text-emerald-600" />
            <span>Public Safety &amp; Emergency Protocol</span>
          </div>

          <div className="space-y-3">
            <div className="rounded-2xl border border-red-200 bg-red-50/50 p-3.5 text-xs text-slate-700 space-y-1">
              <span className="font-extrabold text-brand-red flex items-center gap-1.5">
                <Flame className="size-3.5" /> Fire Outbreak Advisory
              </span>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Stay low beneath smoke, cover mouth with wet cloth, use staircases instead of elevators, and call 999 immediately.
              </p>
            </div>

            <div className="rounded-2xl border border-blue-200 bg-blue-50/50 p-3.5 text-xs text-slate-700 space-y-1">
              <span className="font-extrabold text-blue-700 flex items-center gap-1.5">
                <Droplets className="size-3.5" /> Flood &amp; Waterlogging Advisory
              </span>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Move to elevated shelters, avoid downed electrical wires in water, disconnect main power, and keep dry food rations.
              </p>
            </div>

            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-3.5 text-xs text-slate-700 space-y-1">
              <span className="font-extrabold text-emerald-800 flex items-center gap-1.5">
                <HeartPulse className="size-3.5" /> First-Aid &amp; Responder Volunteers
              </span>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                If someone is injured, report the incident immediately on Manob Prohori to trigger nearby 5km volunteer dispatch.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
