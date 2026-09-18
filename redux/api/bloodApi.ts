import { baseApi } from "./baseApi";
import {
  BloodGroup,
  BloodDonorProfile,
  BloodRequest,
  BloodRequestMatch,
  AdminDonorItem,
  CreateBloodRequestInput,
  ApplyDonorInput,
  BloodRequestFilters,
  AdminDonorFilters,
} from "@/types/blood.types";

export const bloodApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // 1. Reference Data: Blood Groups
    getBloodGroups: builder.query<{ success: boolean; data: BloodGroup[] }, void>({
      query: () => "/api/blood/groups",
      providesTags: ["Blood"],
    }),

    // 2. Donor Profile (Logged-in user)
    getMyDonorProfile: builder.query<{ success: boolean; data: BloodDonorProfile | null }, void>({
      query: () => "/api/blood/donor/me",
      providesTags: ["BloodDonor"],
    }),

    // 3. Apply / Register as Donor
    applyAsDonor: builder.mutation<
      { success: boolean; message: string; data: any },
      ApplyDonorInput
    >({
      query: (body) => ({
        url: "/api/blood/donor/apply",
        method: "POST",
        body,
      }),
      invalidatesTags: ["BloodDonor", "Blood", "User"],
    }),

    // 4. Update Donor Availability
    updateDonorAvailability: builder.mutation<
      { success: boolean; message: string; data: { availability: 'AVAILABLE' | 'UNAVAILABLE' } },
      { availability: 'AVAILABLE' | 'UNAVAILABLE' }
    >({
      query: (body) => ({
        url: "/api/blood/donor/availability",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["BloodDonor"],
    }),

    // 5. Update Donor Profile details
    updateDonorProfile: builder.mutation<
      { success: boolean; message: string },
      { lastDonationDate?: string; latitude?: number; longitude?: number }
    >({
      query: (body) => ({
        url: "/api/blood/donor/profile",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["BloodDonor"],
    }),

    // 6. Matched Requests for Donor
    getDonorMatches: builder.query<
      { success: boolean; data: BloodRequestMatch[] },
      void
    >({
      query: () => "/api/blood/donor/matches",
      providesTags: ["BloodRequest"],
    }),

    // 7. Respond to Match (Accept / Decline)
    respondToBloodMatch: builder.mutation<
      { success: boolean; message: string },
      { matchId: number; status: 'ACCEPTED' | 'DECLINED' }
    >({
      query: ({ matchId, status }) => ({
        url: `/api/blood/donor/matches/${matchId}/respond`,
        method: "POST",
        body: { status },
      }),
      invalidatesTags: ["BloodRequest", "BloodDonor"],
    }),

    // 8. Public Blood Requests Feed
    getBloodRequests: builder.query<
      { success: boolean; data: { requests: BloodRequest[]; total: number } },
      BloodRequestFilters | void
    >({
      query: (params) => ({
        url: "/api/blood/requests",
        params: params || {},
      }),
      providesTags: ["BloodRequest"],
    }),

    // 9. Single Blood Request by ID
    getBloodRequestById: builder.query<
      { success: boolean; data: BloodRequest },
      number | string
    >({
      query: (id) => `/api/blood/requests/${id}`,
      providesTags: ["BloodRequest"],
    }),

    // 10. Create Blood Request
    createBloodRequest: builder.mutation<
      { success: boolean; message: string; data: { request: BloodRequest; matchedDonorsCount: number } },
      CreateBloodRequestInput
    >({
      query: (body) => ({
        url: "/api/blood/requests",
        method: "POST",
        body,
      }),
      invalidatesTags: ["BloodRequest"],
    }),

    // 11. Update Blood Request Status
    updateBloodRequestStatus: builder.mutation<
      { success: boolean; message: string },
      { id: number; status: 'OPEN' | 'FULFILLED' | 'CANCELLED' }
    >({
      query: ({ id, status }) => ({
        url: `/api/blood/requests/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["BloodRequest"],
    }),

    // 12. Search Verified Donors (Public)
    searchVerifiedDonors: builder.query<
      { success: boolean; data: { donors: any[]; total: number } },
      { bloodGroup?: string; division?: string; district?: string; search?: string; limit?: number; offset?: number } | void
    >({
      query: (params) => ({
        url: "/api/blood/donors/search",
        params: params || {},
      }),
      providesTags: ["BloodDonor"],
    }),

    // 13. Admin: Get Donors List
    getAdminBloodDonors: builder.query<
      { success: boolean; data: { donors: AdminDonorItem[]; total: number } },
      AdminDonorFilters | void
    >({
      query: (params) => ({
        url: "/api/blood/admin/donors",
        params: params || {},
      }),
      providesTags: ["BloodDonor", "Admin"],
    }),

    // 14. Admin: Review Donor
    reviewBloodDonor: builder.mutation<
      { success: boolean; message: string },
      { userId: number; status: 'APPROVED' | 'REJECTED'; notes?: string }
    >({
      query: ({ userId, status, notes }) => ({
        url: `/api/blood/admin/donors/${userId}/verify`,
        method: "PATCH",
        body: { status, notes },
      }),
      invalidatesTags: ["BloodDonor", "Admin", "User"],
    }),
  }),
});

export const {
  useGetBloodGroupsQuery,
  useGetMyDonorProfileQuery,
  useApplyAsDonorMutation,
  useUpdateDonorAvailabilityMutation,
  useUpdateDonorProfileMutation,
  useGetDonorMatchesQuery,
  useRespondToBloodMatchMutation,
  useGetBloodRequestsQuery,
  useGetBloodRequestByIdQuery,
  useCreateBloodRequestMutation,
  useUpdateBloodRequestStatusMutation,
  useSearchVerifiedDonorsQuery,
  useGetAdminBloodDonorsQuery,
  useReviewBloodDonorMutation,
} = bloodApi;
