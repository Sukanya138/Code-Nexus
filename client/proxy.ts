import { NextResponse, type NextRequest } from "next/server";

const AUTH_COOKIE = "devpilot_auth";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Accept either devpilot_auth or codenexus_auth for compatibility
  const isAuthed =
    request.cookies.get(AUTH_COOKIE)?.value === "1" ||
    request.cookies.get("codenexus_auth")?.value === "1";

  // Allow OAuth return path through without the frontend cookie yet
  if (pathname.startsWith("/auth/callback") || pathname.startsWith("/auth/")) {
    return NextResponse.next();
  }

  // Protect dashboard and chat routes
  if (pathname.startsWith("/dashboard") || pathname.startsWith("/chat")) {
    if (!isAuthed) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/login";
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // If already authenticated, redirect away from /login to dashboard
  if (pathname === "/login" && isAuthed) {
    const dash = request.nextUrl.clone();
    dash.pathname = "/dashboard";
    return NextResponse.redirect(dash);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/chat/:path*", "/login", "/auth/:path*"],
};
