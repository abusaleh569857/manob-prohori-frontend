const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api";

export const baseApiConfig = {
  baseUrl: API_BASE_URL.replace(/\/+$/, ""),
  endpoints: {
    auth: {
      register: "/auth/register",
      login: "/auth/login",
      profile: "/auth/profile",
      changePassword: "/auth/change-password",
    },
    volunteers: "/volunteers",
    incidents: "/incidents",
    blood: "/blood",
    hospitals: "/hospitals",
    relief: "/relief",
  },
} as const;
