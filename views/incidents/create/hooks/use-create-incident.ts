"use client";

import { useState, useEffect, useRef } from "react";
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
import { uploadMultipleFiles, type UploadedImage } from "@/lib/upload-service";

export function useCreateIncident() {
  const router = useRouter();
  const hasRequestedLocation = useRef(false);
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [isUploadingPhotos, setIsUploadingPhotos] = useState(false);

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

  // Automatically request GPS location once on mount
  useEffect(() => {
    if (!hasRequestedLocation.current) {
      hasRequestedLocation.current = true;
      handleCaptureLocation();
    }
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
      setIsUploadingPhotos(true);

      // 1. Process and upload all attached incident photos
      const filesToUpload = images
        .map((img) => img.file)
        .filter((f): f is File => !!f);

      let finalImageUrls: string[] = [];
      if (filesToUpload.length > 0) {
        finalImageUrls = await uploadMultipleFiles(filesToUpload);
      }

      // 2. Submit payload with photo URLs
      const payload = {
        ...values,
        imageUrls: finalImageUrls,
      };

      const response = await createIncident(payload as any).unwrap();

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
    } finally {
      setIsUploadingPhotos(false);
    }
  };

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
    categories: categoriesResponse?.data || [],
    isLoadingCategories,
    isSubmitting: isSubmitting || isUploadingPhotos,
    isLocating,
    location,
    images,
    setImages,
    handleCaptureLocation,
  };
}
