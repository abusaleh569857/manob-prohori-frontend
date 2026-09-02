import { baseApi } from "./baseApi";

export interface AdminStatsResponse {
  totalIncidents: number;
  activeIncidents: number;
  resolvedIncidents: number;
  totalVolunteers: number;
  verifiedVolunteers: number;
  activeVolunteers: number;
  totalDonors: number;
  verifiedDonors: number;
  totalReliefAmount: number;
  reliefRequestsCount: number;
  responseRatePercent: number;
  incidentTrend: { time: string; incidents: number; resolved: number }[];
  categoryDistribution: { name: string; value: number; fill?: string }[];
  severityDistribution: { severity: string; count: number; fill?: string }[];
}

export const adminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminStats: builder.query<{ success: boolean; data: AdminStatsResponse }, void>({
      query: () => "/admin/stats",
      providesTags: ["Admin"],
    }),

    getAdminIncidents: builder.query<
      { success: boolean; data: any[] },
      { status?: string; severity?: string; categoryId?: number; limit?: number } | void
    >({
      query: (params) => ({
        url: "/admin/incidents",
        params: params || {},
      }),
      providesTags: ["Incident", "Admin"],
    }),

    updateAdminIncidentStatus: builder.mutation<
      { success: boolean; message: string },
      { incidentId: number | string; status: string; note?: string }
    >({
      query: ({ incidentId, ...body }) => ({
        url: `/admin/incidents/${incidentId}/status`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Incident", "Admin"],
    }),

    getVolunteerVerifications: builder.query<
      { success: boolean; data: any[] },
      { status?: string } | void
    >({
      query: (params) => ({
        url: "/admin/volunteers",
        params: params || {},
      }),
      providesTags: ["Volunteer", "Admin"],
    }),

    verifyVolunteerStatus: builder.mutation<
      { success: boolean; message: string },
      { volunteerId: number | string; status: "APPROVED" | "REJECTED"; reason?: string }
    >({
      query: ({ volunteerId, ...body }) => ({
        url: `/admin/volunteers/${volunteerId}/verify`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Volunteer", "Admin"],
    }),

    getBloodDonorVerifications: builder.query<
      { success: boolean; data: any[] },
      { status?: string } | void
    >({
      query: (params) => ({
        url: "/admin/blood-donors",
        params: params || {},
      }),
      providesTags: ["Blood", "Admin"],
    }),

    verifyBloodDonorStatus: builder.mutation<
      { success: boolean; message: string },
      { donorId: number | string; status: "APPROVED" | "REJECTED"; notes?: string }
    >({
      query: ({ donorId, ...body }) => ({
        url: `/admin/blood-donors/${donorId}/verify`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Blood", "Admin"],
    }),

    getReliefVerificationList: builder.query<
      { success: boolean; data: any[] },
      { status?: string } | void
    >({
      query: (params) => ({
        url: "/admin/relief",
        params: params || {},
      }),
      providesTags: ["Relief", "Admin"],
    }),

    verifyReliefApplication: builder.mutation<
      { success: boolean; message: string },
      { reliefId: number | string; status: "APPROVED" | "REJECTED" | "UNDER_REVIEW"; rejectionReason?: string }
    >({
      query: ({ reliefId, ...body }) => ({
        url: `/admin/relief/${reliefId}/verify`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Relief", "Admin"],
    }),

    getAdminAuditLogs: builder.query<
      { success: boolean; data: any[] },
      { limit?: number; action?: string } | void
    >({
      query: (params) => ({
        url: "/admin/audit-logs",
        params: params || {},
      }),
      providesTags: ["AuditLog", "Admin"],
    }),
  }),
});

export const {
  useGetAdminStatsQuery,
  useGetAdminIncidentsQuery,
  useUpdateAdminIncidentStatusMutation,
  useGetVolunteerVerificationsQuery,
  useVerifyVolunteerStatusMutation,
  useGetBloodDonorVerificationsQuery,
  useVerifyBloodDonorStatusMutation,
  useGetReliefVerificationListQuery,
  useVerifyReliefApplicationMutation,
  useGetAdminAuditLogsQuery,
} = adminApi;
