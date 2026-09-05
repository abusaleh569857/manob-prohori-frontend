"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import Link from "next/link";
import {
  Navigation,
  Radio,
  Layers,
  ShieldAlert,
  Users,
  AlertTriangle,
  Flame,
  HeartPulse,
  Droplets,
  Building2,
  MapPin,
  Clock,
  Phone,
  Filter,
  CheckCircle2,
  XCircle,
  Eye,
  Send,
  Loader2,
  RefreshCw,
  Sparkles,
  Shield,
  Activity,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  useGetNationalCrisisTelemetryQuery,
  useSeedNationwideCrisisDataMutation,
  useUpdateIncidentStatusMutation,
} from "@/redux/api/incidentApi";
import { IncidentTriageModal } from "@/views/admin/incidents/components/incident-triage-modal";
import type { Incident, DivisionCrisisStat } from "@/types/incident.types";

// Division coordinates for quick flight
const DIVISION_COORDINATES: Record<string, { lat: number; lng: number; zoom: number }> = {
  All: { lat: 23.6850, lng: 90.3563, zoom: 7 },
  Dhaka: { lat: 23.8103, lng: 90.4125, zoom: 11 },
  Chittagong: { lat: 22.3569, lng: 91.7832, zoom: 11 },
  Sylhet: { lat: 24.8949, lng: 91.8687, zoom: 10 },
  Khulna: { lat: 22.8456, lng: 89.5403, zoom: 11 },
  Rajshahi: { lat: 24.3745, lng: 88.6042, zoom: 11 },
  Barisal: { lat: 22.7010, lng: 90.3535, zoom: 11 },
  Rangpur: { lat: 25.7439, lng: 89.2752, zoom: 11 },
  Mymensingh: { lat: 24.7471, lng: 90.4203, zoom: 11 },
};

