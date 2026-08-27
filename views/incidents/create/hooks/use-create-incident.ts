"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  incidentFormSchema,
  type IncidentFormValues,
} from "@/lib/validations/incident.schema";
import {
  useGetIncidentCategoriesQuery,
  useCreateIncidentMutation,
} from "@/redux/api/incidentApi";
import { useGeolocation } from "@/hooks/use-geolocation";

export function useCreateIncident() {
  const router = useRouter();
  const { data: categoriesResponse, isLoading: isLoadingCategories } =
    useGetIncidentCategoriesQuery();
  const [createIncident, { isLoading: isSubmitting }] =
    useCreateIncidentMutation();
  const { getCurrentLocation, isLocating, location } = useGeolocation();

  const form = useForm<IncidentFormValues>({
    resolver: zodResolver(incidentFormSchema),
    defaultValues: {
      incidentCategoryId: 0,
      title: "",
      description: "",
      severity: "MEDIUM",
      latitude: undefined as any,
      longitude: undefined as any,
      locationAccuracyMeters: null,
      addressText: "",
      areaName: "",
      district: "",
      upazila: "",
    },
    mode: "onTouched",
  });

  // Automatically request GPS location on mount
  useEffect(() => {
    handleCaptureLocation();
  }, []);

  const handleCaptureLocation = async () => {
    const geo = await getCurrentLocation();
    if (geo) {
      form.setValue("latitude", geo.latitude, { shouldValidate: true });
      form.setValue("longitude", geo.longitude, { shouldValidate: true });
      if (geo.accuracy) form.setValue("locationAccuracyMeters", geo.accuracy);
      if (geo.addressText) form.setValue("addressText", geo.addressText);
      if (geo.district) form.setValue("district", geo.district);
      if (geo.upazila) form.setValue("upazila", geo.upazila);
      if (geo.areaName) form.setValue("areaName", geo.areaName);
    }
  };

  const onSubmit = async (values: IncidentFormValues) => {
    try {
      const response = await createIncident(values).unwrap();

      if (response.success && response.data) {
        toast.success("Incident reported successfully! Emergency units notified.");
        router.push(`/incidents/${response.data.id}`);
      }
    } catch (err: any) {
      console.error("Create incident error:", err);
      const errorMessage =
        err?.data?.message ||
        err?.message ||
        "Failed to report incident. Please check your inputs.";
      toast.error(errorMessage);
    }
  };

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
    categories: categoriesResponse?.data || [],
    isLoadingCategories,
    isSubmitting,
    isLocating,
    location,
    handleCaptureLocation,
  };
}
