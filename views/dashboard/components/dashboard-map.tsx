"use client";

import { useEffect, useRef, useState } from "react";
import { Navigation, Radio } from "lucide-react";

export default function DashboardMap() {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) {
      return;
    }

    let isMounted = true;

    async function initMap() {
      if (typeof window === "undefined") return;

      const L = (await import("leaflet")).default;

      if (!isMounted || !mapContainerRef.current || mapRef.current) return;

      // Default to Dhaka coordinates
      const centerLat = 23.8103;
      const centerLng = 90.4125;

      const map = L.map(mapContainerRef.current, {
        zoomControl: false,
      }).setView([centerLat, centerLng], 13);

      // Add Zoom Control at bottom right
      L.control.zoom({ position: "bottomright" }).addTo(map);

      // Add OpenStreetMap tiles
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      // Mock Sample Incident Markers
      const sampleIncidents = [
        {
          lat: 23.8103,
          lng: 90.4125,
          title: "Road Traffic Accident",
          severity: "CRITICAL",
        },
        {
          lat: 23.8223,
          lng: 90.4201,
          title: "Medical Trauma Dispatch",
          severity: "HIGH",
        },
        {
          lat: 23.7925,
          lng: 90.4078,
          title: "Building Fire Alarm",
          severity: "URGENT",
        },
      ];

      sampleIncidents.forEach((inc) => {
        const marker = L.circleMarker([inc.lat, inc.lng], {
          radius: 10,
          fillColor: "#dc2626",
          color: "#ffffff",
          weight: 2.5,
          opacity: 1,
          fillOpacity: 0.9,
        }).addTo(map);

        marker.bindPopup(`
          <div style="font-family: inherit; padding: 4px;">
            <strong style="color: #dc2626; font-size: 12px; text-transform: uppercase;">${inc.severity}</strong>
            <p style="margin: 2px 0 0; font-weight: bold; font-size: 13px; color: #10233f;">${inc.title}</p>
          </div>
        `);
      });

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

  const handleRecenter = () => {
    if (mapRef.current) {
      mapRef.current.setView([23.8103, 90.4125], 13);
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

        <button
          onClick={handleRecenter}
          className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-brand-navy transition cursor-pointer shadow-2xs"
        >
          <Navigation className="size-3.5 text-brand-red" />
          Recenter
        </button>
      </div>

      {/* Map Viewport Container */}
      <div
        ref={mapContainerRef}
        className="h-84 w-full overflow-hidden rounded-xl border border-slate-200 z-10 bg-slate-100"
      />
    </div>
  );
}