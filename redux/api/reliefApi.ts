import { baseApi } from "./baseApi";
import {
  ReliefCampaign,
  CreateReliefRequestInput,
  RecordDonationInput,
  ReviewReliefRequestInput,
  ReliefFilters,
} from "@/types/relief.types";

export const reliefApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // 1. Public Verified Campaigns Directory
    getPublicReliefCampaigns: builder.query<
      { success: boolean; data: { campaigns: ReliefCampaign[]; total: number } },
      ReliefFilters | void
    >({
      query: (params) => ({
        url: "/relief/public",
        params: params || {},
      }),
      providesTags: ["Relief"],
    }),

    // 2. Single Relief Campaign by ID
    getReliefCampaignById: builder.query<{ success: boolean; data: ReliefCampaign }, number | string>({
      query: (id) => `/relief/${id}`,
      providesTags: ["Relief"],
    }),

    // 3. Submit Emergency Relief Request (Citizen)
    createReliefRequest: builder.mutation<
      { success: boolean; message: string; data: { id: number } },
      CreateReliefRequestInput
    >({
      query: (body) => ({
        url: "/relief",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Relief"],
    }),

    // 4. Get Logged-in Citizen's Relief Requests
    getMyReliefRequests: builder.query<{ success: boolean; data: ReliefCampaign[] }, void>({
      query: () => "/relief/my/requests",
      providesTags: ["Relief"],
    }),

    // 5. Record Direct Peer-to-Peer Donation Contribution
    recordDonation: builder.mutation<
      { success: boolean; message: string; data: { donationId: number; newCurrentAmount: number } },
      RecordDonationInput
    >({
      query: ({ reliefRequestId, ...body }) => ({
        url: `/relief/${reliefRequestId}/donate`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Relief"],
    }),

    // 6. Admin: List All Relief Requests
    getAdminReliefRequests: builder.query<
      { success: boolean; data: { requests: ReliefCampaign[]; total: number } },
      ReliefFilters | void
    >({
      query: (params) => ({
        url: "/relief/admin/list",
        params: params || {},
      }),
      providesTags: ["Relief", "Admin"],
    }),

    // 7. Admin: Review and Verify/Reject Relief Request
    reviewReliefRequest: builder.mutation<
      { success: boolean; message: string },
      ReviewReliefRequestInput
    >({
      query: ({ id, ...body }) => ({
        url: `/relief/admin/${id}/verify`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Relief", "Admin"],
    }),
  }),
});

export const {
  useGetPublicReliefCampaignsQuery,
  useGetReliefCampaignByIdQuery,
  useCreateReliefRequestMutation,
  useGetMyReliefRequestsQuery,
  useRecordDonationMutation,
  useGetAdminReliefRequestsQuery,
  useReviewReliefRequestMutation,
} = reliefApi;
