import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getSession } from "next-auth/react";
import { baseApiConfig } from "@/config/baseapi.config";

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: baseApiConfig.baseUrl,
    prepareHeaders: async (headers) => {
      try {
        const session = await getSession();
        const token = session?.backendAccessToken;

        if (token) {
          headers.set("Authorization", `Bearer ${token}`);
        }
      } catch (error) {
        console.error("Failed to retrieve session token:", error);
      }

      headers.set("Accept", "application/json");
      headers.set("Content-Type", "application/json");

      return headers;
    },
  }),
  tagTypes: [
    "Auth",
    "User",
    "Volunteer",
    "Incident",
    "Blood",
    "Hospital",
    "Relief",
  ],
  endpoints: () => ({}),
});
