"use client";

import { FormProvider } from "react-hook-form";
import { Loader2, Siren } from "lucide-react";
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
      <form onSubmit={onSubmit} className="space-y-4">
        {/* Category Dropdown (Dynamic from Database) */}
        <CategorySelector
          categories={categories}
          isLoading={isLoadingCategories}
        />

        {/* Incident Title */}
        <div>
          <label className="mb-1.5 block text-xs font-bold text-foreground">
            Incident Title <span className="text-destructive">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g. Fire in 4th floor residential building"
            {...register("title")}
            className={`w-full rounded-xl border bg-slate-50/50 py-2.5 px-3.5 text-sm font-medium text-foreground placeholder:text-muted-foreground transition focus:bg-card focus:outline-none focus:ring-2 ${
              errors.title
                ? "border-destructive focus:border-destructive focus:ring-destructive/20"
                : "border-input focus:border-primary focus:ring-primary/20"
            }`}
          />
          {errors.title && (
            <p className="mt-1 text-[11px] font-medium text-destructive">
              {errors.title.message}
            </p>
          )}
        </div>

        {/* Incident Description */}
        <div>
          <label className="mb-1.5 block text-xs font-bold text-foreground">
            Description <span className="text-destructive">*</span>
          </label>
          <textarea
            rows={3}
            placeholder="Provide specific details about the emergency, trapped victims, hazards, or immediate assistance needed..."
            {...register("description")}
            className={`w-full rounded-xl border bg-slate-50/50 py-2.5 px-3.5 text-sm font-medium text-foreground placeholder:text-muted-foreground transition focus:bg-card focus:outline-none focus:ring-2 ${
              errors.description
                ? "border-destructive focus:border-destructive focus:ring-destructive/20"
                : "border-input focus:border-primary focus:ring-primary/20"
            }`}
          />
          {errors.description && (
            <p className="mt-1 text-[11px] font-medium text-destructive">
              {errors.description.message}
            </p>
          )}
        </div>

        {/* Severity Selector */}
        <SeveritySelector />

        {/* Geolocation and Address Component */}
        <LocationPicker
          isLocating={isLocating}
          onCaptureLocation={handleCaptureLocation}
        />

        {/* Incident Photos / Damage Evidence Uploader */}
        <ImageUploader
          images={images}
          onImagesChange={setImages}
          maxFiles={5}
        />

        {/* Action Button */}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-extrabold text-primary-foreground shadow-lg shadow-primary/25 transition hover:bg-primary/90 active:scale-[0.99] disabled:opacity-70 cursor-pointer"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Uploading Photos &amp; Dispatching Emergency Report...
            </>
          ) : (
            <>
              <Siren className="size-4.5" />
              Submit &amp; Alert Responders
            </>
          )}
        </Button>
      </form>
    </FormProvider>
  );
}
