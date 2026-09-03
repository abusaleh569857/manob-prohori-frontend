"use client";

import { useFormContext } from "react-hook-form";
import type { IncidentFormValues } from "@/lib/validations/incident.schema";
import type { IncidentSeverity } from "@/types/incident.types";

const severities: Array<{
  value: IncidentSeverity;
  label: string;
  desc: string;
  badgeClass: string;
  activeBorder: string;
}> = [
  {
    value: "LOW",
    label: "Low",
    desc: "Minor incident, no immediate danger",
    badgeClass: "bg-slate-100 text-slate-700",
    activeBorder: "border-slate-400 ring-slate-200",
  },
  {
    value: "MEDIUM",
    label: "Medium",
    desc: "Moderate incident, needs attention",
    badgeClass: "bg-blue-100 text-blue-700",
    activeBorder: "border-blue-500 ring-blue-200 bg-blue-50/30",
  },
  {
    value: "HIGH",
    label: "High",
    desc: "Urgent threat to property or life",
    badgeClass: "bg-orange-100 text-orange-700",
    activeBorder: "border-orange-500 ring-orange-200 bg-orange-50/30",
  },
  {
    value: "CRITICAL",
    label: "Critical",
    desc: "Severe life-threatening emergency",
    badgeClass: "bg-red-100 text-red-700",
    activeBorder: "border-red-600 ring-red-200 bg-red-50/40",
  },
];

export function SeveritySelector() {
  const {
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<IncidentFormValues>();

  const selectedSeverity = watch("severity");

  return (
    <div>
      <label className="mb-2 block text-xs font-bold text-foreground">
        Severity Level <span className="text-destructive">*</span>
      </label>
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        {severities.map((item) => {
          const isSelected = selectedSeverity === item.value;
          return (
            <button
              key={item.value}
              type="button"
              onClick={() => setValue("severity", item.value, { shouldValidate: true })}
              className={`flex flex-col items-start rounded-2xl border p-3 text-left transition-all ${
                isSelected
                  ? `${item.activeBorder} ring-2`
                  : "border-border bg-slate-50/50 hover:bg-card"
              }`}
            >
              <span
                className={`rounded-lg px-2 py-0.5 text-[11px] font-black uppercase tracking-wider ${item.badgeClass}`}
              >
                {item.label}
              </span>
              <span className="mt-1 text-[11px] font-medium text-muted-foreground leading-tight">
                {item.desc}
              </span>
            </button>
          );
        })}
      </div>
      {errors.severity && (
        <p className="mt-1 text-[11px] font-medium text-destructive">
          {errors.severity.message}
        </p>
      )}
    </div>
  );
}
