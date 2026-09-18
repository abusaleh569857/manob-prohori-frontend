import { baseApi } from "./baseApi";
import type { ApiResponse } from "@/types/auth.types";
import type {
  Hospital,
  HospitalFilters,
  Specialty,
  CreateHospitalInput,
  UpdateHospitalInput,
} from "@/types/hospital.types";

export const hospitalApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getHospitals: builder.query<ApiResponse<Hospital[]>, HospitalFilters | void>({
      query: (params) => ({
        url: "/hospitals",
        method: "GET",
        params: params || {},
      }),
      providesTags: ["Hospital"],
    }),

    getHospitalById: builder.query<ApiResponse<Hospital>, number | string>({
      query: (id) => ({
        url: `/hospitals/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Hospital", id }],
    }),

    getSpecialties: builder.query<ApiResponse<Specialty[]>, void>({
      query: () => ({
        url: "/hospitals/specialties",
        method: "GET",
      }),
      providesTags: ["Hospital"],
    }),

    createHospital: builder.mutation<ApiResponse<Hospital>, CreateHospitalInput>({
      query: (body) => ({
        url: "/hospitals",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Hospital"],
    }),

    updateHospital: builder.mutation<ApiResponse<Hospital>, UpdateHospitalInput>({
      query: ({ id, ...body }) => ({
        url: `/hospitals/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        "Hospital",
        { type: "Hospital", id },
      ],
    }),

    toggleHospitalStatus: builder.mutation<ApiResponse<{ id: number; isActive: boolean }>, number | string>({
      query: (id) => ({
        url: `/hospitals/${id}/toggle`,
        method: "PATCH",
      }),
      invalidatesTags: (result, error, id) => [
        "Hospital",
        { type: "Hospital", id },
      ],
    }),

    deleteHospital: builder.mutation<ApiResponse<null>, number | string>({
      query: (id) => ({
        url: `/hospitals/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Hospital"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetHospitalsQuery,
  useGetHospitalByIdQuery,
  useGetSpecialtiesQuery,
  useCreateHospitalMutation,
  useUpdateHospitalMutation,
  useToggleHospitalStatusMutation,
  useDeleteHospitalMutation,
} = hospitalApi;
