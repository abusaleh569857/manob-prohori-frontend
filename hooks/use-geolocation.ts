"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";

interface GeolocationResult {
  latitude: number;
  longitude: number;
  accuracy: number | null;
  addressText?: string;
  district?: string;
  upazila?: string;
  areaName?: string;
}

export function useGeolocation() {
  const [isLocating, setIsLocating] = useState(false);
  const [location, setLocation] = useState<GeolocationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const getCurrentLocation = useCallback(async (): Promise<GeolocationResult | null> => {
    if (!navigator.geolocation) {
      const err = "Geolocation is not supported by your browser";
      setError(err);
      toast.error(err);
      return null;
    }

    setIsLocating(true);
    setError(null);

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          const acc = position.coords.accuracy;

          const result: GeolocationResult = {
            latitude: Number(lat.toFixed(7)),
            longitude: Number(lng.toFixed(7)),
            accuracy: acc ? Number(acc.toFixed(2)) : null,
          };

          // Optional reverse geocode for convenience
          try {
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`,
              { headers: { "Accept-Language": "en" } }
            );
            if (res.ok) {
              const data = await res.json();
              if (data && data.address) {
                const addr = data.address;
                result.addressText = data.display_name || "";
                result.district = addr.state_district || addr.district || addr.city || "";
                result.upazila = addr.suburb || addr.neighbourhood || addr.county || "";
                result.areaName = addr.neighbourhood || addr.suburb || addr.village || "";
              }
            }
          } catch (geoErr) {
            console.log("Reverse geocode lookup skipped:", geoErr);
          }

          setLocation(result);
          setIsLocating(false);
          toast.success("GPS Location captured successfully!");
          resolve(result);
        },
        (geoError) => {
          let msg = "Failed to retrieve your location";
          switch (geoError.code) {
            case geoError.PERMISSION_DENIED:
              msg = "Location permission was denied. Please allow location access in your browser.";
              break;
            case geoError.POSITION_UNAVAILABLE:
              msg = "Location information is currently unavailable.";
              break;
            case geoError.TIMEOUT:
              msg = "Location request timed out. Please try again.";
              break;
          }
          setError(msg);
          setIsLocating(false);
          toast.error(msg);
          resolve(null);
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 0,
        }
      );
    });
  }, []);

  return {
    getCurrentLocation,
    isLocating,
    location,
    error,
  };
}
