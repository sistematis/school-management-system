/**
 * Next.js Middleware for Route Protection
 *
 * This middleware handles:
 * - Protecting login page from authenticated users
 * - Managing navigation flow for authenticated vs unauthenticated users
 */

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

/**
 * Check if user is authenticated by checking for auth cookie
 */
function isAuthenticated(request: NextRequest): boolean {
  // Check for the authentication cookie set by the auth store
  const authCookie = request.cookies.get("idempiere_authenticated");
  return authCookie?.value === "true";
}

/**
 * Protected routes that require authentication */
const protectedRoutes = ["/dashboard"];

/**
 * Public routes that authenticated users should be redirected away from */
const publicRoutes = ["/auth/login", "/auth/v1/login", "/auth/v2/login"];

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if user is authenticated
  const isAuth = isAuthenticated(request);

  // If user is authenticated and tries to access login pages, redirect to dashboard
  if (isAuth && publicRoutes.some((route) => pathname.startsWith(route))) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  // If user is not authenticated and tries to access protected routes, redirect to login
  if (!isAuth && protectedRoutes.some((route) => pathname.startsWith(route))) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

/**
 * Configure which routes the middleware should run on
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api routes
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, fonts, etc.)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
