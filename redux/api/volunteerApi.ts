import { baseApi } from "./baseApi";
import type { ApiResponse } from "@/types/auth.types";

export interface SkillOption {
  id: number;
  name: string;
  slug: string;
  description?: string;
}

export interface VolunteerProfile {
  userId: number;
  fullName: string;
  phone: string;
  email: string;
  volunteerStatus: "AVAILABLE" | "UNAVAILABLE" | "SUSPENDED";
  verificationStatus: "PENDING" | "APPROVED" | "REJECTED";
  serviceRadiusKm: number;
  experienceYears?: number;
  bio?: string;
  rejectionReason?: string;
  latitude?: number;
  longitude?: number;
  hasApplied?: boolean;
  verificationDocsCount?: number;
  skillsCount?: number;
  skills?: Array<{ id: number; name: string; slug: string; skillLevel: string; isVerified: boolean }>;
}


export interface VolunteerApplicationData {
  userId: number;
  fullName: string;
  phone: string;
  email: string;
  district?: string;
  upazila?: string;
  addressLine?: string;
  bio?: string;
  experienceYears?: number;
  serviceRadiusKm: number;
  verificationStatus: "PENDING" | "APPROVED" | "REJECTED";
  rejectionReason?: string;
  skills: Array<{ skillId: number; skillName: string; skillLevel: string; isVerified: boolean }>;
  documents: Array<{
    id: number;
    verificationType: string;
    status: string;
    documentUrl: string;
    title?: string;
    notes?: string;
    submittedAt: string;
  }>;
}

export interface SubmitVolunteerApplicationRequest {
  bio: string;
  experienceYears: number;
  preferredServiceRadiusKm: number;
  skills: Array<{ skillId: number; skillLevel: "BASIC" | "INTERMEDIATE" | "ADVANCED" | "EXPERT" }>;
  documents: Array<{
    verificationType: "TRAINING" | "PROFILE" | "EXPERIENCE" | "PHONE";
    documentUrl: string;
    title?: string;
    notes?: string;
  }>;
}

export interface AdminVolunteerListItem {
  id: number;
  userId: number;
  name: string;
  email: string;
  phone: string;
  location: string;
  district?: string;
  upazila?: string;
  serviceRadius: string;
  serviceRadiusKm: number;
  experienceYears: string;
  rawExperienceYears: number;
  verificationStatus: "PENDING" | "APPROVED" | "REJECTED" | "SUSPENDED";
  volunteerStatus: "AVAILABLE" | "UNAVAILABLE" | "SUSPENDED";
  bio?: string;
  rejectionReason?: string;
  submittedAt: string;
  updatedAt: string;
  skills: Array<{ name: string; level: string; isVerified: boolean }>;
  documents: Array<{
    name: string;
    url: string;
    type: string;
    notes?: string;
    status: string;
    submittedAt: string;
  }>;
}

export interface NearbyDispatchIncident {
  id: number;
  reportedBy: number;
  title: string;
  description: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  status: string;
  latitude: number;
  longitude: number;
  addressText?: string;
  areaName?: string;
  district?: string;
  reportedAt: string;
  createdAt?: string;
  categoryName: string;
  categoryIcon: string;
  reporterPhone?: string;
  reporterName?: string;
  distanceKm: number;
  imageUrls: string[];
  respondersCount: number;
}

export interface ActiveMission {
  responseId: number;
  missionStatus: "ACCEPTED" | "EN_ROUTE" | "ON_SCENE" | "COMPLETED" | "CANCELLED";
  acceptedAt: string;
  enRouteAt?: string;
  arrivedAt?: string;
  incidentId: number;
  title: string;
  description: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  incidentStatus: string;
  latitude: number;
  longitude: number;
  addressText?: string;
  areaName?: string;
  district?: string;
  reportedAt: string;
  categoryName: string;
  categoryIcon: string;
  reporterPhone?: string;
  reporterName?: string;
  imageUrls: string[];
}

export interface CompletedMission {
  responseId: number;
  missionStatus: string;
  acceptedAt: string;
  completedAt: string;
  incidentId: number;
  title: string;
  severity: string;
  addressText?: string;
  areaName?: string;
  categoryName: string;
}

