import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import type { User as BackendUser } from "@/types/auth.types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api";

export const { handlers, signIn, signOut, auth } = NextAuth({
  secret: process.env.AUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/signin",
  },
  providers: [
    Credentials({
      id: "credentials",
      name: "Phone / Email and Password",
      credentials: {
        identifier: { label: "Phone or Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.identifier || !credentials?.password) {
          throw new Error("Phone/email and password are required");
        }

        try {
          const res = await fetch(`${API_BASE_URL}/auth/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify({
              identifier: credentials.identifier,
              password: credentials.password,
            }),
          });

          const data = await res.json();

          if (!res.ok || !data.success) {
            throw new Error(data.message || "Invalid login credentials");
          }

          const { token, user } = data.data as {
            token: string;
            user: BackendUser;
          };

          return {
            id: String(user.id),
            name: user.fullName,
            email: user.email || "",
            phone: user.phone,
            image: user.profilePhotoUrl,
            backendAccessToken: token,
            backendUser: user,
          };
        } catch (error: any) {
          console.error("NextAuth authorize error:", error.message);
          throw new Error(error.message || "Failed to authenticate");
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const u = user as unknown as {
          backendAccessToken?: string;
          backendUser?: BackendUser;
        };
        token.backendAccessToken = u.backendAccessToken;
        token.backendUser = u.backendUser;
      }
      return token;
    },
    async session({ session, token }) {
      const customToken = token as typeof token & {
        backendAccessToken?: string;
        backendUser?: BackendUser;
      };

      session.backendAccessToken = customToken.backendAccessToken;
      session.backendUser = customToken.backendUser;

      if (customToken.backendUser) {
        session.user = {
          ...session.user,
          id: String(customToken.backendUser.id),
          name: customToken.backendUser.fullName,
          email: customToken.backendUser.email || "",
          phone: customToken.backendUser.phone,
          roles: customToken.backendUser.roles,
        };
      }

      return session;
    },
  },
});
