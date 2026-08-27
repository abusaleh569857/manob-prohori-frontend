"use client";

import { FormProvider } from "react-hook-form";
import { Loader2, Siren } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CategorySelector } from "./category-selector";
import { SeveritySelector } from "./severity-selector";
import { LocationPicker } from "./location-picker";
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
          <label className="mb-1.5 block text-xs font-bold text-slate-700">
            Incident Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g. Fire in 4th floor residential building"
            {...register("title")}
            className={`w-full rounded-xl border bg-slate-50/50 py-2.5 px-3.5 text-sm font-medium text-slate-800 placeholder-slate-400 transition focus:bg-white focus:outline-none focus:ring-2 ${
              errors.title
                ? "border-red-400 focus:border-red-500 focus:ring-red-500/20"
                : "border-slate-200 focus:border-red-500 focus:ring-red-500/20"
            }`}
          />
          {errors.title && (
            <p className="mt-1 text-[11px] font-medium text-red-500">
              {errors.title.message}
            </p>
          )}
        </div>

        {/* Incident Description */}
        <div>
          <label className="mb-1.5 block text-xs font-bold text-slate-700">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            rows={3}
            placeholder="Provide specific details about the emergency, trapped victims, hazards, or immediate assistance needed..."
            {...register("description")}
            className={`w-full rounded-xl border bg-slate-50/50 py-2.5 px-3.5 text-sm font-medium text-slate-800 placeholder-slate-400 transition focus:bg-white focus:outline-none focus:ring-2 ${
              errors.description
                ? "border-red-400 focus:border-red-500 focus:ring-red-500/20"
                : "border-slate-200 focus:border-red-500 focus:ring-red-500/20"
            }`}
          />
          {errors.description && (
            <p className="mt-1 text-[11px] font-medium text-red-500">
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

        {/* Action Button */}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-red-500/25 transition hover:bg-red-700 active:scale-[0.99] disabled:opacity-70"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Dispatching Emergency Report...
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
