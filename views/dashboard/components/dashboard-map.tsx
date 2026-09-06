"use client";

import { useEffect, useRef, useState } from "react";
import { Navigation, Radio, Loader2 } from "lucide-react";
import { useGetPublicVerifiedIncidentsQuery } from "@/redux/api/incidentApi";

export default function DashboardMap() {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const markersLayerRef = useRef<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const { data: verifiedRes, isLoading } = useGetPublicVerifiedIncidentsQuery(
    { limit: 100 },
    {
      pollingInterval: 15000,
      refetchOnMountOrArgChange: true,
    }
  );

  const incidents = (verifiedRes?.data || []).filter(
    (item: any) =>
      item.status === "VERIFIED" ||
      item.status === "DISPATCHING" ||
      item.status === "IN_PROGRESS" ||
      item.status === "RESPONDER_ASSIGNED"
  );

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    let isMounted = true;

    async function initMap() {
      if (typeof window === "undefined") return;

      const L = (await import("leaflet")).default;

      if (!isMounted || !mapContainerRef.current || mapRef.current) return;

      // Default center: Dhaka
      const centerLat = 23.8103;
      const centerLng = 90.4125;

      const map = L.map(mapContainerRef.current, {
        zoomControl: false,
      }).setView([centerLat, centerLng], 12);

      L.control.zoom({ position: "bottomright" }).addTo(map);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      const markersLayer = L.layerGroup().addTo(map);
      markersLayerRef.current = markersLayer;
      mapRef.current = map;
      setIsLoaded(true);
    }

    initMap();

    return () => {
      isMounted = false;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Update Markers dynamically when incidents update
  useEffect(() => {
    if (!mapRef.current || !markersLayerRef.current) return;

    async function updateMarkers() {
      const L = (await import("leaflet")).default;
      const markersLayer = markersLayerRef.current;
      markersLayer.clearLayers();

      const bounds: [number, number][] = [];

      incidents.forEach((inc: any) => {
        const lat = parseFloat(inc.latitude);
        const lng = parseFloat(inc.longitude);

        if (isNaN(lat) || isNaN(lng)) return;

        bounds.push([lat, lng]);

        const color =
          inc.severity === "CRITICAL"
            ? "#dc2626"
            : inc.severity === "HIGH"
            ? "#d97706"
            : inc.severity === "MEDIUM"
            ? "#2563eb"
            : "#64748b";

        const marker = L.circleMarker([lat, lng], {
          radius: 9,
          fillColor: color,
          color: "#ffffff",
          weight: 2.5,
          opacity: 1,
          fillOpacity: 0.9,
        }).addTo(markersLayer);

        const locationText = inc.addressText || inc.areaName || "Dhaka";

        marker.bindPopup(`
          <div style="font-family: system-ui, -apple-system, sans-serif; padding: 4px 2px; min-width: 170px;">
            <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px;">
              <span style="background: ${color}15; color: ${color}; font-size: 10px; font-weight: 800; padding: 2px 6px; border-radius: 4px; text-transform: uppercase;">
                ${inc.severity}
              </span>
              <span style="font-size: 10px; font-weight: bold; color: #16a34a; background: #f0fdf4; padding: 2px 6px; border-radius: 4px;">
                Verified
              </span>
            </div>
            <p style="margin: 6px 0 2px; font-weight: 800; font-size: 13px; color: #0f172a; line-height: 1.3;">
              ${inc.title}
            </p>
            <p style="margin: 0 0 8px; font-size: 11px; color: #64748b;">
              📍 ${locationText}
            </p>
            <a href="/incidents/${inc.id}" style="display: block; text-align: center; background: #dc2626; color: #ffffff; font-size: 11px; font-weight: 700; padding: 5px 8px; border-radius: 6px; text-decoration: none;">
              View Full Incident →
            </a>
          </div>
        `);
      });

      if (bounds.length > 0) {
        mapRef.current.fitBounds(bounds, {
          padding: [40, 40],
          maxZoom: 14,
        });
      }
    }

    updateMarkers();
  }, [incidents]);

  const handleRecenter = () => {
    if (!mapRef.current) return;
    const validBounds = incidents
      .map((inc: any) => [parseFloat(inc.latitude), parseFloat(inc.longitude)] as [number, number])
      .filter(([lat, lng]) => !isNaN(lat) && !isNaN(lng));

    if (validBounds.length > 0) {
      mapRef.current.fitBounds(validBounds, {
        padding: [40, 40],
        maxZoom: 14,
      });
    } else {
      mapRef.current.setView([23.8103, 90.4125], 12);
    }
  };

  return (
    <div id="map" className="flex flex-col rounded-2xl border border-slate-200/80 bg-white/90 p-5 sm:p-6 backdrop-blur-xl shadow-xs">
      {/* Map Widget Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-brand-navy">
              Live Emergency Radar Map
            </h3>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 border border-red-200/80 px-2.5 py-0.5 text-[11px] font-bold text-brand-red">
              <Radio className="size-3 animate-pulse" /> Live Telemetry
            </span>
          </div>
          <p className="mt-1 text-xs sm:text-[13px] text-slate-500 font-medium">
            Real-time GPS tracking of active emergencies, volunteer responders, and hospital hubs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isLoading && <Loader2 className="size-4 animate-spin text-slate-400" />}
          <button
            onClick={handleRecenter}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-brand-navy transition cursor-pointer shadow-2xs"
          >
            <Navigation className="size-3.5 text-brand-red" />
            Recenter
          </button>
        </div>
      </div>

      {/* Map Viewport Container */}
      <div
        ref={mapContainerRef}
        className="h-84 w-full overflow-hidden rounded-xl border border-slate-200 z-10 bg-slate-100"
      />
    </div>
  );
}