export const volunteerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getVolunteerProfile: builder.query<ApiResponse<VolunteerProfile>, void>({
      query: () => ({
        url: "/volunteers/profile/me",
        method: "GET",
      }),
      providesTags: ["Volunteer"],
    }),

    getAvailableSkills: builder.query<ApiResponse<SkillOption[]>, void>({
      query: () => ({
        url: "/volunteers/skills",
        method: "GET",
      }),
      providesTags: ["Volunteer"],
    }),

    getVolunteerApplication: builder.query<ApiResponse<VolunteerApplicationData>, void>({
      query: () => ({
        url: "/volunteers/verification-application",
        method: "GET",
      }),
      providesTags: ["Volunteer"],
    }),

    submitVolunteerApplication: builder.mutation<
      ApiResponse<{ success: boolean; message: string }>,
      SubmitVolunteerApplicationRequest
    >({
      query: (body) => ({
        url: "/volunteers/verification-application",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Volunteer"],
    }),

    getAdminVolunteersList: builder.query<
      ApiResponse<AdminVolunteerListItem[]>,
      { status?: string; search?: string } | void
    >({
      query: (params) => ({
        url: "/volunteers/admin/list",
        method: "GET",
        params: params || {},
      }),
      providesTags: ["Volunteer"],
    }),

    verifyVolunteer: builder.mutation<
      ApiResponse<{ success: boolean; volunteerUserId: number; status: string }>,
      { userId: number | string; status: "APPROVED" | "REJECTED" | "SUSPENDED"; rejectionReason?: string }
    >({
      query: ({ userId, ...body }) => ({
        url: `/volunteers/admin/${userId}/verify`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Volunteer"],
    }),

    updateVolunteerStatus: builder.mutation<
      ApiResponse<{ volunteerStatus: "AVAILABLE" | "UNAVAILABLE" }>,
      { status: "AVAILABLE" | "UNAVAILABLE" }
    >({
      query: (body) => ({
        url: "/volunteers/status",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Volunteer"],
    }),

    updateVolunteerLocation: builder.mutation<
      ApiResponse<{ latitude: number; longitude: number }>,
      { latitude: number; longitude: number }
    >({
      query: (body) => ({
        url: "/volunteers/location",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Volunteer"],
    }),

    getNearbyDispatches: builder.query<ApiResponse<NearbyDispatchIncident[]>, void>({
      query: () => ({
        url: "/volunteers/dispatches/nearby",
        method: "GET",
      }),
      providesTags: ["Volunteer", "Incident"],
    }),

    getActiveMission: builder.query<ApiResponse<ActiveMission | null>, void>({
      query: () => ({
        url: "/volunteers/mission/active",
        method: "GET",
      }),
      providesTags: ["Volunteer", "Incident"],
    }),

    getMissionHistory: builder.query<ApiResponse<CompletedMission[]>, void>({
      query: () => ({
        url: "/volunteers/mission/history",
        method: "GET",
      }),
      providesTags: ["Volunteer"],
    }),

    acceptDispatch: builder.mutation<
      ApiResponse<{ status: string; incidentId: number }>,
      number | string
    >({
      query: (incidentId) => ({
        url: `/volunteers/dispatches/${incidentId}/accept`,
        method: "POST",
      }),
      invalidatesTags: ["Volunteer", "Incident"],
    }),

    declineDispatch: builder.mutation<
      ApiResponse<{ status: string; incidentId: number }>,
      { incidentId: number | string; reason?: string }
    >({
      query: ({ incidentId, reason }) => ({
        url: `/volunteers/dispatches/${incidentId}/decline`,
        method: "POST",
        body: { reason },
      }),
      invalidatesTags: ["Volunteer", "Incident"],
    }),

    updateMissionStatus: builder.mutation<
      ApiResponse<{ status: string; incidentId: number }>,
      {
        incidentId: number | string;
        status: "EN_ROUTE" | "ON_SCENE" | "COMPLETED" | "CANCELLED";
        note?: string;
      }
    >({
      query: ({ incidentId, ...body }) => ({
        url: `/volunteers/dispatches/${incidentId}/mission-status`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Volunteer", "Incident"],
    }),
  }),
  overrideExisting: true,
});

export const useGetVolunteerProfileQuery = volunteerApi.endpoints.getVolunteerProfile.useQuery;
export const useGetAvailableSkillsQuery = volunteerApi.endpoints.getAvailableSkills.useQuery;
export const useGetVolunteerApplicationQuery = volunteerApi.endpoints.getVolunteerApplication.useQuery;
export const useSubmitVolunteerApplicationMutation = volunteerApi.endpoints.submitVolunteerApplication.useMutation;
export const useGetAdminVolunteersListQuery = volunteerApi.endpoints.getAdminVolunteersList.useQuery;
export const useVerifyVolunteerMutation = volunteerApi.endpoints.verifyVolunteer.useMutation;
export const useUpdateVolunteerStatusMutation = volunteerApi.endpoints.updateVolunteerStatus.useMutation;
export const useUpdateVolunteerLocationMutation = volunteerApi.endpoints.updateVolunteerLocation.useMutation;
export const useGetNearbyDispatchesQuery = volunteerApi.endpoints.getNearbyDispatches.useQuery;
export const useGetActiveMissionQuery = volunteerApi.endpoints.getActiveMission.useQuery;
export const useGetMissionHistoryQuery = volunteerApi.endpoints.getMissionHistory.useQuery;
export const useAcceptDispatchMutation = volunteerApi.endpoints.acceptDispatch.useMutation;
export const useDeclineDispatchMutation = volunteerApi.endpoints.declineDispatch.useMutation;
export const useUpdateMissionStatusMutation = volunteerApi.endpoints.updateMissionStatus.useMutation;


