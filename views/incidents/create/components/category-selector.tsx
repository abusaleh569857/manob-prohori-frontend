"use client";

import { useFormContext } from "react-hook-form";
import {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  ComboboxEmpty,
} from "@/components/ui/combobox";
import type { IncidentCategory } from "@/types/incident.types";
import type { IncidentFormValues } from "@/lib/validations/incident.schema";

interface CategorySelectorProps {
  categories: IncidentCategory[];
  isLoading: boolean;
}

export function CategorySelector({
  categories,
  isLoading,
}: CategorySelectorProps) {
  const {
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<IncidentFormValues>();

  const selectedId = watch("incidentCategoryId");
  const selectedCategory =
    categories.find((c) => c.id === selectedId) || null;

  return (
    <div>
      <label className="mb-1.5 block text-xs font-bold text-slate-700">
        Incident Category <span className="text-red-500">*</span>
      </label>

      <Combobox
        items={categories}
        value={selectedCategory}
        onValueChange={(cat: IncidentCategory | null) => {
          if (cat) {
            setValue("incidentCategoryId", cat.id, {
              shouldValidate: true,
              shouldDirty: true,
              shouldTouch: true,
            });
          } else {
            setValue("incidentCategoryId", 0, {
              shouldValidate: true,
            });
          }
        }}
        itemToStringLabel={(item: IncidentCategory | null) => item?.name ?? ""}
        itemToStringValue={(item: IncidentCategory | null) =>
          item ? String(item.id) : ""
        }
      >
        <ComboboxInput
          placeholder={
            isLoading
              ? "Loading incident categories..."
              : "Search or select incident category..."
          }
          disabled={isLoading}
          showTrigger
          showClear
          className={`w-full rounded-xl border bg-slate-50/50 text-sm font-medium transition focus-within:bg-white ${
            errors.incidentCategoryId
              ? "border-red-400 focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-500/20"
              : "border-slate-200 focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-500/20"
          }`}
        />
        <ComboboxContent className="rounded-2xl border border-slate-200 bg-white p-1.5 shadow-lg">
          <ComboboxEmpty className="py-4 text-center text-xs text-slate-400">
            No matching incident category found.
          </ComboboxEmpty>
          <ComboboxList className="max-h-60 space-y-1">
            {(item: IncidentCategory) => (
              <ComboboxItem
                key={item.id}
                value={item}
                className="flex cursor-pointer items-center justify-between rounded-xl px-3 py-2 text-xs font-bold text-slate-700 hover:bg-red-50 hover:text-red-600 data-highlighted:bg-red-50 data-highlighted:text-red-600"
              >
                <div className="flex flex-col">
                  <span>{item.name}</span>
                  {item.description && (
                    <span className="text-[10px] font-normal text-slate-400">
                      {item.description}
                    </span>
                  )}
                </div>
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>

      {errors.incidentCategoryId && (
        <p className="mt-1 text-[11px] font-medium text-red-500">
          {errors.incidentCategoryId.message}
        </p>
      )}
    </div>
  );
}
