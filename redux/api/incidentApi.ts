import { baseApi } from "./baseApi";
import type { ApiResponse } from "@/types/auth.types";
import type {
  IncidentCategory,
  AdminIncidentCategory,
  CreateCategoryInput,
  UpdateCategoryInput,
  Incident,
  IncidentStatusHistoryItem,
  CreateIncidentRequest,
  CreateIncidentResponseData,
  IncidentStatus,
  NationalCrisisTelemetry,
} from "@/types/incident.types";

export const incidentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getIncidentCategories: builder.query<ApiResponse<IncidentCategory[]>, void>({
      query: () => ({
        url: "/incident-categories",
        method: "GET",
      }),
      providesTags: ["Incident"],
    }),

    getAdminIncidentCategories: builder.query<ApiResponse<AdminIncidentCategory[]>, void>({
      query: () => ({
        url: "/incident-categories/admin/all",
        method: "GET",
      }),
      providesTags: ["Incident"],
    }),

    getNationalCrisisTelemetry: builder.query<ApiResponse<NationalCrisisTelemetry>, void>({
      query: () => ({
        url: "/incidents/admin/telemetry-map",
        method: "GET",
      }),
      providesTags: ["Incident"],
    }),

    seedNationwideCrisisData: builder.mutation<ApiResponse<any>, void>({
      query: () => ({
        url: "/incidents/admin/seed-telemetry",
        method: "POST",
      }),
      invalidatesTags: ["Incident", "Volunteer"],
    }),

    createIncidentCategory: builder.mutation<ApiResponse<AdminIncidentCategory>, CreateCategoryInput>({
      query: (body) => ({
        url: "/incident-categories/admin",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Incident"],
    }),

    updateIncidentCategory: builder.mutation<ApiResponse<AdminIncidentCategory>, UpdateCategoryInput>({
      query: ({ id, ...body }) => ({
        url: `/incident-categories/admin/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Incident"],
    }),

    toggleIncidentCategoryStatus: builder.mutation<ApiResponse<AdminIncidentCategory>, number>({
      query: (id) => ({
        url: `/incident-categories/admin/${id}/toggle`,
        method: "PATCH",
      }),
      invalidatesTags: ["Incident"],
    }),

    deleteIncidentCategory: builder.mutation<ApiResponse<null>, number>({
      query: (id) => ({
        url: `/incident-categories/admin/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Incident"],
    }),

    getPublicVerifiedIncidents: builder.query<
      ApiResponse<Incident[]>,
      { limit?: number } | void
    >({
      query: (params) => ({
        url: "/incidents/public/verified",
        method: "GET",
        params: params || {},
      }),
      providesTags: ["Incident"],
    }),

    createIncident: builder.mutation<
      ApiResponse<CreateIncidentResponseData>,
      CreateIncidentRequest
    >({
      query: (body) => ({
        url: "/incidents",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Incident"],
    }),

    getMyIncidents: builder.query<ApiResponse<Incident[]>, void>({
      query: () => ({
        url: "/incidents/my",
        method: "GET",
      }),
      providesTags: ["Incident"],
    }),

    getAllIncidents: builder.query<
      ApiResponse<Incident[]>,
      { status?: string; categoryId?: number; search?: string; limit?: number; page?: number } | void
    >({
      query: (params) => ({
        url: "/incidents",
        method: "GET",
        params: params || {},
      }),
      providesTags: ["Incident"],
    }),

    getAdminOverviewStats: builder.query<
      ApiResponse<{
        metrics: {
          totalIncidents: number;
          pendingVerification: number;
          activeDispatches: number;
          resolvedIncidents: number;
          criticalActive: number;
          verifiedVolunteers: number;
          pendingVolunteers?: number;
          verifiedDonors: number;
          pendingDonors?: number;
          totalHospitals: number;
        };
        categoryBreakdown: Array<{ categoryName: string; count: number }>;
        severityDistribution: Array<{ severity: string; count: number }>;
      }>,
      void
    >({
      query: () => ({
        url: "/incidents/admin/overview-stats",
        method: "GET",
      }),
      providesTags: ["Incident"],
    }),

    getIncidentById: builder.query<ApiResponse<Incident>, number | string>({
      query: (id) => ({
        url: `/incidents/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Incident", id }],
    }),

    getIncidentHistory: builder.query<
      ApiResponse<IncidentStatusHistoryItem[]>,
      number | string
    >({
      query: (id) => ({
        url: `/incidents/${id}/history`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Incident", id: `${id}-history` }],
    }),

    getNearbyVolunteersForIncident: builder.query<
      ApiResponse<{
        incident: any;
        radiusKm: number;
        totalVolunteersCount: number;
        matchedWithinRadiusCount: number;
        volunteers: Array<{
          userId: number;
          name: string;
          phone: string;
          email: string;
          district?: string;
          upazila?: string;
          volunteerStatus: "AVAILABLE" | "UNAVAILABLE" | "SUSPENDED";
          verificationStatus: string;
          serviceRadiusKm: number;
          experienceYears?: number;
          distanceKm: number;
          isWithinRadius: boolean;
          isDispatched: boolean;
          dispatchStatus?: string | null;
          skills: Array<{ name: string; level: string }>;
        }>;
      }>,
      { incidentId: number | string; radius?: number }
    >({
      query: ({ incidentId, radius = 5 }) => ({
        url: `/incidents/${incidentId}/nearby-volunteers`,
        method: "GET",
        params: { radius },
      }),
      providesTags: (result, error, { incidentId }) => [
        { type: "Incident", id: `${incidentId}-radar` },
        "Volunteer",
      ],
    }),

    dispatchIncidentToVolunteers: builder.mutation<
      ApiResponse<{ success: boolean; incidentId: number; dispatchedCount: number; message: string }>,
      { incidentId: number | string; volunteerUserIds: number[]; note?: string }
    >({
      query: ({ incidentId, ...body }) => ({
        url: `/incidents/${incidentId}/dispatch`,
        method: "POST",
        body,
      }),
      invalidatesTags: (result, error, { incidentId }) => [
        "Incident",
        "Volunteer",
        { type: "Incident", id: incidentId },
        { type: "Incident", id: `${incidentId}-radar` },
        { type: "Incident", id: `${incidentId}-responders` },
      ],
    }),

    getIncidentDispatchedResponders: builder.query<
      ApiResponse<
        Array<{
          requestId: number;
          volunteerUserId: number;
          requestStatus: string;
          respondedAt: string;
          declineReason?: string;
          responseId?: number;
          missionStatus?: string;
          acceptedAt?: string;
          enRouteAt?: string;
          arrivedAt?: string;
          completedAt?: string;
          volunteerName: string;
          volunteerPhone: string;
          volunteerEmail: string;
          dutyStatus: string;
        }>
      >,
      number | string
    >({
      query: (incidentId) => ({
        url: `/incidents/${incidentId}/responders`,
        method: "GET",
      }),
      providesTags: (result, error, incidentId) => [
        { type: "Incident", id: `${incidentId}-responders` },
        "Volunteer",
      ],
    }),

    updateIncidentStatus: builder.mutation<
      ApiResponse<{ oldStatus: IncidentStatus; newStatus: IncidentStatus }>,
      { id: number | string; status: IncidentStatus; note?: string }
    >({
      query: ({ id, ...body }) => ({
        url: `/incidents/${id}/status`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        "Incident",
        "Volunteer",
        { type: "Incident", id },
        { type: "Incident", id: `${id}-history` },
        { type: "Incident", id: `${id}-radar` },
        { type: "Incident", id: `${id}-responders` },
      ],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetIncidentCategoriesQuery,
  useGetAdminIncidentCategoriesQuery,
  useGetNationalCrisisTelemetryQuery,
  useSeedNationwideCrisisDataMutation,
  useCreateIncidentCategoryMutation,
  useUpdateIncidentCategoryMutation,
  useToggleIncidentCategoryStatusMutation,
  useDeleteIncidentCategoryMutation,
  useGetPublicVerifiedIncidentsQuery,
  useCreateIncidentMutation,
  useGetMyIncidentsQuery,
  useGetAllIncidentsQuery,
  useGetAdminOverviewStatsQuery,
  useGetIncidentByIdQuery,
  useGetIncidentHistoryQuery,
  useGetNearbyVolunteersForIncidentQuery,
  useDispatchIncidentToVolunteersMutation,
  useGetIncidentDispatchedRespondersQuery,
  useUpdateIncidentStatusMutation,
} = incidentApi;
