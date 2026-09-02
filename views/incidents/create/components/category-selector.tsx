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
      <label className="mb-1.5 block text-xs font-bold text-foreground">
        Incident Category <span className="text-destructive">*</span>
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
          className={`w-full rounded-xl border bg-slate-50/50 text-sm font-medium transition focus-within:bg-card ${
            errors.incidentCategoryId
              ? "border-destructive focus-within:border-destructive focus-within:ring-2 focus-within:ring-destructive/20"
              : "border-input focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20"
          }`}
        />
        <ComboboxContent className="rounded-2xl border border-border bg-card p-1.5 shadow-lg">
          <ComboboxEmpty className="py-4 text-center text-xs text-muted-foreground">
            No matching incident category found.
          </ComboboxEmpty>
          <ComboboxList className="max-h-60 space-y-1">
            {(item: IncidentCategory) => (
              <ComboboxItem
                key={item.id}
                value={item}
                className="flex cursor-pointer items-center justify-between rounded-xl px-3 py-2 text-xs font-bold text-foreground hover:bg-accent hover:text-accent-foreground data-highlighted:bg-accent data-highlighted:text-accent-foreground"
              >
                <div className="flex flex-col">
                  <span>{item.name}</span>
                  {item.description && (
                    <span className="text-[10px] font-normal text-muted-foreground">
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
        <p className="mt-1 text-[11px] font-medium text-destructive">
          {errors.incidentCategoryId.message}
        </p>
      )}
    </div>
  );
}
