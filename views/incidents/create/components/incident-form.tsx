"use client";

import { FormProvider } from "react-hook-form";
import {
  Loader2,
  Siren,
  FileText,
  AlertTriangle,
  MapPin,
  Camera,
  ShieldCheck,
  Radio,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CategorySelector } from "./category-selector";
import { SeveritySelector } from "./severity-selector";
import { LocationPicker } from "./location-picker";
import { ImageUploader } from "./image-uploader";
import type { useCreateIncident } from "../hooks/use-create-incident";

interface IncidentFormProps {
  hook: ReturnType<typeof useCreateIncident>;
}

export function IncidentForm({ hook }: IncidentFormProps) {
  const {
    form,
    onSubmit,
    categories,
    isLoadingCategories,
    isSubmitting,
    isLocating,
    images,
    setImages,
    handleCaptureLocation,
  } = hook;

  const {
    register,
    formState: { errors },
  } = form;

  return (
    <FormProvider {...form}>
      <form onSubmit={onSubmit} className="space-y-6">
        {/* ==================================================================
            BALANCED 2-COLUMN GRID (50% LEFT / 50% RIGHT)
            ================================================================== */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 items-stretch">
          {/* ==================================================================
              LEFT COLUMN (50%): Incident Classification, Details, Severity & Photos
              ================================================================== */}
          <div className="flex flex-col gap-6">
            {/* 1. Incident Classification & Details Card */}
            <div className="rounded-3xl border border-slate-200/90 bg-white/95 p-6 backdrop-blur-xl shadow-[0_10px_30px_rgba(16,35,63,0.04)] space-y-4">
              <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                <div className="grid size-9 place-items-center rounded-xl bg-red-50 text-brand-red border border-red-200 shadow-2xs">
                  <FileText className="size-4.5" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-black text-brand-navy">
                    1. Incident Classification &amp; Summary
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Select emergency category and provide brief overview
                  </p>
                </div>
              </div>

              {/* Dynamic Category Selector */}
              <CategorySelector
                categories={categories}
                isLoading={isLoadingCategories}
              />

              {/* Incident Title */}
              <div>
                <label className="mb-1.5 block text-xs font-bold text-brand-navy">
                  Incident Title <span className="text-brand-red">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Fire outbreak on residential 4th floor"
                  {...register("title")}
                  className={`w-full rounded-2xl border bg-slate-50/70 py-3 px-4 text-xs sm:text-sm font-semibold text-slate-800 placeholder:text-slate-400 transition focus:bg-white focus:outline-none focus:ring-3 ${
                    errors.title
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500/15"
                      : "border-slate-200/90 focus:border-brand-red focus:ring-red-500/10"
                  }`}
                />
                {errors.title && (
                  <p className="mt-1 text-[11px] font-medium text-brand-red">
                    {errors.title.message}
                  </p>
                )}
              </div>

              {/* Incident Description */}
              <div>
                <label className="mb-1.5 block text-xs font-bold text-brand-navy">
                  Emergency Description &amp; Victims Status <span className="text-brand-red">*</span>
                </label>
                <textarea
                  rows={3}
                  placeholder="Provide details about trapped victims, intensity, water/smoke levels, injuries, or immediate assistance needed..."
                  {...register("description")}
                  className={`w-full rounded-2xl border bg-slate-50/70 py-3 px-4 text-xs sm:text-sm font-medium text-slate-800 placeholder:text-slate-400 transition focus:bg-white focus:outline-none focus:ring-3 ${
                    errors.description
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500/15"
                      : "border-slate-200/90 focus:border-brand-red focus:ring-red-500/10"
                  }`}
                />
                {errors.description && (
                  <p className="mt-1 text-[11px] font-medium text-brand-red">
                    {errors.description.message}
                  </p>
                )}
              </div>
            </div>

            {/* 2. Threat & Severity Level Card */}
            <div className="rounded-3xl border border-slate-200/90 bg-white/95 p-6 backdrop-blur-xl shadow-[0_10px_30px_rgba(16,35,63,0.04)] space-y-4">
              <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                <div className="grid size-9 place-items-center rounded-xl bg-amber-50 text-amber-600 border border-amber-200 shadow-2xs">
                  <AlertTriangle className="size-4.5" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-black text-brand-navy">
                    2. Threat &amp; Urgency Level
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Determines responder priority and emergency siren dispatch
                  </p>
                </div>
              </div>

              <SeveritySelector />
            </div>

            {/* 3. Photo Evidence Card */}
            <div className="flex-1 rounded-3xl border border-slate-200/90 bg-white/95 p-6 backdrop-blur-xl shadow-[0_10px_30px_rgba(16,35,63,0.04)] space-y-4">
              <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                <div className="grid size-9 place-items-center rounded-xl bg-blue-50 text-blue-600 border border-blue-200 shadow-2xs">
                  <Camera className="size-4.5" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-black text-brand-navy">
                    3. Visual Damage Evidence (Optional)
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Upload photos to assist responders in assessing damage scale
                  </p>
                </div>
              </div>

              <ImageUploader
                images={images}
                onImagesChange={setImages}
                maxFiles={5}
              />
            </div>
          </div>

          {/* ==================================================================
              RIGHT COLUMN (50%): Geospatial Location Map & Protocol
              ================================================================== */}
          <div className="flex flex-col gap-6">
            {/* 4. Location & Interactive Map Pin Card */}
            <div className="rounded-3xl border border-slate-200/90 bg-white/95 p-6 backdrop-blur-xl shadow-[0_10px_30px_rgba(16,35,63,0.04)] space-y-4">
              <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                <div className="grid size-9 place-items-center rounded-xl bg-red-50 text-brand-red border border-red-200 shadow-2xs">
                  <MapPin className="size-4.5" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-black text-brand-navy">
                    4. Geospatial Pinpoint &amp; Address
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Click anywhere on map to pinpoint exact location
                  </p>
                </div>
              </div>

              <LocationPicker
                isLocating={isLocating}
                onCaptureLocation={handleCaptureLocation}
              />
            </div>

            {/* 5. Emergency Protocol & Dispatch Guidelines Card */}
            <div className="flex-1 rounded-3xl border border-slate-200/90 bg-linear-to-b from-slate-50/90 to-white p-6 backdrop-blur-xl shadow-xs space-y-3.5">
              <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-brand-navy">
                <ShieldCheck className="size-4.5 text-emerald-600" />
                <span>5km Fast Responder Matching Protocol</span>
              </div>
              <ul className="space-y-3 text-xs text-slate-600 font-medium leading-relaxed">
                <li className="flex items-start gap-2.5">
                  <span className="grid size-5 shrink-0 place-items-center rounded-full bg-emerald-100 text-[11px] font-extrabold text-emerald-800">
                    ✓
                  </span>
                  <span><strong>Automatic Proximity Alerts:</strong> Verified emergency volunteers within 5km radius are alerted instantly.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="grid size-5 shrink-0 place-items-center rounded-full bg-emerald-100 text-[11px] font-extrabold text-emerald-800">
                    ✓
                  </span>
                  <span><strong>Tactical Audio Siren:</strong> Emergency siren sound triggers immediately on available responder apps.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="grid size-5 shrink-0 place-items-center rounded-full bg-emerald-100 text-[11px] font-extrabold text-emerald-800">
                    ✓
                  </span>
                  <span><strong>National Crisis Heatmap:</strong> Live telemetry streams this incident to central admin GIS radar.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* ==================================================================
            FULL-WIDTH ACTION BAR: Submit Button Across Full Width
            ================================================================== */}
        <div className="rounded-3xl border border-slate-200/90 bg-white/95 p-6 backdrop-blur-xl shadow-[0_10px_30px_rgba(16,35,63,0.04)] space-y-3">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="group relative flex w-full items-center justify-center gap-3 rounded-2xl bg-linear-to-r from-red-600 via-brand-red to-red-600 py-5 text-base sm:text-lg font-black text-white shadow-[0_15px_35px_rgba(220,38,38,0.35)] transition-all hover:scale-[1.005] hover:shadow-[0_20px_45px_rgba(220,38,38,0.45)] active:scale-[0.99] disabled:opacity-75 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="size-5.5 animate-spin" />
                <span>Uploading Evidence &amp; Broadcasting Dispatch...</span>
              </>
            ) : (
              <>
                <Siren className="size-6 animate-pulse text-white" />
                <span>⚡ Submit Emergency Incident &amp; Alert Responders</span>
              </>
            )}
          </Button>

          <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 font-medium px-1 pt-1 gap-2 text-center sm:text-left">
            <span className="flex items-center gap-1.5 text-slate-600 font-semibold">
              <Lock className="size-3.5 text-emerald-600" /> Encrypted National Dispatch Feed
            </span>
            <span className="flex items-center gap-1.5 text-slate-500">
              <Radio className="size-3.5 text-brand-red animate-pulse" /> Instant broadcast to 5km radius responders &amp; admin radar
            </span>
          </div>
        </div>
      </form>
    </FormProvider>
  );
}

