import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

// ============================================================================
// Protected Routes & Role Requirements Mapping
// ============================================================================
const roleProtectedPrefixes: { prefix: string; requiredRole?: string }[] = [
  { prefix: "/admin", requiredRole: "ADMIN" },
  { prefix: "/volunteer/dashboard", requiredRole: "VOLUNTEER" },
  { prefix: "/donor/dashboard", requiredRole: "BLOOD_DONOR" },
  { prefix: "/dashboard" },
  { prefix: "/incidents/create" },
  { prefix: "/incidents/my" },
  { prefix: "/profile" },
  { prefix: "/settings" },
];

const authRoutes = ["/signin", "/signup"];

export default auth((req) => {
  const { nextUrl } = req;
  const session = req.auth;
  const isAuthenticated = !!session?.user;
  const userRoles = (session?.user?.roles as string[]) || [];
  const isAdmin = userRoles.includes("ADMIN") || userRoles.includes("SUPER_ADMIN");

  // 1. Check if route requires authentication or specific role
  const matchingRule = roleProtectedPrefixes.find((rule) =>
    nextUrl.pathname.startsWith(rule.prefix)
  );

  if (matchingRule) {
    // If not authenticated, redirect to signin with callbackUrl
    if (!isAuthenticated) {
      const callbackUrl = encodeURIComponent(nextUrl.pathname + nextUrl.search);
      const signinUrl = new URL(`/signin?callbackUrl=${callbackUrl}`, nextUrl);
      return NextResponse.redirect(signinUrl);
    }

    // If role required, check if user has that role
    if (matchingRule.requiredRole) {
      const hasRequiredRole =
        userRoles.includes(matchingRule.requiredRole) ||
        userRoles.includes("SUPER_ADMIN");

      if (!hasRequiredRole) {
        // Redirect to citizen dashboard if role permission denied
        return NextResponse.redirect(
          new URL("/dashboard?access_denied=true", nextUrl)
        );
      }
    }
  }

  // 2. Priority Rule for Admin:
  // If user has ADMIN role and accesses `/dashboard` directly without explicit ?workspace=citizen, redirect to `/admin/dashboard`
  if (
    nextUrl.pathname === "/dashboard" &&
    isAuthenticated &&
    isAdmin &&
    nextUrl.searchParams.get("workspace") !== "citizen"
  ) {
    return NextResponse.redirect(new URL("/admin/dashboard", nextUrl));
  }

  // 3. If logged in and accessing signin/signup:
  if (authRoutes.some((route) => nextUrl.pathname.startsWith(route)) && isAuthenticated) {
    if (isAdmin) {
      return NextResponse.redirect(new URL("/admin/dashboard", nextUrl));
    }
    return NextResponse.redirect(new URL("/dashboard", nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (NextAuth API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, images, icons (public assets)
     */
    "/((?!api/auth|_next/static|_next/image|favicon.ico|images|icons|.*\\..*).*)",
  ],
};
