import { baseApi } from "./baseApi";
import type { ApiResponse } from "@/types/auth.types";
import type {
  IncidentCategory,
  Incident,
  IncidentStatusHistoryItem,
  CreateIncidentRequest,
  CreateIncidentResponseData,
  IncidentStatus,
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
          verifiedDonors: number;
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
        { type: "Incident", id },
        { type: "Incident", id: `${id}-history` },
      ],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetIncidentCategoriesQuery,
  useGetPublicVerifiedIncidentsQuery,
  useCreateIncidentMutation,
  useGetMyIncidentsQuery,
  useGetAllIncidentsQuery,
  useGetAdminOverviewStatsQuery,
  useGetIncidentByIdQuery,
  useGetIncidentHistoryQuery,
  useUpdateIncidentStatusMutation,
} = incidentApi;
