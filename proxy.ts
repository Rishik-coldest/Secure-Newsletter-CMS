import { auth } from "@/auth" // Imports your NextAuth configuration instance

export const proxy = auth((req) => {
  const isLoggedIn = !!req.auth;
  const isDashboardRoute = req.nextUrl.pathname.startsWith("/dashboard");

  // If a user attempts to access /dashboard sub-routes without an active session, redirect them to login
  if (isDashboardRoute && !isLoggedIn) {
    const loginUrl = new URL("/login", req.nextUrl.origin);
    return Response.redirect(loginUrl);
  }
})

// Matcher config filters out static system routes to prevent breaking styling, icons, and fonts
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
