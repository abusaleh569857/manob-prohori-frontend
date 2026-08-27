import { z } from "zod";

export const incidentFormSchema = z.object({
  incidentCategoryId: z
    .number({
      required_error: "Please select an incident category",
      invalid_type_error: "Please select a valid incident category",
    })
    .positive("Please select an incident category"),

  title: z
    .string()
    .min(1, "Title is required")
    .min(5, "Title must be at least 5 characters long")
    .max(200, "Title cannot exceed 200 characters"),

  description: z
    .string()
    .min(1, "Description is required")
    .min(10, "Please describe the incident in detail (at least 10 characters)"),

  severity: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"], {
    required_error: "Please select incident severity",
  }),

  latitude: z
    .number({
      required_error: "Location is required. Please click 'Use Current Location'",
      invalid_type_error: "Location is required. Please click 'Use Current Location'",
    })
    .min(-90)
    .max(90),

  longitude: z
    .number({
      required_error: "Location is required. Please click 'Use Current Location'",
      invalid_type_error: "Location is required. Please click 'Use Current Location'",
    })
    .min(-180)
    .max(180),

  locationAccuracyMeters: z.number().optional().nullable(),
  addressText: z.string().optional().nullable(),
  areaName: z.string().optional().nullable(),
  district: z.string().optional().nullable(),
  upazila: z.string().optional().nullable(),
});

export type IncidentFormValues = z.infer<typeof incidentFormSchema>;
