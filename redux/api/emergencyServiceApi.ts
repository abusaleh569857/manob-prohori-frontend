import { baseApi } from "./baseApi";
import type { ApiResponse } from "@/types/auth.types";
import type { EmergencyService, EmergencyServiceContact } from "@/types/hospital.types";

export const emergencyServiceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getEmergencyServices: builder.query<
      ApiResponse<EmergencyService[]>,
      { type?: string; search?: string; region?: string } | void
    >({
      query: (params) => ({
        url: "/emergency-services",
        method: "GET",
        params: params || {},
      }),
      providesTags: ["EmergencyService"],
    }),

    createServiceContact: builder.mutation<
      ApiResponse<EmergencyServiceContact>,
      { emergencyServiceId: number; regionName?: string; phoneNumber: string; displayLabel?: string; isPrimary?: boolean }
    >({
      query: (body) => ({
        url: "/emergency-services/contacts",
        method: "POST",
        body,
      }),
      invalidatesTags: ["EmergencyService"],
    }),

    updateServiceContact: builder.mutation<
      ApiResponse<null>,
      { id: number; regionName?: string; phoneNumber?: string; displayLabel?: string; isPrimary?: boolean; isActive?: boolean }
    >({
      query: ({ id, ...body }) => ({
        url: `/emergency-services/contacts/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["EmergencyService"],
    }),

    deleteServiceContact: builder.mutation<ApiResponse<null>, number>({
      query: (id) => ({
        url: `/emergency-services/contacts/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["EmergencyService"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetEmergencyServicesQuery,
  useCreateServiceContactMutation,
  useUpdateServiceContactMutation,
  useDeleteServiceContactMutation,
} = emergencyServiceApi;
