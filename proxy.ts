// proxy.ts
import { auth } from "@/auth";

export const proxy = auth;

export const config = {
  // Matches all routes except system files, static files, images, or favicon assets
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
