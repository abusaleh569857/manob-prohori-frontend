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
    <div className="space-y-3 rounded-2xl border border-border bg-slate-50/70 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h4 className="flex items-center gap-1.5 text-xs font-bold text-foreground">
            <MapPin className="size-4 text-destructive" />
            Incident Location <span className="text-destructive">*</span>
          </h4>
          <p className="text-[11px] text-muted-foreground">
            Precise GPS coordinates are required to notify nearby 5 km responders.
          </p>
        </div>

        <Button
          type="button"
          onClick={onCaptureLocation}
          disabled={isLocating}
          variant="outline"
          className="rounded-xl border-border bg-card px-3.5 py-1.5 text-xs font-bold text-destructive shadow-xs hover:bg-accent hover:text-accent-foreground"
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
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-brand-emerald/30 bg-brand-emerald-soft px-3.5 py-2 text-xs font-semibold text-brand-emerald-dark">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="size-4 text-brand-emerald shrink-0" />
            <span>
              GPS: <strong>{lat.toFixed(5)}° N</strong>, <strong>{lng.toFixed(5)}° E</strong>
            </span>
          </div>
          {accuracy && (
            <span className="rounded-md bg-card/80 px-2 py-0.5 text-[10px] text-brand-text-secondary border border-brand-emerald/20">
              Accuracy: ~{Math.round(accuracy)}m
            </span>
          )}
        </div>
      ) : (
        <div className="flex items-center gap-2 rounded-xl border border-brand-amber/30 bg-brand-amber-soft px-3.5 py-2 text-xs font-medium text-brand-amber-dark">
          <AlertCircle className="size-4 text-brand-amber shrink-0" />
          <span>Click &quot;Use Current Location&quot; to fetch your real-time coordinates.</span>
        </div>
      )}

      {(errors.latitude || errors.longitude) && (
        <p className="text-[11px] font-medium text-destructive">
          {errors.latitude?.message || "Location coordinates are required."}
        </p>
      )}

      {/* Address and Area Details */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 pt-1">
        <div>
          <label className="mb-1 block text-xs font-bold text-foreground">
            Address / Landmark
          </label>
          <input
            type="text"
            placeholder="e.g. House 12, Road 4, Mirpur 10"
            {...register("addressText")}
            className="w-full rounded-xl border border-input bg-card px-3.5 py-2.5 text-xs font-medium text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-bold text-foreground">
            Area / Neighbourhood
          </label>
          <input
            type="text"
            placeholder="e.g. Mirpur"
            {...register("areaName")}
            className="w-full rounded-xl border border-input bg-card px-3.5 py-2.5 text-xs font-medium text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-bold text-foreground">
            District
          </label>
          <input
            type="text"
            placeholder="e.g. Dhaka"
            {...register("district")}
            className="w-full rounded-xl border border-input bg-card px-3.5 py-2.5 text-xs font-medium text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-bold text-foreground">
            Upazila / Thana
          </label>
          <input
            type="text"
            placeholder="e.g. Mirpur Thana"
            {...register("upazila")}
            className="w-full rounded-xl border border-input bg-card px-3.5 py-2.5 text-xs font-medium text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>
    </div>
  );
}
