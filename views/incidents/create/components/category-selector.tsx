"use client";

import { useFormContext } from "react-hook-form";
import { Flame, AlertTriangle, Activity, Car, HelpCircle, Waves, ChevronDown } from "lucide-react";
import type { IncidentCategory } from "@/types/incident.types";
import type { IncidentFormValues } from "@/lib/validations/incident.schema";

interface CategorySelectorProps {
  categories: IncidentCategory[];
  isLoading: boolean;
}

const getCategoryIcon = (iconName: string | null, slug: string) => {
  if (iconName === "flame" || slug.includes("fire")) return Flame;
  if (slug.includes("medical") || slug.includes("health")) return Activity;
  if (slug.includes("accident") || slug.includes("traffic")) return Car;
  if (slug.includes("flood") || slug.includes("cyclone")) return Waves;
  return AlertTriangle;
};

export function CategorySelector({ categories, isLoading }: CategorySelectorProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext<IncidentFormValues>();

  return (
    <div>
      <label className="mb-1.5 block text-xs font-bold text-slate-700">
        Incident Category <span className="text-red-500">*</span>
      </label>
      <div className="relative">
        <select
          {...register("incidentCategoryId", { valueAsNumber: true })}
          disabled={isLoading}
          className={`w-full appearance-none rounded-xl border bg-slate-50/50 py-3 pl-4 pr-10 text-sm font-semibold text-slate-800 transition focus:bg-white focus:outline-none focus:ring-2 ${
            errors.incidentCategoryId
              ? "border-red-400 focus:border-red-500 focus:ring-red-500/20"
              : "border-slate-200 focus:border-red-500 focus:ring-red-500/20"
          }`}
        >
          <option value="0">
            {isLoading ? "Loading categories..." : "Select Incident Category ▼"}
          </option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name} {cat.description ? `(${cat.description})` : ""}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
      </div>
      {errors.incidentCategoryId && (
        <p className="mt-1 text-[11px] font-medium text-red-500">
          {errors.incidentCategoryId.message}
        </p>
      )}
    </div>
  );
}
