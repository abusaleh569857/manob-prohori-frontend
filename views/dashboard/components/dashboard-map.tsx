"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";

export default function DashboardMap() {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) {
      return;
    }

    // Prevent creating the map more than once
    if (mapRef.current) {
      return;
    }

    // Create map
    const map = L.map(mapContainerRef.current).setView(
      [23.8103, 90.4125],
      13
    );

    // Add OpenStreetMap tiles
    L.tileLayer(
      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }
    ).addTo(map);

    // Save map instance
    mapRef.current = map;

    // Cleanup
    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  return (
    <div
      ref={mapContainerRef}
      className="dashboard-map-container"
    />
  );
}