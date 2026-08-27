import { baseApi } from "./baseApi";
import { baseApiConfig } from "@/config/baseapi.config";
import type {
  ApiResponse,
  AuthResponseData,
  RegisterRequest,
  LoginRequest,
  UserProfile,
} from "@/types/auth.types";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation<ApiResponse<AuthResponseData>, RegisterRequest>({
      query: (userData) => ({
        url: baseApiConfig.endpoints.auth.register,
        method: "POST",
        body: userData,
      }),
      invalidatesTags: ["Auth", "User"],
    }),

    login: builder.mutation<ApiResponse<AuthResponseData>, LoginRequest>({
      query: (credentials) => ({
        url: baseApiConfig.endpoints.auth.login,
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["Auth", "User"],
    }),

    getProfile: builder.query<ApiResponse<UserProfile>, void>({
      query: () => ({
        url: baseApiConfig.endpoints.auth.profile,
        method: "GET",
      }),
      providesTags: ["Auth", "User"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useGetProfileQuery,
  useLazyGetProfileQuery,
} = authApi;
