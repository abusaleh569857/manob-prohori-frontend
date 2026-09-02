"use client";

import { useEffect, useRef, useState } from "react";
import { Navigation, Radio, Layers, ShieldAlert, Users, Ambulance } from "lucide-react";

export function AdminLiveIncidentMap() {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const [filter, setFilter] = useState<"ALL" | "CRITICAL" | "RESPONDERS">("ALL");

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    let isMounted = true;

    async function initAdminMap() {
      if (typeof window === "undefined") return;

      const L = (await import("leaflet")).default;
      if (!isMounted || !mapContainerRef.current || mapRef.current) return;

      // Center around Dhaka / Bangladesh
      const centerLat = 23.8103;
      const centerLng = 90.4125;

      const map = L.map(mapContainerRef.current, {
        zoomControl: false,
      }).setView([centerLat, centerLng], 12);

      L.control.zoom({ position: "bottomright" }).addTo(map);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map);

      // Nationwide Incidents Telemetry Mock
      const incidentMarkers = [
        { lat: 23.8103, lng: 90.4125, title: "Mass Casualty Traffic Accident", severity: "CRITICAL", area: "Dhanmondi" },
        { lat: 23.8223, lng: 90.4201, title: "Commercial High-Rise Fire", severity: "HIGH", area: "Kalabagan" },
        { lat: 23.7925, lng: 90.4078, title: "Cardiac Arrest Emergency", severity: "URGENT", area: "Mohammadpur" },
        { lat: 23.7461, lng: 90.3742, title: "Flash Flood / Water Rescue", severity: "MEDIUM", area: "Mirpur" },
        { lat: 23.8654, lng: 90.3982, title: "Building Structural Hazard", severity: "HIGH", area: "Uttara" },
      ];

      incidentMarkers.forEach((inc) => {
        const marker = L.circleMarker([inc.lat, inc.lng], {
          radius: 10,
          fillColor: inc.severity === "CRITICAL" ? "#dc2626" : inc.severity === "HIGH" ? "#ea580c" : "#2563eb",
          color: "#ffffff",
          weight: 2.5,
          opacity: 1,
          fillOpacity: 0.9,
        }).addTo(map);

        marker.bindPopup(`
          <div style="font-family: inherit; padding: 4px;">
            <span style="background: #fee2e2; color: #dc2626; font-size: 10px; font-weight: 800; padding: 2px 6px; border-radius: 4px; text-transform: uppercase;">
              ${inc.severity}
            </span>
            <p style="margin: 4px 0 0; font-weight: 800; font-size: 13px; color: #10233f;">${inc.title}</p>
            <p style="margin: 2px 0 0; font-size: 11px; color: #64748b;">Area: ${inc.area}</p>
          </div>
        `);
      });

      // 5km Volunteer Responder Cluster Circles
      L.circle([23.8103, 90.4125], {
        radius: 3000,
        color: "#10b981",
        fillColor: "#10b981",
        fillOpacity: 0.08,
        weight: 1.5,
        dashArray: "4, 4",
      }).addTo(map);

      mapRef.current = map;
    }

    initAdminMap();

    return () => {
      isMounted = false;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  const handleRecenter = () => {
    if (mapRef.current) {
      mapRef.current.setView([23.8103, 90.4125], 12);
    }
  };

  return (
    <div className="flex flex-col rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-brand-navy">
              Live National Emergency Telemetry Map
            </h3>
            <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 border border-blue-200 px-2 py-0.5 text-[10px] font-bold text-brand-blue">
              <Radio className="size-3 animate-pulse" /> 5 Active Incidents
            </span>
          </div>
          <p className="mt-0.5 text-xs text-slate-400">
            Real-time geospatial monitoring of reported emergencies, responder radiuses, and dispatch zones
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRecenter}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-100 hover:text-brand-navy transition cursor-pointer"
          >
            <Navigation className="size-3.5 text-brand-red" />
            Recenter
          </button>
        </div>
      </div>

      <div
        ref={mapContainerRef}
        className="h-96 w-full overflow-hidden rounded-xl border border-slate-200 z-10 bg-slate-100"
      />
    </div>
  );
}