export function AdminLiveIncidentMap() {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const layerGroupsRef = useRef<{
    heatmaps: any;
    incidents: any;
    volunteers: any;
  } | null>(null);

  // Tactical Filters & Layer Toggles
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [selectedSeverity, setSelectedSeverity] = useState<string>("ALL");
  const [showHeatmapLayer, setShowHeatmapLayer] = useState<boolean>(true);
  const [showIncidentsLayer, setShowIncidentsLayer] = useState<boolean>(true);
  const [showVolunteersLayer, setShowVolunteersLayer] = useState<boolean>(true);
  const [selectedDivision, setSelectedDivision] = useState<string>("All");

  // Modal State for 1-Click Triage & Dispatch from Map
  const [selectedModalIncident, setSelectedModalIncident] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalInitialTab, setModalInitialTab] = useState<"DETAILS" | "RADAR" | "RESPONDERS">("RADAR");

  // RTK Query with 5s polling for Live Telemetry
  const {
    data: telemetryRes,
    isLoading: isLoadingTelemetry,
    isFetching,
    refetch,
  } = useGetNationalCrisisTelemetryQuery(undefined, {
    pollingInterval: 30000,
    refetchOnMountOrArgChange: true,
  });

  const [seedCrisisMutation, { isLoading: isSeeding }] = useSeedNationwideCrisisDataMutation();
  const [updateStatusMutation] = useUpdateIncidentStatusMutation();

  const telemetry = telemetryRes?.data;
  const incidents = telemetry?.incidents || [];
  const volunteers = telemetry?.volunteers || [];
  const divisionStats = telemetry?.divisionStats || [];

  // Filtered Incidents based on active UI controls
  const filteredIncidents = useMemo(() => {
    return incidents.filter((inc) => {
      // Status Filter
      if (selectedStatus !== "ALL") {
        if (selectedStatus === "REPORTED" && inc.status !== "REPORTED") return false;
        if (selectedStatus === "DISPATCHING" && inc.status !== "DISPATCHING") return false;
        if (selectedStatus === "IN_PROGRESS" && inc.status !== "IN_PROGRESS") return false;
        if (selectedStatus === "RESOLVED" && inc.status !== "RESOLVED") return false;
      }
      // Severity Filter
      if (selectedSeverity !== "ALL" && inc.severity !== selectedSeverity) {
        return false;
      }
      return true;
    });
  }, [incidents, selectedStatus, selectedSeverity]);

  // 1. Initialize Leaflet Map (Once on mount)
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    let isMounted = true;

    async function initLeaflet() {
      if (typeof window === "undefined") return;

      const L = (await import("leaflet")).default;
      if (!isMounted || !mapContainerRef.current || mapRef.current) return;

      // Centered at Bangladesh geographic center
      const map = L.map(mapContainerRef.current, {
        zoomControl: false,
        attributionControl: false,
      }).setView([23.6850, 90.3563], 7);

      L.control.zoom({ position: "bottomright" }).addTo(map);

      // Clean OpenStreetMap Tiles
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
      }).addTo(map);

      // Create Layer Groups
      const heatmapsGroup = L.layerGroup().addTo(map);
      const incidentsGroup = L.layerGroup().addTo(map);
      const volunteersGroup = L.layerGroup().addTo(map);

      layerGroupsRef.current = {
        heatmaps: heatmapsGroup,
        incidents: incidentsGroup,
        volunteers: volunteersGroup,
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

  // 2. Render Markers and Layers Dynamically when Telemetry or Filters Change
  useEffect(() => {
    if (!mapRef.current || !layerGroupsRef.current) return;

    async function updateLayers() {
      const L = (await import("leaflet")).default;
      const { heatmaps, incidents: incGroup, volunteers: volGroup } = layerGroupsRef.current!;

      heatmaps.clearLayers();
      incGroup.clearLayers();
      volGroup.clearLayers();

      // A. Render Crisis Heatmap Circles
      if (showHeatmapLayer) {
        filteredIncidents.forEach((inc) => {
          if (!inc.latitude || !inc.longitude) return;

          const isCritical = inc.severity === "CRITICAL";
          const isHigh = inc.severity === "HIGH";
          const radiusMeters = isCritical ? 6000 : isHigh ? 4000 : 2500;
          const fillColor = isCritical ? "#dc2626" : isHigh ? "#ea580c" : "#3b82f6";

          // Outer pulse circle
          L.circle([inc.latitude, inc.longitude], {
            radius: radiusMeters,
            fillColor: fillColor,
            fillOpacity: 0.12,
            color: fillColor,
            weight: 1.5,
            dashArray: "3, 6",
          }).addTo(heatmaps);

          // Inner intensive core
          L.circle([inc.latitude, inc.longitude], {
            radius: radiusMeters * 0.45,
            fillColor: fillColor,
            fillOpacity: 0.22,
            stroke: false,
          }).addTo(heatmaps);
        });
      }

      // B. Render Incident Markers
      if (showIncidentsLayer) {
        filteredIncidents.forEach((inc) => {
          if (!inc.latitude || !inc.longitude) return;

          const isCritical = inc.severity === "CRITICAL";
          const isHigh = inc.severity === "HIGH";
          const markerColor = isCritical ? "#dc2626" : isHigh ? "#ea580c" : "#2563eb";

          // Create circle marker
          const marker = L.circleMarker([inc.latitude, inc.longitude], {
            radius: isCritical ? 11 : 9,
            fillColor: markerColor,
            color: "#ffffff",
            weight: 2.5,
            opacity: 1,
            fillOpacity: 0.95,
          }).addTo(incGroup);

          // Interactive Popup with Dispatch Trigger
          const popupContent = `
            <div style="font-family: inherit; width: 220px; padding: 2px;">
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
                <span style="background: ${isCritical ? '#fee2e2' : '#ffedd5'}; color: ${isCritical ? '#dc2626' : '#c2410c'}; font-size: 10px; font-weight: 800; padding: 2px 6px; border-radius: 6px; text-transform: uppercase;">
                  ${inc.severity}
                </span>
                <span style="font-size: 10px; font-weight: 700; color: #64748b;">
                  #${inc.id}
                </span>
              </div>
              <h4 style="margin: 0; font-size: 13px; font-weight: 800; color: #10233f; line-height: 1.3;">
                ${inc.title}
              </h4>
              <p style="margin: 4px 0 0; font-size: 11px; color: #475569; line-height: 1.4;">
                ${inc.description ? inc.description.slice(0, 90) + '...' : ''}
              </p>
              <div style="margin-top: 6px; padding-top: 6px; border-top: 1px solid #e2e8f0; font-size: 11px; color: #64748b;">
                <strong>📍 Area:</strong> ${inc.addressText || inc.areaName || inc.district || 'Dhaka'}<br/>
                <strong>🚨 Status:</strong> <span style="font-weight: 700; color: #10233f;">${inc.status}</span>
              </div>
              <button 
                id="dispatch-btn-${inc.id}" 
                style="margin-top: 8px; width: 100%; background: #dc2626; color: #ffffff; border: none; padding: 6px 10px; border-radius: 8px; font-size: 11px; font-weight: 800; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 4px;"
              >
                ⚡ Open Radar & Dispatch
              </button>
            </div>
          `;

          marker.bindPopup(popupContent, { maxWidth: 260 });

          marker.on("popupopen", () => {
            const btn = document.getElementById(`dispatch-btn-${inc.id}`);
            if (btn) {
              btn.onclick = () => {
                setSelectedModalIncident(inc);
                setModalInitialTab("RADAR");
                setIsModalOpen(true);
              };
            }
          });
        });
      }

      // C. Render Verified Volunteers Layer
      if (showVolunteersLayer) {
        volunteers.forEach((vol) => {
          if (!vol.latitude || !vol.longitude) return;

          const isAvailable = vol.volunteerStatus === "AVAILABLE";

          // Volunteer service radius circle
          L.circle([vol.latitude, vol.longitude], {
            radius: (vol.serviceRadiusKm || 10) * 1000,
            fillColor: "#10b981",
            fillOpacity: 0.05,
            color: "#10b981",
            weight: 1,
            dashArray: "3, 5",
          }).addTo(volGroup);

          // Volunteer Marker pin
          const volMarker = L.circleMarker([vol.latitude, vol.longitude], {
            radius: 6.5,
            fillColor: isAvailable ? "#10b981" : "#64748b",
            color: "#ffffff",
            weight: 2,
            opacity: 1,
            fillOpacity: 0.95,
          }).addTo(volGroup);

          volMarker.bindPopup(`
            <div style="font-family: inherit; padding: 3px;">
              <span style="background: #d1fae5; color: #047857; font-size: 10px; font-weight: 800; padding: 2px 6px; border-radius: 4px; text-transform: uppercase;">
                ✓ Verified Responder
              </span>
              <p style="margin: 4px 0 0; font-weight: 800; font-size: 12px; color: #10233f;">${vol.name}</p>
              <p style="margin: 2px 0 0; font-size: 11px; color: #64748b;">${vol.district || 'Dhaka'} · ${vol.serviceRadiusKm || 10}km Radius</p>
              <p style="margin: 2px 0 0; font-size: 10px; font-weight: 700; color: ${isAvailable ? '#059669' : '#64748b'};">
                ${isAvailable ? '🟢 ON-DUTY & READY' : '⚪ OFF-DUTY'}
              </p>
            </div>
          `);
        });
      }
    }

    updateLayers();
  }, [filteredIncidents, volunteers, showHeatmapLayer, showIncidentsLayer, showVolunteersLayer]);

  // Fly to selected division
  const handleFlyToDivision = (divName: string) => {
    setSelectedDivision(divName);
    const coords = DIVISION_COORDINATES[divName] || DIVISION_COORDINATES.All;
    if (mapRef.current) {
      mapRef.current.flyTo([coords.lat, coords.lng], coords.zoom, {
        duration: 1.2,
      });
    }
  };

  // Seed Nationwide Demo Data Trigger
  const handleSeedDemoData = async () => {
    try {
      const res = await seedCrisisMutation().unwrap();
      toast.success(res?.message || "Nationwide crisis telemetry demo data initialized!");
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to initialize demo crisis telemetry.");
    }
  };

  // Handle status changes from triage modal
  const handleModalStatusChange = async (id: number | string, newStatus: string, note?: string) => {
    try {
      await updateStatusMutation({ id, status: newStatus as any, note }).unwrap();
      toast.success(`Incident status updated to ${newStatus}`);
      refetch();
    } catch (e: any) {
      toast.error(e?.data?.message || "Failed to update status");
    }
  };

  return (
    <div className="space-y-4">
      {/* ------------------------------------------------------------------
          1. TACTICAL MAP CONTAINER & CONTROLS
          ------------------------------------------------------------------ */}
      <div className="flex flex-col rounded-3xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-xs">
        {/* Top Header Toolbar */}
        <div className="flex flex-col gap-3 pb-5 border-b border-slate-100 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-black text-brand-navy tracking-tight">
                National Crisis Heatmap &amp; Tactical GIS Radar
              </h3>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 border border-red-200 px-2.5 py-0.5 text-xs font-bold text-brand-red">
                <Radio className="size-3 animate-pulse" />
                Live Telemetry
              </span>
              {isFetching && <Loader2 className="size-3.5 animate-spin text-slate-400" />}
            </div>
            <p className="mt-0.5 text-xs text-slate-500 font-medium">
              Nationwide emergency clusters, red-zone heatmaps, and responder density coverage
            </p>
          </div>

          {/* Seed Demo Data & Recenter */}
          <div className="flex flex-wrap items-center gap-2 self-start lg:self-center">
            <button
              onClick={handleSeedDemoData}
              disabled={isSeeding}
              className="flex items-center gap-1.5 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-bold text-amber-900 hover:bg-amber-100 transition shadow-2xs cursor-pointer"
              title="Populate nationwide sample incidents and verified volunteers across 5 divisions"
            >
              {isSeeding ? <Loader2 className="size-3.5 animate-spin text-amber-700" /> : <Sparkles className="size-3.5 text-amber-600" />}
              <span>Seed Realistic Demo Data</span>
            </button>

            <button
              onClick={() => handleFlyToDivision("All")}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 hover:text-brand-navy transition shadow-2xs cursor-pointer"
            >
              <Navigation className="size-3.5 text-brand-red" />
              <span>Full Bangladesh</span>
            </button>
          </div>
        </div>

        {/* Tactical Filters & Layer Toggles Bar */}
        <div className="my-4 flex flex-col gap-3 rounded-2xl bg-slate-50/80 p-3.5 border border-slate-200/80 lg:flex-row lg:items-center lg:justify-between text-xs">
          {/* Status & Severity Filter Pickers */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Status */}
            <div className="flex items-center gap-1.5 font-bold text-slate-600">
              <Filter className="size-3.5 text-slate-400" />
              <span>Status:</span>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="rounded-lg border border-slate-200 bg-white px-2 py-1 font-bold text-brand-navy focus:outline-none cursor-pointer"
              >
                <option value="ALL">All Statuses ({incidents.length})</option>
                <option value="REPORTED">Waiting Verification</option>
                <option value="DISPATCHING">Dispatching Responders</option>
                <option value="IN_PROGRESS">In Progress (Active)</option>
                <option value="RESOLVED">Resolved Incidents</option>
              </select>
            </div>

            {/* Severity */}
            <div className="flex items-center gap-1.5 font-bold text-slate-600">
              <span>Severity:</span>
              <select
                value={selectedSeverity}
                onChange={(e) => setSelectedSeverity(e.target.value)}
                className="rounded-lg border border-slate-200 bg-white px-2 py-1 font-bold text-brand-navy focus:outline-none cursor-pointer"
              >
                <option value="ALL">All Severities</option>
                <option value="CRITICAL">Critical (🚨)</option>
                <option value="HIGH">High (⚠️)</option>
                <option value="MEDIUM">Medium (⚡)</option>
                <option value="LOW">Low</option>
              </select>
            </div>
          </div>

          {/* Layer Switches */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setShowHeatmapLayer(!showHeatmapLayer)}
              className={cn(
                "flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 font-bold border transition cursor-pointer shadow-2xs",
                showHeatmapLayer
                  ? "bg-red-50 border-red-300 text-brand-red"
                  : "bg-white border-slate-200 text-slate-400"
              )}
            >
              <Flame className="size-3.5" />
              <span>Crisis Heatmap</span>
            </button>

            <button
              onClick={() => setShowIncidentsLayer(!showIncidentsLayer)}
              className={cn(
                "flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 font-bold border transition cursor-pointer shadow-2xs",
                showIncidentsLayer
                  ? "bg-blue-50 border-blue-300 text-brand-blue"
                  : "bg-white border-slate-200 text-slate-400"
              )}
            >
              <AlertTriangle className="size-3.5" />
              <span>Incidents ({filteredIncidents.length})</span>
            </button>

            <button
              onClick={() => setShowVolunteersLayer(!showVolunteersLayer)}
              className={cn(
                "flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 font-bold border transition cursor-pointer shadow-2xs",
                showVolunteersLayer
                  ? "bg-emerald-50 border-emerald-300 text-emerald-800"
                  : "bg-white border-slate-200 text-slate-400"
              )}
            >
              <Shield className="size-3.5" />
              <span>Volunteers ({volunteers.length})</span>
            </button>
          </div>
        </div>

        {/* Division Quick Navigation Pills */}
        <div className="flex flex-wrap items-center gap-1.5 mb-3 text-xs font-bold">
          <span className="text-[11px] text-slate-400 uppercase tracking-wider mr-1">Quick Jump:</span>
          {Object.keys(DIVISION_COORDINATES).map((divName) => (
            <button
              key={divName}
              onClick={() => handleFlyToDivision(divName)}
              className={cn(
                "rounded-lg px-2.5 py-1 transition cursor-pointer text-[11px]",
                selectedDivision === divName
                  ? "bg-brand-navy text-white font-extrabold shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              )}
            >
              {divName}
            </button>
          ))}
        </div>

        {/* GIS Leaflet Map Container */}
        <div
          ref={mapContainerRef}
          className="relative h-[460px] w-full overflow-hidden rounded-2xl border border-slate-200 z-10 bg-slate-100"
        >
          {isLoadingTelemetry && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white/70 backdrop-blur-xs">
              <Loader2 className="size-8 animate-spin text-brand-red" />
              <span className="mt-2 text-xs font-bold text-slate-600">Loading Geospatial Telemetry...</span>
            </div>
          )}
        </div>

        {/* Map Legend */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600 pt-3 border-t border-slate-100">
          <div className="flex flex-wrap items-center gap-4">
            <span className="flex items-center gap-1.5 font-medium">
              <span className="size-3 rounded-full bg-red-600 ring-2 ring-red-200" />
              <span>Critical Emergency (Pulsing Red)</span>
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <span className="size-3 rounded-full bg-amber-500 ring-2 ring-amber-200" />
              <span>High Severity Incident</span>
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <span className="size-3 rounded-full bg-blue-600 ring-2 ring-blue-200" />
              <span>Medium / General</span>
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <span className="size-3 rounded-full bg-emerald-500 ring-2 ring-emerald-200" />
              <span>Active Verified Volunteer (With Coverage Radius)</span>
            </span>
          </div>

          <div className="text-[11px] font-bold text-slate-400">
            Click any pin to inspect &amp; dispatch responders
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------
          2. DIVISION CRISIS INDEX & RESOURCE GAP LEADERBOARD
          ------------------------------------------------------------------ */}
      <div className="rounded-3xl border border-slate-200/90 bg-white/95 p-6 backdrop-blur-xl shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-black text-brand-navy">
              Division Crisis Index &amp; Responder Gap Analysis
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Ranking by critical emergencies, ongoing dispatches, and volunteer shortages
            </p>
          </div>
          <span className="text-xs font-bold text-slate-400">
            8 National Divisions
          </span>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {divisionStats.map((div) => {
            const isHighAlert = div.alertLevel === "HIGH_ALERT";
            const isModerate = div.alertLevel === "MODERATE";

            return (
              <div
                key={div.division}
                onClick={() => handleFlyToDivision(div.division)}
                className={cn(
                  "flex flex-col justify-between rounded-2xl border p-4 transition cursor-pointer hover:shadow-md",
                  isHighAlert
                    ? "border-red-200 bg-red-50/40 hover:border-red-400"
                    : isModerate
                    ? "border-amber-200 bg-amber-50/30 hover:border-amber-400"
                    : "border-slate-200/80 bg-slate-50/50 hover:border-slate-300"
                )}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-black text-brand-navy">{div.division}</h4>
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-[10px] font-extrabold uppercase border",
                        isHighAlert
                          ? "bg-red-100 text-brand-red border-red-200 animate-pulse"
                          : isModerate
                          ? "bg-amber-100 text-amber-800 border-amber-200"
                          : "bg-slate-100 text-slate-500 border-slate-200"
                      )}
                    >
                      {div.alertLevel.replace("_", " ")}
                    </span>
                  </div>

                  {/* Stats Grid */}
                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                    <div className="rounded-xl bg-white p-2 border border-slate-200/70">
                      <span className="text-[10.5px] font-bold text-slate-400">Incidents</span>
                      <p className="font-extrabold text-brand-navy mt-0.5">{div.totalIncidents}</p>
                    </div>

                    <div className="rounded-xl bg-white p-2 border border-slate-200/70">
                      <span className="text-[10.5px] font-bold text-slate-400">Critical</span>
                      <p className={cn("font-extrabold mt-0.5", div.criticalCount > 0 ? "text-brand-red" : "text-slate-700")}>
                        {div.criticalCount}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between border-t border-slate-200/60 pt-2 text-[11px]">
                  <span className="text-slate-500 font-medium">
                    Volunteers: <strong>{div.volunteerCount}</strong>
                  </span>
                  <span className="text-brand-red font-bold flex items-center gap-0.5">
                    View on Map <ArrowRight className="size-3" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ------------------------------------------------------------------
          3. 1-CLICK TRIAGE & DISPATCH MODAL (TRIGGERED FROM MAP POPUPS)
          ------------------------------------------------------------------ */}
      {selectedModalIncident && (
        <IncidentTriageModal
          incident={selectedModalIncident}
          isOpen={isModalOpen}
          initialTab={modalInitialTab}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedModalIncident(null);
          }}
          onStatusChange={handleModalStatusChange}
        />
      )}
    </div>
  );
}
