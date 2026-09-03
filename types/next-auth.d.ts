import type { DefaultSession, User as DefaultUser } from "next-auth";
import type { User as BackendUser } from "./auth.types";

declare module "next-auth" {
  interface Session extends DefaultSession {
    backendAccessToken?: string;
    backendUser?: BackendUser;
    user: {
      id: string;
      phone?: string;
      email?: string | null;
      name?: string | null;
      image?: string | null;
      roles?: string[];
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    id: string;
    phone?: string;
    email?: string | null;
    name?: string | null;
    image?: string | null;
    backendAccessToken?: string;
    backendUser?: BackendUser;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    backendAccessToken?: string;
    backendUser?: BackendUser;
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    backendAccessToken?: string;
    backendUser?: BackendUser;
  }
}

