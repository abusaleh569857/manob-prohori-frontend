"use client";

import { useFormContext } from "react-hook-form";
import { MapPin, Navigation, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { IncidentFormValues } from "@/lib/validations/incident.schema";

interface LocationPickerProps {
  isLocating: boolean;
  onCaptureLocation: () => void;
}

export function LocationPicker({
  isLocating,
  onCaptureLocation,
}: LocationPickerProps) {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext<IncidentFormValues>();

  const lat = watch("latitude");
  const lng = watch("longitude");
  const accuracy = watch("locationAccuracyMeters");
  const hasCoordinates = typeof lat === "number" && typeof lng === "number" && !isNaN(lat);

  return (
    <div className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h4 className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
            <MapPin className="size-4 text-red-500" />
            Incident Location <span className="text-red-500">*</span>
          </h4>
          <p className="text-[11px] text-slate-500">
            Precise GPS coordinates are required to notify nearby 5 km responders.
          </p>
        </div>

        <Button
          type="button"
          onClick={onCaptureLocation}
          disabled={isLocating}
          variant="outline"
          className="rounded-xl border-red-200 bg-white px-3.5 py-1.5 text-xs font-bold text-red-600 shadow-xs hover:bg-red-50 hover:text-red-700"
        >
          {isLocating ? (
            <span className="flex items-center gap-1.5">
              <Loader2 className="size-3.5 animate-spin" />
              Detecting GPS...
            </span>
          ) : (
            <span className="flex items-center gap-1.5">
              <Navigation className="size-3.5" />
              Use Current Location
            </span>
          )}
        </Button>
      </div>

      {/* GPS Coordinate Status Box */}
      {hasCoordinates ? (
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-emerald-200 bg-emerald-50/80 px-3.5 py-2 text-xs font-semibold text-emerald-800">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
            <span>
              GPS: <strong>{lat.toFixed(5)}° N</strong>, <strong>{lng.toFixed(5)}° E</strong>
            </span>
          </div>
          {accuracy && (
            <span className="rounded-md bg-white/80 px-2 py-0.5 text-[10px] text-slate-600 border border-emerald-200">
              Accuracy: ~{Math.round(accuracy)}m
            </span>
          )}
        </div>
      ) : (
        <div className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-2 text-xs font-medium text-amber-800">
          <AlertCircle className="size-4 text-amber-600 shrink-0" />
          <span>Click &quot;Use Current Location&quot; to fetch your real-time coordinates.</span>
        </div>
      )}

      {(errors.latitude || errors.longitude) && (
        <p className="text-[11px] font-medium text-red-500">
          {errors.latitude?.message || "Location coordinates are required."}
        </p>
      )}

      {/* Address and Area Details */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 pt-1">
        <div>
          <label className="mb-1 block text-xs font-bold text-slate-700">
            Address / Landmark
          </label>
          <input
            type="text"
            placeholder="e.g. House 12, Road 4, Mirpur 10"
            {...register("addressText")}
            className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-medium text-slate-800 placeholder-slate-400 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-bold text-slate-700">
            Area / Neighbourhood
          </label>
          <input
            type="text"
            placeholder="e.g. Mirpur"
            {...register("areaName")}
            className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-medium text-slate-800 placeholder-slate-400 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-bold text-slate-700">
            District
          </label>
          <input
            type="text"
            placeholder="e.g. Dhaka"
            {...register("district")}
            className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-medium text-slate-800 placeholder-slate-400 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-bold text-slate-700">
            Upazila / Thana
          </label>
          <input
            type="text"
            placeholder="e.g. Mirpur Thana"
            {...register("upazila")}
            className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-medium text-slate-800 placeholder-slate-400 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20"
          />
        </div>
      </div>
    </div>
  );
}
